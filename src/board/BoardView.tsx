import type { FlightGroup } from "../domain/flightGrouping";
import { ColumnCaptions } from "./ColumnCaptions";
import { FlightRow } from "./FlightRow";

type BoardViewProps = {
  flightGroups: FlightGroup[];
};

export function BoardView({ flightGroups }: BoardViewProps) {
  if (flightGroups.length === 0)
    return <p className="empty-board">No flights.</p>;

  return (
    <section className="board">
      {flightGroups.map(({ key, heading, flights }) => (
        <section className="group" key={key}>
          <h2 className="group-heading">{heading}</h2>

          <ColumnCaptions />

          {flights.map((flight) => (
            <FlightRow flight={flight} key={flight.flightNumber} />
          ))}
        </section>
      ))}
    </section>
  );
}
