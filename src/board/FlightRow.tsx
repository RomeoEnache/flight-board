import { FlightStatus, type Flight } from "../domain/flight";
import { formatClockTime } from "../utils/date";

const STATUS_TONES: Record<FlightStatus, "ok" | "warn" | "danger"> = {
  [FlightStatus.OnTime]: "ok",
  [FlightStatus.Delayed]: "warn",
  [FlightStatus.Cancelled]: "danger",
};

type FlightRowProps = {
  flight: Flight;
};

export function FlightRow({ flight }: FlightRowProps) {
  const {
    flightNumber,
    destination,
    status,
    gate,
    terminal,
    scheduledDepartureTime,
  } = flight;

  return (
    <div className="row" data-status={status}>
      <time className="flight-time" dateTime={scheduledDepartureTime}>
        {formatClockTime(scheduledDepartureTime)}
      </time>
      <span className="flight-number">{flightNumber}</span>
      <span className="flight-destination">{destination}</span>
      <span className="flight-terminal">{terminal}</span>
      <span className="flight-gate">{gate}</span>
      <span className="flight-status" data-tone={STATUS_TONES[status]}>
        {status}
      </span>
    </div>
  );
}
