import { Schema, model } from 'mongoose';

const FollowUpQuestionSchema = new Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
});

const FollowUpSchema = new Schema(
  {
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    dayNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'sent', 'responded', 'missed'],
      default: 'scheduled',
    },
    questions: [FollowUpQuestionSchema],
    scheduledAt: { type: Date, required: true },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

export const FollowUpModel = model('FollowUp', FollowUpSchema);
