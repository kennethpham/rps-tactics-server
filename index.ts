import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const port = process.env.PORT || 4000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    /* options */ 
    cors: {
      origin: `http://localhost:${port}`,
      methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {  
  console.log(socket.id);
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
