"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Alert_1 = require("../models/Alert");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert_1.AlertModel.find({ doctorId: req.user?.doctorId })
            .populate('patientId')
            .sort({ createdAt: -1 });
        return res.json(alerts);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.patch('/:id/read', async (req, res) => {
    try {
        const alert = await Alert_1.AlertModel.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        return res.json(alert);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.alertRouter = router;
