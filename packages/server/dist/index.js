"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const seed_1 = require("./seeds/seed");
const socket_1 = require("./socket");
const scheduler_service_1 = require("./services/scheduler.service");
const auth_routes_1 = require("./routes/auth.routes");
const patient_routes_1 = require("./routes/patient.routes");
const consultation_routes_1 = require("./routes/consultation.routes");
const followup_routes_1 = require("./routes/followup.routes");
const alert_routes_1 = require("./routes/alert.routes");
const whatsapp_routes_1 = require("./routes/whatsapp.routes");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
// Routes
app.use('/api/v1/auth', auth_routes_1.authRouter);
app.use('/api/v1/patients', patient_routes_1.patientRouter);
app.use('/api/v1/consultations', consultation_routes_1.consultationRouter);
app.use('/api/v1/followups', followup_routes_1.followupRouter);
app.use('/api/v1/alerts', alert_routes_1.alertRouter);
app.use('/api/v1/whatsapp', whatsapp_routes_1.whatsappRouter);
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', service: 'CareBridge API', timestamp: new Date() });
});
// Start Server
const startServer = async () => {
    await (0, db_1.connectDB)();
    await (0, seed_1.seedDatabase)();
    (0, socket_1.initSocketIO)(server);
    scheduler_service_1.SchedulerService.initWorker();
    const PORT = parseInt(env_1.env.PORT, 10);
    server.listen(PORT, () => {
        console.log(`🚀 CareBridge Server running on http://localhost:${PORT}`);
    });
};
startServer().catch((err) => {
    console.error('Fatal server boot error:', err);
});
