"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientModel = void 0;
const mongoose_1 = require("mongoose");
const PatientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phoneWhatsapp: { type: String, required: true },
    language: { type: String, enum: ['en', 'fr', 'rw', 'sw'], default: 'en' },
    dateOfBirth: { type: String },
    gender: { type: String },
    doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    isSeeded: { type: Boolean, default: false },
}, { timestamps: true });
exports.PatientModel = (0, mongoose_1.model)('Patient', PatientSchema);
