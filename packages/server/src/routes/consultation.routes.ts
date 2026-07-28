import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { ConsultationModel } from '../models/Consultation';
import { SchedulerService } from '../services/scheduler.service';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const consultations = await ConsultationModel.find({ doctorId: req.user?.doctorId })
      .populate('patientId')
      .sort({ createdAt: -1 });
    return res.json(consultations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const consultation = await ConsultationModel.create({
      ...req.body,
      doctorId: req.user?.doctorId,
    });

    // Automatically schedule post-consultation follow-ups
    await SchedulerService.scheduleConsultationFollowUps(consultation._id.toString());

    return res.status(201).json(consultation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export const consultationRouter = router;
