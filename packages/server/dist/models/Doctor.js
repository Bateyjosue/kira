"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorModel = void 0;
const mongoose_1 = require("mongoose");
const DoctorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: true },
    specialty: { type: String, default: 'General Practitioner' },
    licenseNumber: { type: String, required: true },
}, { timestamps: true });
exports.DoctorModel = (0, mongoose_1.model)('Doctor', DoctorSchema);
