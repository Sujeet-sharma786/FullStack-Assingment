import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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

export const resolvers = {
  Query: {
    events: async (_parent: any, _args: any, context: any) => {
      const events = await context.prisma.event.findMany({ include: { attendees: true } });
      return events.map((event: any) => ({
        ...event,
        startTime: typeof event.startTime === 'number'
          ? new Date(event.startTime).toISOString()
          : event.startTime instanceof Date
            ? event.startTime.toISOString()
            : event.startTime,
      }));
    },
    event: async (_parent: any, { id }: any, context: any) => {
      const event = await context.prisma.event.findUnique({ where: { id }, include: { attendees: true } });
      if (!event) return null;
      return {
        ...event,
        startTime: typeof event.startTime === 'number'
          ? new Date(event.startTime).toISOString()
          : event.startTime instanceof Date
            ? event.startTime.toISOString()
            : event.startTime,
      };
    },
    me: async (_: any, __: any, context: any) => {
      return { id: '1', name: 'Test User', email: 'test@example.com' };
    },
  },
  Mutation: {
    joinEvent: async (_: any, { eventId, name, email }: any, context: any) => {
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