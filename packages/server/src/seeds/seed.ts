import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { DoctorModel } from '../models/Doctor';
import { PatientModel } from '../models/Patient';
import { ConsultationModel } from '../models/Consultation';
import { FollowUpModel } from '../models/FollowUp';
import { FollowUpResponseModel } from '../models/FollowUpResponse';
import { AlertModel } from '../models/Alert';

export const seedDatabase = async () => {
  console.log('🌱 Starting OpenMRS synthetic data seeding...');
  await connectDB();

  const existingDoctor = await DoctorModel.findOne({ email: 'demo.doctor@carebridge.rw' });
  if (existingDoctor) {
    console.log('⚡ Seed data already exists. Skipping...');
    return;
  }

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const doctor = await DoctorModel.create({
    name: 'Dr. Jean-Paul Nshimyumuremyi',
    email: 'demo.doctor@carebridge.rw',
    passwordHash,
    phone: '+250788123456',
    specialty: 'Internal Medicine',
    licenseNumber: 'RMDC-2024-8891',
  });

  const patientsData = [
    {
      name: 'Keza Marie Uwase',
      phoneWhatsapp: '+250789000111',
      language: 'rw',
      dateOfBirth: '1995-04-12',
      gender: 'Female',
      doctorId: doctor._id,
      isSeeded: true,
    },
    {
      name: 'Mugisha Emmanuel',
      phoneWhatsapp: '+250789000222',
      language: 'rw',
      dateOfBirth: '1988-09-25',
      gender: 'Male',
      doctorId: doctor._id,
      isSeeded: true,
    },
    {
      name: 'Claudine Nzeyimana',
      phoneWhatsapp: '+250789000333',
      language: 'fr',
      dateOfBirth: '2001-01-15',
      gender: 'Female',
      doctorId: doctor._id,
      isSeeded: true,
    },
    {
      name: 'David Hakizimana',
      phoneWhatsapp: '+250789000444',
      language: 'en',
      dateOfBirth: '1976-11-03',
      gender: 'Male',
      doctorId: doctor._id,
      isSeeded: true,
    },
  ];

  const createdPatients = await PatientModel.insertMany(patientsData);

  // Consultation 1: Malaria (Critical/Alert state)
  const p1 = createdPatients[0];
  const cons1 = await ConsultationModel.create({
    patientId: p1._id,
    doctorId: doctor._id,
    diagnosis: 'Uncomplicated Plasmodium falciparum Malaria',
    medications: [
      { name: 'Coartem (Artemether/Lumefantrine)', dosage: '20/120mg', frequency: '2 tabs twice daily', duration: '3 days' },
      { name: 'Paracetamol', dosage: '500mg', frequency: '3 times daily as needed', duration: '5 days' },
    ],
    notes: 'Patient presented with high fever, chills, and headache. Rapid Diagnostic Test positive.',
    nextVisitDate: '2026-08-04',
    followUpScheduleDays: [1, 3, 7],
    status: 'active',
    isSeeded: true,
  });

  const fu1 = await FollowUpModel.create({
    consultationId: cons1._id,
    patientId: p1._id,
    dayNumber: 1,
    status: 'responded',
    questions: [
      { id: 'q1', questionText: 'Mwaramutse Keza, ni gute wumva umeze uyu munsi? (How are you feeling today?)' },
      { id: 'q2', questionText: 'Ufata imiti ya Coartem nkuko muganga yayiguhaye? (Are you taking Coartem as prescribed?)' },
      { id: 'q3', questionText: 'Ucyanganya umuriro cyangwa gukankama? (Do you still have high fever or chills?)' },
    ],
    scheduledAt: new Date(Date.now() - 24 * 3600 * 1000),
    sentAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  const resp1 = await FollowUpResponseModel.create({
    followUpId: fu1._id,
    patientId: p1._id,
    answers: [
      { questionId: 'q1', questionText: 'Ni gute wumva umeze uyu munsi?', answerText: 'Ndomva ntaba nina, umuriro watumbagaye mu ijoro.' },
      { questionId: 'q2', questionText: 'Ufata imiti ya Coartem?', answerText: 'Yego nayifashe yose.' },
      { questionId: 'q3', questionText: 'Ucyanganya umuriro?', answerText: 'Yego ucyiyongera nina urutoke rwampagaze.' },
    ],
    sentiment: 'critical',
    aiSummary: 'Patient reports persistent high fever and severe fatigue despite starting Coartem.',
    hasRedFlag: true,
    respondedAt: new Date(Date.now() - 12 * 3600 * 1000),
  });

  await AlertModel.create({
    doctorId: doctor._id,
    patientId: p1._id,
    patientName: p1.name,
    followUpResponseId: resp1._id,
    severity: 'critical',
    message: `🔴 RED FLAG: ${p1.name} reports persistent high fever on Day 1 of Malaria treatment.`,
    isRead: false,
  });

  // Consultation 2: Hypertension (Stable)
  const p2 = createdPatients[1];
  const cons2 = await ConsultationModel.create({
    patientId: p2._id,
    doctorId: doctor._id,
    diagnosis: 'Essential Hypertension',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily in morning', duration: '30 days' },
    ],
    notes: 'Routine checkup BP 148/92 mmHg. Started monotherapy.',
    nextVisitDate: '2026-08-20',
    followUpScheduleDays: [1, 3, 7],
    status: 'active',
    isSeeded: true,
  });

  const fu2 = await FollowUpModel.create({
    consultationId: cons2._id,
    patientId: p2._id,
    dayNumber: 3,
    status: 'responded',
    questions: [
      { id: 'q1', questionText: 'Mwaramutse Emmanuel, umeze ute uyu munsi?' },
      { id: 'q2', questionText: 'Ufite ikirungurira cyangwa kuribwa mu mutwe?' },
    ],
    scheduledAt: new Date(Date.now() - 48 * 3600 * 1000),
    sentAt: new Date(Date.now() - 48 * 3600 * 1000),
  });

  await FollowUpResponseModel.create({
    followUpId: fu2._id,
    patientId: p2._id,
    answers: [
      { questionId: 'q1', questionText: 'Umeze ute?', answerText: 'Ndaraye neza cyane, umutwe ntiwongeye kurya.' },
      { questionId: 'q2', questionText: 'Ufite ikirungurira?', answerText: 'Oya ntacyo nina imiti ndayifata neza.' },
    ],
    sentiment: 'positive',
    aiSummary: 'Patient reports complete resolution of headache and excellent medication adherence.',
    hasRedFlag: false,
    respondedAt: new Date(Date.now() - 24 * 3600 * 1000),
  });

  console.log('✅ OpenMRS synthetic seed data completed successfully!');
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
