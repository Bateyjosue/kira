"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpModel = void 0;
const mongoose_1 = require("mongoose");
const FollowUpQuestionSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    questionText: { type: String, required: true },
});
const FollowUpSchema = new mongoose_1.Schema({
    consultationId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    dayNumber: { type: Number, required: true },
    status: {
        type: String,
        enum: ['scheduled', 'sent', 'responded', 'missed'],
        default: 'scheduled',
    },
    questions: [FollowUpQuestionSchema],
    scheduledAt: { type: Date, required: true },
    sentAt: { type: Date },
}, { timestamps: true });
exports.FollowUpModel = (0, mongoose_1.model)('FollowUp', FollowUpSchema);
