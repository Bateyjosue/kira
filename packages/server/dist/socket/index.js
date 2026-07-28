"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocketIO = void 0;
const socket_io_1 = require("socket.io");
const env_1 = require("../config/env");
const alert_service_1 = require("../services/alert.service");
const initSocketIO = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: [env_1.env.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Socket client connected: ${socket.id}`);
        socket.on('join_doctor_room', (doctorId) => {
            socket.join(`doctor_${doctorId}`);
            console.log(`👨‍⚕️ Socket ${socket.id} joined doctor room doctor_${doctorId}`);
        });
        socket.on('disconnect', () => {
            console.log(`🔌 Socket client disconnected: ${socket.id}`);
        });
    });
    (0, alert_service_1.setSocketIOInstance)(io);
    return io;
};
exports.initSocketIO = initSocketIO;
