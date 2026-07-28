"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationModel = void 0;
const mongoose_1 = require("mongoose");
const MedicationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
});
const ConsultationSchema = new mongoose_1.Schema({
    patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    medications: [MedicationSchema],
    notes: { type: String },
    nextVisitDate: { type: String },
    followUpScheduleDays: { type: [Number], default: [1, 3, 7] },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    isSeeded: { type: Boolean, default: false },
}, { timestamps: true });
exports.ConsultationModel = (0, mongoose_1.model)('Consultation', ConsultationSchema);
