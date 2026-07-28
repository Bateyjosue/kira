"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertModel = void 0;
const mongoose_1 = require("mongoose");
const AlertSchema = new mongoose_1.Schema({
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    patientName: { type: String },
    followUpResponseId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'FollowUpResponse' },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'high',
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
exports.AlertModel = (0, mongoose_1.model)('Alert', AlertSchema);
