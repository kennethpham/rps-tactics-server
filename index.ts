import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

interface ServerToClientEvents { }
interface ClientToServerEvents {
  choice: (choice: number) => void;
}
interface InterServerEvents {
  disconnect: (socket:Socket) => void;
}
interface SocketData { }
const port = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  }
});

const rps = (choice: number): string => {
  var result = 'hi';
  if (choice === 0){
    return 'you lost!';
  }
  return result;
}

var players = {
  player1: choice;
  player2: choice;
}
  

io.on('connection', (socket) => {  
  console.log(socket.id);
  socket.on('choice', (choice: number) => {
    players.player1
    console.log(result);
  });
  socket.emit('result', (result));
  socket.on('disconnect', () => {
    console.log(`Disconnected from ${socket.id}`);
  });
});


io.on('disconnect', (socket) => {
  console.log(`Disconnected from ${socket.id}`);
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
