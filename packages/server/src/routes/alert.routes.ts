import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { AlertModel } from '../models/Alert';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await AlertModel.find({ doctorId: req.user?.doctorId })
      .populate('patientId')
      .sort({ createdAt: -1 });
    return res.json(alerts);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  try {
    const alert = await AlertModel.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    return res.json(alert);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export const alertRouter = router;
