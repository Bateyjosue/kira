import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from '../config/env';
import { setSocketIOInstance } from '../services/alert.service';

export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket client connected: ${socket.id}`);

    socket.on('join_doctor_room', (doctorId: string) => {
      socket.join(`doctor_${doctorId}`);
      console.log(`👨‍⚕️ Socket ${socket.id} joined doctor room doctor_${doctorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket client disconnected: ${socket.id}`);
    });
  });

  setSocketIOInstance(io);
  return io;
};
