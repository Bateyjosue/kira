"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappRouter = void 0;
const express_1 = require("express");
const env_1 = require("../config/env");
const Patient_1 = require("../models/Patient");
const Consultation_1 = require("../models/Consultation");
const FollowUp_1 = require("../models/FollowUp");
const FollowUpResponse_1 = require("../models/FollowUpResponse");
const gemini_service_1 = require("../services/gemini.service");
const alert_service_1 = require("../services/alert.service");
const whatsapp_service_1 = require("../services/whatsapp.service");
const router = (0, express_1.Router)();
// Meta WhatsApp Webhook verification
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === env_1.env.WHATSAPP_VERIFY_TOKEN) {
        console.log('✅ WhatsApp Webhook verified successfully');
        return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
});
// Meta WhatsApp Webhook receiver + Mock simulation endpoint
router.post('/webhook', async (req, res) => {
    try {
        const { fromPhone, messageText, patientId } = req.body;
        let targetPatient = null;
        if (patientId) {
            targetPatient = await Patient_1.PatientModel.findById(patientId);
        }
        else if (fromPhone) {
            targetPatient = await Patient_1.PatientModel.findOne({ phoneWhatsapp: fromPhone });
        }
        if (!targetPatient) {
            return res.status(404).json({ error: 'Patient not found for this WhatsApp incoming payload' });
        }
        const latestFollowUp = await FollowUp_1.FollowUpModel.findOne({
            patientId: targetPatient._id,
            status: { $in: ['sent', 'scheduled'] },
        }).sort({ createdAt: -1 });
        const latestConsultation = await Consultation_1.ConsultationModel.findOne({
            patientId: targetPatient._id,
            status: 'active',
        }).sort({ createdAt: -1 });
        const diagnosis = latestConsultation ? latestConsultation.diagnosis : 'Post-consultation recovery';
        // AI Analysis of patient reply
        const analysis = await gemini_service_1.GeminiService.analyzeResponse(diagnosis, messageText || 'Patient submitted updates');
        const responseDoc = await FollowUpResponse_1.FollowUpResponseModel.create({
            followUpId: latestFollowUp ? latestFollowUp._id : targetPatient._id,
            patientId: targetPatient._id,
            answers: [
                {
                    questionId: 'q1',
                    questionText: 'Patient follow-up update',
                    answerText: messageText || 'Update received',
                },
            ],
            sentiment: analysis.sentiment,
            aiSummary: analysis.aiSummary,
            hasRedFlag: analysis.hasRedFlag,
            respondedAt: new Date(),
        });
        if (latestFollowUp) {
            latestFollowUp.status = 'responded';
            await latestFollowUp.save();
        }
        // Trigger Doctor Alert if Red Flag / Critical
        if (analysis.hasRedFlag || analysis.sentiment === 'critical' || analysis.sentiment === 'negative') {
            await alert_service_1.AlertService.createAndEmitAlert({
                doctorId: targetPatient.doctorId.toString(),
                patientId: targetPatient._id.toString(),
                patientName: targetPatient.name,
                followUpResponseId: responseDoc._id.toString(),
                severity: analysis.sentiment === 'critical' ? 'critical' : 'high',
                message: `🔴 RED FLAG ALERT for ${targetPatient.name}: ${analysis.aiSummary}`,
            });
            await whatsapp_service_1.WhatsAppService.sendMessage(targetPatient.phoneWhatsapp, `⚠️ Thank you ${targetPatient.name}. We have flagged your symptoms and notified your doctor immediately. If this is an emergency, please visit the nearest clinic.`);
        }
        else {
            await whatsapp_service_1.WhatsAppService.sendMessage(targetPatient.phoneWhatsapp, `✅ Thank you ${targetPatient.name}. Your response has been logged for your doctor.`);
        }
        return res.status(200).json({ status: 'success', analysis, responseDoc });
    }
    catch (error) {
        console.error('❌ Webhook error:', error);
        return res.status(500).json({ error: error.message });
    }
});
// Helper endpoint to query sent WhatsApp messages log
router.get('/sent-log', (req, res) => {
    return res.json(whatsapp_service_1.WhatsAppService.getSentMessagesLog());
});
exports.whatsappRouter = router;
