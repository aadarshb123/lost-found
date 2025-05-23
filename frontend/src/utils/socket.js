import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5001', {
      withCredentials: true  // This enables sending cookies with the request
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 