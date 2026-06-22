import { FlightBoard } from "../board/FlightBoard";
import { fetchFlights } from "../api/fetchFlights";
import { RefreshStatus } from "../hooks/refreshStatus";
import { useFlights } from "../hooks/useFlights";
import { StatusStrip } from "./StatusStrip";
import { ForceFailureToggle } from "../dev/ForceFailureToggle";
import { withFailureSimulation } from "../dev/failureSimulation";

// NOTE: to remove failure simulation, delete src/dev/, remove <ForceFailureToggle />
// and useFlights should use fetchFlights without hof
// for prod readiness a feature flag should be used to enable failure simulation in dev only
const loadFlights = withFailureSimulation(fetchFlights);

export function App() {
  const { flights, lastUpdatedAt, status, refreshFlights } = useFlights({
    loadFlights,
  });

  return (
    <main className="app-shell">
      <StatusStrip
        lastUpdatedAt={lastUpdatedAt}
        refreshStatus={status}
        onRefresh={refreshFlights}
      >
        <ForceFailureToggle />
      </StatusStrip>

      {lastUpdatedAt !== null ? (
        <FlightBoard flights={flights} />
      ) : status === RefreshStatus.InitialLoading ? (
        <InitialLoading />
      ) : (
        <InitialError />
      )}
    </main>
  );
}

function InitialLoading() {
  return (
    <section className="initial-state" aria-label="Initial loading">
      <h2>Loading departures</h2>
    </section>
  );
}

function InitialError() {
  return (
    <section className="initial-state initial-state-error" role="alert">
      <h2>Unable to load departures</h2>
    </section>
  );
}
