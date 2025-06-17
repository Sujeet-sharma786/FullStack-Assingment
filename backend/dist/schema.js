"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    startTime: String!
    attendees: [User!]!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    me: User
  }

  type Mutation {
    joinEvent(eventId: ID!, name: String!, email: String!): Event
  }
`;
exports.resolvers = {
    Query: {
        events: async (_, __, context) => {
            const { prisma } = context;
            return prisma.event.findMany({ include: { attendees: true } });
        },
        event: async (_, { id }, context) => {
            const { prisma } = context;
            return prisma.event.findUnique({ where: { id }, include: { attendees: true } });
        },
        me: async (_, __, context) => {
            return { id: '1', name: 'Test User', email: 'test@example.com' };
        },
    },
    Mutation: {
        joinEvent: async (_, { eventId, name, email }, context) => {
            const { prisma, io } = context;
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                user = await prisma.user.create({ data: { name, email } });
            }
            await prisma.event.update({
                where: { id: eventId },
                data: { attendees: { connect: { id: user.id } } },
            });
            io.to(eventId).emit('attendeesUpdated');
            return prisma.event.findUnique({ where: { id: eventId }, include: { attendees: true } });
        },
    },
};
