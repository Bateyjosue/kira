import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { readOnlyMiddleware } from '../middleware/readOnly';
import { PatientModel } from '../models/Patient';
import { ConsultationModel } from '../models/Consultation';
import { GeminiService } from '../services/gemini.service';
import { FollowUpResponseModel } from '../models/FollowUpResponse';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const patients = await PatientModel.find({ doctorId: req.user?.doctorId }).sort({ createdAt: -1 });
    return res.json(patients);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const patient = await PatientModel.create({
      ...req.body,
      doctorId: req.user?.doctorId,
    });
    return res.status(201).json(patient);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const patient = await PatientModel.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const consultations = await ConsultationModel.find({ patientId: patient._id }).sort({ createdAt: -1 });
    const responses = await FollowUpResponseModel.find({ patientId: patient._id }).sort({ respondedAt: -1 });

    let summary = 'No responses recorded yet.';
    if (responses.length > 0 && consultations.length > 0) {
      const historyStr = responses
        .map((r) => `[${r.respondedAt.toISOString()}] Sentiment: ${r.sentiment}. Answers: ${r.answers.map((a) => a.answerText).join('; ')}`)
        .join('\n');
      summary = await GeminiService.generateRecoverySummary(consultations[0].diagnosis, historyStr);
    }

    return res.json({
      patient,
      consultations,
      responses,
      aiSummary: summary,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', readOnlyMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await PatientModel.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Patient removed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export const patientRouter = router;
