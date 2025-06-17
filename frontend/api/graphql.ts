// filepath: [graphql.ts](http://_vscodecontentref_/0)
import { request, gql } from 'graphql-request';

const ENDPOINT = 'http://192.168.110.75:4000/graphql';

export async function getEvents() {
  const query = gql`
    query {
      events {
        id
        name
        location
        startTime
        attendees {
          id
          name
          email
        }
      }
    }
  `;
  const data = await request(ENDPOINT, query);
  return data.events;
}

export async function getEventById(id: string) {
  const query = gql`
    query ($id: ID!) {
      event(id: $id) {
        id
        name
        location
        startTime
        attendees {
          id
          name
          email
        }
      }
    }
  `;
  const data = await request(ENDPOINT, query, { id });
  return data.event;
}

export async function joinEvent(eventId: string, user: { name: string; email: string }) {
  const mutation = gql`
    mutation ($eventId: ID!, $name: String!, $email: String!) {
      joinEvent(eventId: $eventId, name: $name, email: $email) {
        id
        name
        location
        startTime
        attendees {
          id
          name
          email
        }
      }
    }
  `;
  const data = await request(ENDPOINT, mutation, { eventId, ...user });
  return data.joinEvent;
}