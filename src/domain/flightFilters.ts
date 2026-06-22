import { FLIGHT_STATUSES, type Flight, type FlightStatus } from "./flight";

export const ALL_STATUS_FILTER = "All";

export type FlightStatusFilter = typeof ALL_STATUS_FILTER | FlightStatus;

export type FlightFilters = {
  status: FlightStatusFilter;
};

export const STATUS_FILTER_OPTIONS: readonly FlightStatusFilter[] = [
  ALL_STATUS_FILTER,
  ...FLIGHT_STATUSES,
];

export const DEFAULT_FLIGHT_FILTERS: FlightFilters = {
  status: ALL_STATUS_FILTER,
};

export function filterFlights(
  flights: Flight[],
  filters: FlightFilters,
): Flight[] {
  return flights.filter((flight) =>
    matchesStatusFilter(flight, filters.status),
  );
}

function matchesStatusFilter(
  { status }: Flight,
  statusFilter: FlightStatusFilter,
): boolean {
  return statusFilter === ALL_STATUS_FILTER || status === statusFilter;
}
