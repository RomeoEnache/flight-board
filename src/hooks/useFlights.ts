import { fetchFlights, type FlightLoader } from "../api/fetchFlights";
import { deriveRefreshStatus } from "../domain/refreshStatus";
import { usePolledData } from "./usePolledData";

const REFRESH_INTERVAL = 30_000;

export function useFlights({
  loadFlights = fetchFlights,
}: { loadFlights?: FlightLoader } = {}) {
  const { data, lastUpdatedAt, isRefreshing, lastRefreshFailed, refresh } =
    usePolledData(loadFlights, REFRESH_INTERVAL);

  return {
    flights: data ?? [],
    lastUpdatedAt,
    status: deriveRefreshStatus({
      lastUpdatedAt,
      isRefreshing,
      lastRefreshFailed,
    }),
    refreshFlights: refresh,
  };
}
