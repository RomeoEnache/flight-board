export const FlightStatus = {
  OnTime: "On Time",
  Delayed: "Delayed",
  Cancelled: "Cancelled",
} as const;

export type FlightStatus = (typeof FlightStatus)[keyof typeof FlightStatus];

export const FLIGHT_STATUSES: readonly FlightStatus[] = [
  FlightStatus.OnTime,
  FlightStatus.Delayed,
  FlightStatus.Cancelled,
];

export type Flight = {
  flightNumber: string;
  destination: string;
  status: FlightStatus;
  gate: string;
  terminal: string;
  scheduledDepartureTime: string;
};
