import { Schema, model } from 'mongoose';

const DoctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    specialty: { type: String, default: 'General Practitioner' },
    licenseNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const DoctorModel = model('Doctor', DoctorSchema);
