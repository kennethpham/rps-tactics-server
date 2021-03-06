import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import Player from './Game/Player';
import Rps from './Game/Rps';

interface ServerToClientEvents {
  checkWinner: () => void;
  newRound: () => void;
  sendGameInfo: (data: string) => void;
  startGame: () => void;
  updateLobby: (players: Player[]) => void;
}
interface ClientToServerEvents {
  getLobby: () => void;
  joinLobby: (username: string) => void;
  playerChoice: (choice: string) => void;
  startGame: () => void;
  toggleLeader: () => void;
  toggleReady: () => void;
}
interface InterServerEvents {
  disconnect: (socket: Socket) => void;
}
interface SocketData {
  choice: string;
  username: string;
}

const port = process.env.PORT || 4000;
const app = express();

const httpServer = createServer(app);
const RpsGame = new Rps();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket: Socket) => {
  console.log(socket.id);
  socket.on('playerChoice', (choice: string) => {
    RpsGame.setChoice(socket.id, choice);
    console.log(`Player ${socket.id} chose ${choice}`);
  });
  socket.on('disconnect', () => {
    RpsGame.removePlayer(socket.id);
    io.emit('updateLobby', RpsGame.getPlayerArr());
    console.log(`Disconnected from ${socket.id}`);
  });
  socket.on('getLobby', () => {
    io.emit('updateLobby', RpsGame.getPlayerArr());
  });
  socket.on('joinLobby', (username) => {
    RpsGame.addPlayer([socket.id, username]);
  });
  socket.on('startGame', () => {
    io.emit('startGame');
    playGame();
  });
  socket.on('toggleReady', () => {
    RpsGame.toggleReady(socket.id);
    io.emit('updateLobby', RpsGame.getPlayerArr());
  });
  socket.on('toggleLeader', (player: string) => {
    RpsGame.toggleLeader(socket.id);
    RpsGame.toggleLeader(player);
    io.emit('updateLobby', RpsGame.getPlayerArr());
  });
});

io.on('disconnect', (socket: Socket) => {
  RpsGame.removePlayer(socket.id);
  console.log(`Disconnected from ${socket.id}`);
});

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

// used for the round interval
var roundLoop: NodeJS.Timer;

// used for round timer
const roundTime = 10000;

const playGame = () => {
  RpsGame.startGame();
  RpsGame.matchPlayers();
  io.emit('newRound');
  io.emit('updateLobby', RpsGame.getPlayerArr());
  roundLoop = setInterval(playRound, roundTime);
};

const playRound = () => {
  RpsGame.resolvePlayers();
  RpsGame.matchPlayers();
  io.emit('newRound');
  io.emit('updateLobby', RpsGame.getPlayerArr());
  if (RpsGame.getPlayersActive() < 2) {
    clearInterval(roundLoop);
    console.log('Game Loop finished');
    io.emit('checkWinner');
  }
};
