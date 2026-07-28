"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUpResponseModel = void 0;
const mongoose_1 = require("mongoose");
const AnswerSchema = new mongoose_1.Schema({
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answerText: { type: String, required: true },
});
const FollowUpResponseSchema = new mongoose_1.Schema({
    followUpId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'FollowUp', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    answers: [AnswerSchema],
    sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative', 'critical'],
        default: 'neutral',
    },
    aiSummary: { type: String, required: true },
    hasRedFlag: { type: Boolean, default: false },
    respondedAt: { type: Date, default: Date.now },
}, { timestamps: true });
exports.FollowUpResponseModel = (0, mongoose_1.model)('FollowUpResponse', FollowUpResponseSchema);
