"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Consultation_1 = require("../models/Consultation");
const scheduler_service_1 = require("../services/scheduler.service");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (req, res) => {
    try {
        const consultations = await Consultation_1.ConsultationModel.find({ doctorId: req.user?.doctorId })
            .populate('patientId')
            .sort({ createdAt: -1 });
        return res.json(consultations);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/', async (req, res) => {
    try {
        const consultation = await Consultation_1.ConsultationModel.create({
            ...req.body,
            doctorId: req.user?.doctorId,
        });
        // Automatically schedule post-consultation follow-ups
        await scheduler_service_1.SchedulerService.scheduleConsultationFollowUps(consultation._id.toString());
        return res.status(201).json(consultation);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.consultationRouter = router;
