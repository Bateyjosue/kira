import express from 'express';
import http from 'http';
import cors from 'cors';
import { env } from './config/env';
import { connectDB } from './config/db';
import { seedDatabase } from './seeds/seed';
import { initSocketIO } from './socket';
import { SchedulerService } from './services/scheduler.service';
import { authRouter } from './routes/auth.routes';
import { patientRouter } from './routes/patient.routes';
import { consultationRouter } from './routes/consultation.routes';
import { followupRouter } from './routes/followup.routes';
import { alertRouter } from './routes/alert.routes';
import { whatsappRouter } from './routes/whatsapp.routes';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/patients', patientRouter);
app.use('/api/v1/consultations', consultationRouter);
app.use('/api/v1/followups', followupRouter);
app.use('/api/v1/alerts', alertRouter);
app.use('/api/v1/whatsapp', whatsappRouter);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'CareBridge API', timestamp: new Date() });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  initSocketIO(server);
  SchedulerService.initWorker();

  const PORT = parseInt(env.PORT, 10);
  server.listen(PORT, () => {
    console.log(`🚀 CareBridge Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
});
