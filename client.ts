import { io } from 'socket.io-client';

const socket = io('http://localhost:4000').connect();

socket.on('connect', () => {
  console.log(socket.id);
});

socket.on('disconnect', () => {
  console.log(socket.connected);
});
