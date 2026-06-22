export const RefreshStatus = {
  InitialLoading: "initial-loading",
  InitialRefreshing: "initial-refreshing",
  InitialError: "initial-error",
  Loaded: "loaded",
  BackgroundRefreshing: "background-refreshing",
  Stale: "stale",
} as const;

export type RefreshStatus = (typeof RefreshStatus)[keyof typeof RefreshStatus];

export function deriveRefreshStatus({
  lastUpdatedAt,
  isRefreshing,
  lastRefreshFailed,
}: {
  lastUpdatedAt: string | null;
  isRefreshing: boolean;
  lastRefreshFailed: boolean;
}): RefreshStatus {
  const hasData = lastUpdatedAt !== null;

  if (!hasData) {
    if (lastRefreshFailed)
      return isRefreshing
        ? RefreshStatus.InitialRefreshing
        : RefreshStatus.InitialError;

    return RefreshStatus.InitialLoading;
  }

  if (isRefreshing) return RefreshStatus.BackgroundRefreshing;

  if (lastRefreshFailed) return RefreshStatus.Stale;

  return RefreshStatus.Loaded;
}
