import { io } from 'socket.io-client';

let socket;

// Realtime channel to the Express server (Socket.io). Lazily created so the
// UI works unchanged when no backend is running.
export const getSocket = () => {
  if (socket) return socket;
  const url = import.meta.env.VITE_SOCKET_URL;
  if (!url) return null;
  socket = io(url, { withCredentials: true, autoConnect: true, transports: ['websocket', 'polling'] });
  return socket;
};

export const joinRoom = (room) => getSocket()?.emit('join', room);
export const leaveRoom = (room) => getSocket()?.emit('leave', room);

export const onEvent = (event, handler) => {
  const s = getSocket();
  if (!s) return () => {};
  s.on(event, handler);
  return () => s.off(event, handler);
};

export default getSocket;
