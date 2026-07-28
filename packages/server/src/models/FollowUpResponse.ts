import { Schema, model } from 'mongoose';

const AnswerSchema = new Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  answerText: { type: String, required: true },
});

const FollowUpResponseSchema = new Schema(
  {
    followUpId: { type: Schema.Types.ObjectId, ref: 'FollowUp', required: true },
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    answers: [AnswerSchema],
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'critical'],
      default: 'neutral',
    },
    aiSummary: { type: String, required: true },
    hasRedFlag: { type: Boolean, default: false },
    respondedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const FollowUpResponseModel = model('FollowUpResponse', FollowUpResponseSchema);
