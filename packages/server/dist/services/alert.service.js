"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = exports.setSocketIOInstance = void 0;
const Alert_1 = require("../models/Alert");
let ioInstance = null;
const setSocketIOInstance = (io) => {
    ioInstance = io;
};
exports.setSocketIOInstance = setSocketIOInstance;
class AlertService {
    static async createAndEmitAlert(data) {
        const alert = await Alert_1.AlertModel.create(data);
        if (ioInstance) {
            ioInstance.to(`doctor_${data.doctorId}`).emit('new_alert', alert);
            ioInstance.emit('global_alert', alert);
        }
        return alert;
    }
}
exports.AlertService = AlertService;
