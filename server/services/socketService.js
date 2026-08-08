import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('join', (room) => room && socket.join(String(room)));
    socket.on('leave', (room) => room && socket.leave(String(room)));
  });

  return io;
};

export const emitEvent = (event, payload, room) => {
  if (!io) return;
  if (room) io.to(String(room)).emit(event, payload);
  else io.emit(event, payload);
};

export const getIO = () => io;
