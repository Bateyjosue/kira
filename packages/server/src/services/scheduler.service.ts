import { Queue, Worker, Job } from 'bullmq';
import { redisClient } from '../config/redis';
import { ConsultationModel } from '../models/Consultation';
import { FollowUpModel } from '../models/FollowUp';
import { PatientModel } from '../models/Patient';
import { GeminiService } from './gemini.service';
import { WhatsAppService } from './whatsapp.service';

export const followUpQueue = new Queue('carebridge-followup-queue', {
  connection: redisClient,
});

export class SchedulerService {
  static async scheduleConsultationFollowUps(consultationId: string): Promise<void> {
    const consultation = await ConsultationModel.findById(consultationId);
    if (!consultation) return;

    const patient = await PatientModel.findById(consultation.patientId);
    if (!patient) return;

    for (const day of consultation.followUpScheduleDays) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + day);

      const questions = await GeminiService.generateFollowUpQuestions(
        consultation.diagnosis,
        consultation.medications.map((m) => `${m.name} ${m.dosage}`).join(', '),
        day,
        patient.language
      );

      const followUp = await FollowUpModel.create({
        consultationId: consultation._id,
        patientId: patient._id,
        dayNumber: day,
        status: 'scheduled',
        questions,
        scheduledAt: scheduledDate,
      });

      // Schedule job in BullMQ queue
      await followUpQueue.add(
        'send-followup',
        { followUpId: followUp._id.toString() },
        { delay: 1000 } // Instant trigger for hackathon demo
      );
    }
  }

  static initWorker(): Worker {
    const worker = new Worker(
      'carebridge-followup-queue',
      async (job: Job) => {
        const { followUpId } = job.data;
        const followUp = await FollowUpModel.findById(followUpId);
        if (!followUp || followUp.status === 'sent' || followUp.status === 'responded') return;

        const patient = await PatientModel.findById(followUp.patientId);
        if (!patient) return;

        const formattedMessage = `🏥 *CareBridge Patient Check-In (Day ${followUp.dayNumber})*\n\n` +
          `Hello ${patient.name},\n` +
          followUp.questions.map((q, idx) => `${idx + 1}. ${q.questionText}`).join('\n') +
          `\n\n*Please reply directly to this message with your updates.*`;

        await WhatsAppService.sendMessage(patient.phoneWhatsapp, formattedMessage);

        followUp.status = 'sent';
        followUp.sentAt = new Date();
        await followUp.save();
      },
      { connection: redisClient }
    );

    worker.on('failed', (job, err) => {
      console.warn(`⚠️ Follow-Up Worker Job ${job?.id} failed:`, err.message);
    });

    return worker;
  }
}
