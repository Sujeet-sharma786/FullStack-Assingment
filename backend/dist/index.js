"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const apollo_server_express_1 = require("apollo-server-express");
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const schema_1 = require("./schema");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
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
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: schema_1.resolvers,
    context: ({ req }) => ({ prisma, io, req }),
});
async function start() {
    await server.start();
    // @ts-expect-error
    server.applyMiddleware({ app, path: '/graphql' });
    httpServer.listen(4000, () => {
        console.log('Server running on http://localhost:4000/graphql');
    });
}
start();
