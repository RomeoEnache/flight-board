import { describe, expect, it } from "vitest";
import { FlightStatus } from "./flight";
import { filterFlights } from "./flightFilters";
import { groupFlights, terminalGrouping } from "./flightGrouping";
import { aFlight } from "../test/factories";

describe("flight filtering and grouping", () => {
  it("filters by status, groups by terminal, and sorts grouped flights by departure time", () => {
    const flights = [
      aFlight({
        flightNumber: "FL-3",
        status: FlightStatus.Delayed,
        terminal: "2",
        scheduledDepartureTime: "2026-01-01T10:00:00.000Z",
      }),
      aFlight({
        flightNumber: "FL-1",
        status: FlightStatus.OnTime,
        terminal: "10",
        scheduledDepartureTime: "2026-01-01T08:00:00.000Z",
      }),
      aFlight({
        flightNumber: "FL-2",
        status: FlightStatus.Delayed,
        terminal: "2",
        scheduledDepartureTime: "2026-01-01T09:00:00.000Z",
      }),
    ];

    const filteredFlights = filterFlights(flights, {
      status: FlightStatus.Delayed,
    });
    const groups = groupFlights(filteredFlights, terminalGrouping);

    expect(groups).toEqual([
      {
        key: "2",
        heading: "Terminal 2",
        flights: [
          expect.objectContaining({ flightNumber: "FL-2" }),
          expect.objectContaining({ flightNumber: "FL-3" }),
        ],
      },
    ]);
  });
});
