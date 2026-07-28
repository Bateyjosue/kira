export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface IAlert {
  _id?: string;
  doctorId: string;
  patientId: string;
  patientName?: string;
  followUpResponseId?: string;
  severity: AlertSeverity;
  message: string;
  isRead: boolean;
  createdAt?: string;
}
