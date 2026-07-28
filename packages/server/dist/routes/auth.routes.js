"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Doctor_1 = require("../models/Doctor");
const env_1 = require("../config/env");
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await Doctor_1.DoctorModel.findOne({ email });
        if (!doctor) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, doctor.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ doctorId: doctor._id.toString(), email: doctor.email }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialty: doctor.specialty,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, specialty, licenseNumber } = req.body;
        const existing = await Doctor_1.DoctorModel.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: 'Doctor email already registered' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const doctor = await Doctor_1.DoctorModel.create({
            name,
            email,
            passwordHash,
            phone,
            specialty,
            licenseNumber,
        });
        const token = jsonwebtoken_1.default.sign({ doctorId: doctor._id.toString(), email: doctor.email }, env_1.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(201).json({
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialty: doctor.specialty,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.authRouter = router;
