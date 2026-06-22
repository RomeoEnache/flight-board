import { useMemo, useState } from "react";
import {
  DEFAULT_FLIGHT_FILTERS,
  filterFlights,
  type FlightStatusFilter,
} from "../domain/flightFilters";
import { groupFlights, terminalGrouping } from "../domain/flightGrouping";
import type { Flight } from "../domain/flight";
import { BoardView } from "./BoardView";
import { FilterChips } from "./FilterChips";

type FlightBoardProps = {
  flights: Flight[];
};

export function FlightBoard({ flights }: FlightBoardProps) {
  const [filters, setFilters] = useState(DEFAULT_FLIGHT_FILTERS);

  const flightGroups = useMemo(() => {
    const filteredFlights = filterFlights(flights, filters);
    return groupFlights(filteredFlights, terminalGrouping);
  }, [flights, filters]);

  function setStatusFilter(status: FlightStatusFilter) {
    setFilters((currentFilters) => ({ ...currentFilters, status }));
  }

  return (
    <>
      <FilterChips
        selectedValue={filters.status}
        onSelectValue={setStatusFilter}
      />
      <BoardView flightGroups={flightGroups} />
    </>
  );
}
