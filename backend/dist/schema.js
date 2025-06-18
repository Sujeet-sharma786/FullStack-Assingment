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
    leaveEvent(eventId: ID!, name:String!, email: String!): Event
  }
`;
exports.resolvers = {
    Query: {
        events: async (_parent, _args, context) => {
            const events = await context.prisma.event.findMany({ include: { attendees: true } });
            return events.map((event) => ({
                ...event,
                startTime: typeof event.startTime === 'number'
                    ? new Date(event.startTime).toISOString()
                    : event.startTime instanceof Date
                        ? event.startTime.toISOString()
                        : event.startTime,
            }));
        },
        event: async (_parent, { id }, context) => {
            const event = await context.prisma.event.findUnique({ where: { id }, include: { attendees: true } });
            if (!event)
                return null;
            return {
                ...event,
                startTime: typeof event.startTime === 'number'
                    ? new Date(event.startTime).toISOString()
                    : event.startTime instanceof Date
                        ? event.startTime.toISOString()
                        : event.startTime,
            };
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
        leaveEvent: async (_, { eventId, name, email }, context) => {
            const { prisma, io } = context;
            // Check if the user exists
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                console.log(`User with email "${email}" not found in DB.`);
                return prisma.event.findUnique({ where: { id: eventId }, include: { attendees: true } });
            }
            // Get the event and its attendees
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                include: { attendees: true },
            });
            const isAttending = event === null || event === void 0 ? void 0 : event.attendees.some((attendee) => attendee.id === user.id);
            if (!isAttending) {
                console.log(`User "${email}" is not attending event "${eventId}", so no action taken.`);
                return event;
            }
            // Disconnect the user from the event
            await prisma.event.update({
                where: { id: eventId },
                data: { attendees: { disconnect: { id: user.id } } },
            });
            io.to(eventId).emit('attendeesUpdated');
            return prisma.event.findUnique({ where: { id: eventId }, include: { attendees: true } });
        },
    },
};
