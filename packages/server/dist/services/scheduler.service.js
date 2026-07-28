"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerService = exports.followUpQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
const Consultation_1 = require("../models/Consultation");
const FollowUp_1 = require("../models/FollowUp");
const Patient_1 = require("../models/Patient");
const gemini_service_1 = require("./gemini.service");
const whatsapp_service_1 = require("./whatsapp.service");
exports.followUpQueue = new bullmq_1.Queue('carebridge-followup-queue', {
    connection: redis_1.redisClient,
});
class SchedulerService {
    static async scheduleConsultationFollowUps(consultationId) {
        const consultation = await Consultation_1.ConsultationModel.findById(consultationId);
        if (!consultation)
            return;
        const patient = await Patient_1.PatientModel.findById(consultation.patientId);
        if (!patient)
            return;
        for (const day of consultation.followUpScheduleDays) {
            const scheduledDate = new Date();
            scheduledDate.setDate(scheduledDate.getDate() + day);
            const questions = await gemini_service_1.GeminiService.generateFollowUpQuestions(consultation.diagnosis, consultation.medications.map((m) => `${m.name} ${m.dosage}`).join(', '), day, patient.language);
            const followUp = await FollowUp_1.FollowUpModel.create({
                consultationId: consultation._id,
                patientId: patient._id,
                dayNumber: day,
                status: 'scheduled',
                questions,
                scheduledAt: scheduledDate,
            });
            // Schedule job in BullMQ queue
            await exports.followUpQueue.add('send-followup', { followUpId: followUp._id.toString() }, { delay: 1000 } // Instant trigger for hackathon demo
            );
        }
    }
    static initWorker() {
        const worker = new bullmq_1.Worker('carebridge-followup-queue', async (job) => {
            const { followUpId } = job.data;
            const followUp = await FollowUp_1.FollowUpModel.findById(followUpId);
            if (!followUp || followUp.status === 'sent' || followUp.status === 'responded')
                return;
            const patient = await Patient_1.PatientModel.findById(followUp.patientId);
            if (!patient)
                return;
            const formattedMessage = `🏥 *CareBridge Patient Check-In (Day ${followUp.dayNumber})*\n\n` +
                `Hello ${patient.name},\n` +
                followUp.questions.map((q, idx) => `${idx + 1}. ${q.questionText}`).join('\n') +
                `\n\n*Please reply directly to this message with your updates.*`;
            await whatsapp_service_1.WhatsAppService.sendMessage(patient.phoneWhatsapp, formattedMessage);
            followUp.status = 'sent';
            followUp.sentAt = new Date();
            await followUp.save();
        }, { connection: redis_1.redisClient });
        worker.on('failed', (job, err) => {
            console.warn(`⚠️ Follow-Up Worker Job ${job?.id} failed:`, err.message);
        });
        return worker;
    }
}
exports.SchedulerService = SchedulerService;
