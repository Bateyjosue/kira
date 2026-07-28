import { Schema, model } from 'mongoose';

const PatientSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneWhatsapp: { type: String, required: true },
    language: { type: String, enum: ['en', 'fr', 'rw', 'sw'], default: 'en' },
    dateOfBirth: { type: String },
    gender: { type: String },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PatientModel = model('Patient', PatientSchema);
