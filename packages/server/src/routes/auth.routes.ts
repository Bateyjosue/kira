import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DoctorModel } from '../models/Doctor';
import { env } from '../config/env';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, doctor.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { doctorId: doctor._id.toString(), email: doctor.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, specialty, licenseNumber } = req.body;
    const existing = await DoctorModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Doctor email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const doctor = await DoctorModel.create({
      name,
      email,
      passwordHash,
      phone,
      specialty,
      licenseNumber,
    });

    const token = jwt.sign(
      { doctorId: doctor._id.toString(), email: doctor.email },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export const authRouter = router;
