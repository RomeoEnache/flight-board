import { FLIGHT_STATUSES, type Flight } from "../domain/flight";

export type Post = {
  userId: number;
  id: number;
  title: string;
};

export function parsePosts(data: unknown): Post[] {
  if (!Array.isArray(data)) {
    throw new Error("Did not return a list of posts");
  }

  return data.map((post, index) => {
    if (!isPost(post)) {
      throw new Error(`Malformed at index ${index}`);
    }
    return post;
  });
}

function isPost(value: unknown): value is Post {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { id, userId, title } = value as Record<string, unknown>;
  return (
    typeof id === "number" &&
    typeof userId === "number" &&
    typeof title === "string"
  );
}

const GATE_COUNT = 10;
const SCHEDULE_START = "2026-01-01T00:00:00.000Z";
const SCHEDULE_INTERVAL_MINUTES = 15;
const SCHEDULE_INTERVALS_PER_DAY = 96;

export function mapPostsToFlights(posts: Post[]): Flight[] {
  return posts.map(mapPostToFlight);
}

function mapPostToFlight({ id, userId, title }: Post): Flight {
  return {
    flightNumber: `FL-${id}`,
    status: FLIGHT_STATUSES[id % FLIGHT_STATUSES.length],
    destination: title,
    gate: String((id % GATE_COUNT) + 1),
    terminal: String(userId),
    scheduledDepartureTime: deriveScheduledDepartureTime(id),
  };
}

function deriveScheduledDepartureTime(id: number): string {
  const intervalIndex = id % SCHEDULE_INTERVALS_PER_DAY;
  const intervalOffset = intervalIndex * SCHEDULE_INTERVAL_MINUTES;
  const randomMinuteOffset = (id * 13 + 7) % SCHEDULE_INTERVAL_MINUTES;
  const scheduleStart = new Date(SCHEDULE_START);
  const departureTime = new Date(
    scheduleStart.getTime() + (intervalOffset + randomMinuteOffset) * 60_000,
  );

  return departureTime.toISOString();
}
