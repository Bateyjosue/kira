import { Schema, model } from 'mongoose';

const AlertSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String },
    followUpResponseId: { type: Schema.Types.ObjectId, ref: 'FollowUpResponse' },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high',
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AlertModel = model('Alert', AlertSchema);
