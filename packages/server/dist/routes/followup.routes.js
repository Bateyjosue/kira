"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followupRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const FollowUp_1 = require("../models/FollowUp");
const FollowUpResponse_1 = require("../models/FollowUpResponse");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get('/patient/:patientId', async (req, res) => {
    try {
        const followUps = await FollowUp_1.FollowUpModel.find({ patientId: req.params.patientId }).sort({ dayNumber: 1 });
        const responses = await FollowUpResponse_1.FollowUpResponseModel.find({ patientId: req.params.patientId }).sort({ respondedAt: -1 });
        return res.json({ followUps, responses });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.followupRouter = router;
