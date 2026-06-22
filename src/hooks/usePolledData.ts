import { useCallback, useEffect, useRef, useState } from "react";

export type PolledLoad<T> = (request: { signal: AbortSignal }) => Promise<T>;

export function usePolledData<T>(
  fetchData: PolledLoad<T>,
  refreshInterval: number,
) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [lastRefreshFailed, setLastRefreshFailed] = useState(false);

  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const cleanup = useCallback(() => {
    abortControllerRef.current?.abort();
    clearTimeout(refreshTimerRef.current);
  }, []);

  const refresh = useCallback(async () => {
    cleanup();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { signal } = controller;

    setIsRefreshing(true);
    try {
      const result = await fetchData({ signal });
      if (signal.aborted) return;

      setData(result);
      setLastUpdatedAt(new Date().toISOString());
      setLastRefreshFailed(false);
    } catch {
      if (signal.aborted) return;

      setLastRefreshFailed(true);
    } finally {
      if (!signal.aborted) {
        setIsRefreshing(false);
        refreshTimerRef.current = setTimeout(refresh, refreshInterval);
      }
    }
  }, [cleanup, fetchData, refreshInterval]);

  useEffect(() => {
    refresh();

    return () => {
      cleanup();
    };
  }, [cleanup, refresh]);

  return { data, lastUpdatedAt, isRefreshing, lastRefreshFailed, refresh };
}
