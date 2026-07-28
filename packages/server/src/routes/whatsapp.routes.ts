import { Router, Request, Response } from 'express';
import { env } from '../config/env';
import { PatientModel } from '../models/Patient';
import { ConsultationModel } from '../models/Consultation';
import { FollowUpModel } from '../models/FollowUp';
import { FollowUpResponseModel } from '../models/FollowUpResponse';
import { GeminiService } from '../services/gemini.service';
import { AlertService } from '../services/alert.service';
import { WhatsAppService } from '../services/whatsapp.service';

const router = Router();

// Meta WhatsApp Webhook verification
router.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
    console.log('✅ WhatsApp Webhook verified successfully');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Meta WhatsApp Webhook receiver + Mock simulation endpoint
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { fromPhone, messageText, patientId } = req.body;

    let targetPatient = null;
    if (patientId) {
      targetPatient = await PatientModel.findById(patientId);
    } else if (fromPhone) {
      targetPatient = await PatientModel.findOne({ phoneWhatsapp: fromPhone });
    }

    if (!targetPatient) {
      return res.status(404).json({ error: 'Patient not found for this WhatsApp incoming payload' });
    }

    const latestFollowUp = await FollowUpModel.findOne({
      patientId: targetPatient._id,
      status: { $in: ['sent', 'scheduled'] },
    }).sort({ createdAt: -1 });

    const latestConsultation = await ConsultationModel.findOne({
      patientId: targetPatient._id,
      status: 'active',
    }).sort({ createdAt: -1 });

    const diagnosis = latestConsultation ? latestConsultation.diagnosis : 'Post-consultation recovery';

    // AI Analysis of patient reply
    const analysis = await GeminiService.analyzeResponse(diagnosis, messageText || 'Patient submitted updates');

    const responseDoc = await FollowUpResponseModel.create({
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
      await AlertService.createAndEmitAlert({
        doctorId: targetPatient.doctorId.toString(),
        patientId: targetPatient._id.toString(),
        patientName: targetPatient.name,
        followUpResponseId: responseDoc._id.toString(),
        severity: analysis.sentiment === 'critical' ? 'critical' : 'high',
        message: `🔴 RED FLAG ALERT for ${targetPatient.name}: ${analysis.aiSummary}`,
      });

      await WhatsAppService.sendMessage(
        targetPatient.phoneWhatsapp,
        `⚠️ Thank you ${targetPatient.name}. We have flagged your symptoms and notified your doctor immediately. If this is an emergency, please visit the nearest clinic.`
      );
    } else {
      await WhatsAppService.sendMessage(
        targetPatient.phoneWhatsapp,
        `✅ Thank you ${targetPatient.name}. Your response has been logged for your doctor.`
      );
    }

    return res.status(200).json({ status: 'success', analysis, responseDoc });
  } catch (error: any) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Helper endpoint to query sent WhatsApp messages log
router.get('/sent-log', (req: Request, res: Response) => {
  return res.json(WhatsAppService.getSentMessagesLog());
});

export const whatsappRouter = router;
