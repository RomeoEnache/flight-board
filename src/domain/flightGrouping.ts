import type { Flight } from "./flight";

export type FlightGroup = {
  key: string;
  heading: string;
  flights: Flight[];
};

export type FlightGrouping = {
  getClassifier: (flight: Flight) => string;
  getHeading: (key: string) => string;
  compareGroups: (first: FlightGroup, second: FlightGroup) => number;
  compareItems?: (first: Flight, second: Flight) => number;
};

export function groupFlights(
  flights: Flight[],
  grouping: FlightGrouping,
): FlightGroup[] {
  const groupedFlights = flights.reduce<Record<string, Flight[]>>(
    (acc, flight) => {
      (acc[grouping.getClassifier(flight)] ||= []).push(flight);
      return acc;
    },
    {},
  );

  const groups = Object.entries(groupedFlights).map(
    ([key, groupedFlights]) => ({
      key,
      heading: grouping.getHeading(key),
      flights: grouping.compareItems
        ? [...groupedFlights].sort(grouping.compareItems)
        : groupedFlights,
    }),
  );

  return groups.sort(grouping.compareGroups);
}

export const terminalGrouping: FlightGrouping = {
  getClassifier: ({ terminal }) => terminal,
  getHeading: (terminal) => `Terminal ${terminal}`,
  compareGroups: ({ key: first }, { key: second }) =>
    first.localeCompare(second, undefined, { numeric: true }),
  compareItems: (
    { scheduledDepartureTime: first },
    { scheduledDepartureTime: second },
  ) => new Date(first).getTime() - new Date(second).getTime(),
};
