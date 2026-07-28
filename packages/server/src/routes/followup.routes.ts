import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { FollowUpModel } from '../models/FollowUp';
import { FollowUpResponseModel } from '../models/FollowUpResponse';

const router = Router();
router.use(authMiddleware);

router.get('/patient/:patientId', async (req: AuthRequest, res: Response) => {
  try {
    const followUps = await FollowUpModel.find({ patientId: req.params.patientId }).sort({ dayNumber: 1 });
    const responses = await FollowUpResponseModel.find({ patientId: req.params.patientId }).sort({ respondedAt: -1 });
    return res.json({ followUps, responses });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export const followupRouter = router;
