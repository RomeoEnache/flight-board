import type { ReactNode } from "react";
import { RefreshStatus } from "../domain/refreshStatus";
import { formatClockTime } from "../utils/date";

const REFRESH_STATUS_PRESENTATION: Record<
  RefreshStatus,
  { label: string; tone: "ok" | "warn" | "danger" | "accent" }
> = {
  [RefreshStatus.InitialLoading]: { label: "Loading", tone: "accent" },
  [RefreshStatus.InitialRefreshing]: { label: "Refreshing", tone: "accent" },
  [RefreshStatus.InitialError]: { label: "Unavailable", tone: "danger" },
  [RefreshStatus.BackgroundRefreshing]: { label: "Refreshing", tone: "accent" },
  [RefreshStatus.Loaded]: { label: "Live", tone: "ok" },
  [RefreshStatus.Stale]: { label: "Stale", tone: "warn" },
};

type StatusStripProps = {
  lastUpdatedAt: string | null;
  refreshStatus: RefreshStatus;
  onRefresh: () => void;
  children?: ReactNode;
};

export function StatusStrip({
  lastUpdatedAt,
  refreshStatus,
  onRefresh,
  children,
}: StatusStripProps) {
  const { label, tone } = REFRESH_STATUS_PRESENTATION[refreshStatus];

  return (
    <section className="status-strip" aria-label="Board status">
      <h1>✈ Departures</h1>
      <div className="status-controls">
        <div
          className="refresh-status"
          data-status={refreshStatus}
          data-tone={tone}
          aria-label="Refresh status"
        >
          <span className="refresh-status-dot" aria-hidden="true" />
          {label}
        </div>

        {lastUpdatedAt !== null ? (
          <div className="last-updated">
            Last updated:{" "}
            <time>{formatClockTime(lastUpdatedAt, { withSeconds: true })}</time>
          </div>
        ) : null}

        {children}

        <button onClick={onRefresh} type="button">
          Refresh
        </button>
      </div>
    </section>
  );
}
