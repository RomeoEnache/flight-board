import { describe, expect, it } from "vitest";
import { mapPostsToFlights } from "./mapPostToFlight";
import { aPost } from "../test/factories";
import { FlightStatus } from "../domain/flight";

describe("mapPostsToFlights", () => {
  it("keeps the external API boundary deterministic and isolated from the UI", () => {
    const post = aPost({
      id: 17,
      userId: 4,
      title: "london heathrow",
    });

    const [flight] = mapPostsToFlights([post]);
    const [sameFlightMappedAgain] = mapPostsToFlights([post]);

    expect(flight).toEqual({
      flightNumber: "FL-17",
      destination: "london heathrow",
      status: FlightStatus.Cancelled,
      gate: "8",
      terminal: "4",
      scheduledDepartureTime: "2026-01-01T04:18:00.000Z",
    });
    expect(sameFlightMappedAgain).toEqual(flight);
  });
});
