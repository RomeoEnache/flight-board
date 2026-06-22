import {
  STATUS_FILTER_OPTIONS,
  type FlightStatusFilter,
} from "../domain/flightFilters";

type FilterChipsProps = {
  selectedValue: FlightStatusFilter;
  onSelectValue: (value: FlightStatusFilter) => void;
};

export function FilterChips({
  selectedValue,
  onSelectValue,
}: FilterChipsProps) {
  return (
    <div className="filter-strip" aria-label="Flight status filters">
      {STATUS_FILTER_OPTIONS.map((filterValue) => (
        <button
          data-selected={filterValue === selectedValue}
          key={filterValue}
          onClick={() => onSelectValue(filterValue)}
          type="button"
        >
          {filterValue}
        </button>
      ))}
    </div>
  );
}
