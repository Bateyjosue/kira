import { Schema, model } from 'mongoose';

const MedicationSchema = new Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
});

const ConsultationSchema = new Schema(
  {
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    medications: [MedicationSchema],
    notes: { type: String },
    nextVisitDate: { type: String },
    followUpScheduleDays: { type: [Number], default: [1, 3, 7] },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    isSeeded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ConsultationModel = model('Consultation', ConsultationSchema);
