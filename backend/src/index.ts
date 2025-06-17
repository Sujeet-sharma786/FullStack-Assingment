import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { typeDefs, resolvers } from './schema';

const prisma = new PrismaClient();
const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (eventId) => {
    socket.join(eventId);
  });
  socket.on('leaveRoom', (eventId) => {
    socket.leave(eventId);
  });
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ prisma, io, req }),
});

async function start() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  httpServer.listen(4000, () => {
    console.log('Server running on http://localhost:4000/graphql');
  });
}

start();