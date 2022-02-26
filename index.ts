import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import Rps from './Game/Rps';

interface ServerToClientEvents {
}
interface ClientToServerEvents {
  playerChoice: (choice: string) => void;
}
interface InterServerEvents {
  disconnect: (socket: Socket) => void;
}
interface SocketData {
  choice: string;
}

const port = process.env.PORT || 4000;
const app = express();

const httpServer = createServer(app);

const RpsGame = new Rps();

const rps = (choice: number): string => {
  var result = 'hi';
  if (choice === 0){
    return 'you lost!';
  }
  return result;
}

class players {
  player1: number = 0;
  player2: number = 0;
}
  
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData>(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
    }
  });

io.on('connection', (socket) => {
  RpsGame.addPlayer([socket.id,'']);
  console.log(socket.id);
  socket.on('playerChoice', (choice: string) => {
    console.log(`Player ${socket.id} chose ${choice}`);
    console.log(RpsGame.getPlayerArr().length);
  });
  socket.on('disconnect', () => {
    RpsGame.removePlayer(socket.id);
    console.log(`Disconnected from ${socket.id}`);
  });
});

io.on('disconnect', (socket: Socket) => {
  console.log(`Disconnected from ${socket.id}`);
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
