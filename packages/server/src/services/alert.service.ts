import { Server as SocketIOServer } from 'socket.io';
import { AlertModel } from '../models/Alert';

let ioInstance: SocketIOServer | null = null;

export const setSocketIOInstance = (io: SocketIOServer) => {
  ioInstance = io;
};

export class AlertService {
  static async createAndEmitAlert(data: {
    doctorId: string;
    patientId: string;
    patientName: string;
    followUpResponseId?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
  }) {
    const alert = await AlertModel.create(data);

    if (ioInstance) {
      ioInstance.to(`doctor_${data.doctorId}`).emit('new_alert', alert);
      ioInstance.emit('global_alert', alert);
    }

    return alert;
  }
}
