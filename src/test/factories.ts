import { FlightStatus, type Flight } from "../domain/flight";
import type { Post } from "../api/mapPostToFlight";

export function aFlight(overrides: Partial<Flight> = {}): Flight {
  return {
    flightNumber: "FL-1",
    destination: "Test Destination",
    status: FlightStatus.OnTime,
    gate: "1",
    terminal: "1",
    scheduledDepartureTime: "2026-01-01T08:00:00.000Z",
    ...overrides,
  };
}

export function aPost(overrides: Partial<Post> = {}): Post {
  return {
    userId: 1,
    id: 1,
    title: "tokyo haneda",
    ...overrides,
  };
}
