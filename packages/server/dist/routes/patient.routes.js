"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const readOnly_1 = require("../middleware/readOnly");
const Patient_1 = require("../models/Patient");
const Consultation_1 = require("../models/Consultation");
const gemini_service_1 = require("../services/gemini.service");
const FollowUpResponse_1 = require("../models/FollowUpResponse");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (req, res) => {
    try {
        const patients = await Patient_1.PatientModel.find({ doctorId: req.user?.doctorId }).sort({ createdAt: -1 });
        return res.json(patients);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const patient = await Patient_1.PatientModel.create({
            ...req.body,
            doctorId: req.user?.doctorId,
        });
        return res.status(201).json(patient);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient_1.PatientModel.findById(req.params.id);
        if (!patient)
            return res.status(404).json({ error: 'Patient not found' });
        const consultations = await Consultation_1.ConsultationModel.find({ patientId: patient._id }).sort({ createdAt: -1 });
        const responses = await FollowUpResponse_1.FollowUpResponseModel.find({ patientId: patient._id }).sort({ respondedAt: -1 });
        let summary = 'No responses recorded yet.';
        if (responses.length > 0 && consultations.length > 0) {
            const historyStr = responses
                .map((r) => `[${r.respondedAt.toISOString()}] Sentiment: ${r.sentiment}. Answers: ${r.answers.map((a) => a.answerText).join('; ')}`)
                .join('\n');
            summary = await gemini_service_1.GeminiService.generateRecoverySummary(consultations[0].diagnosis, historyStr);
        }
        return res.json({
            patient,
            consultations,
            responses,
            aiSummary: summary,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', readOnly_1.readOnlyMiddleware, async (req, res) => {
    try {
        await Patient_1.PatientModel.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Patient removed' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.patientRouter = router;
