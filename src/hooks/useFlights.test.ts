import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFlights } from "./useFlights";
import { RefreshStatus } from "./refreshStatus";
import type { Flight } from "../domain/flight";
import { aFlight } from "../test/factories";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function queuedLoader(responses: Deferred<Flight[]>[]) {
  let call = 0;
  return vi.fn(
    (_request: { signal: AbortSignal }): Promise<Flight[]> =>
      responses[call++]?.promise ?? new Promise<Flight[]>(() => {}),
  );
}

describe("useFlights refresh contract", () => {
  it("protects the board from overlapping requests and failed background refreshes", async () => {
    const initialLoad = deferred<Flight[]>();
    const manualLoad = deferred<Flight[]>();
    const failingLoad = deferred<Flight[]>();
    const loadFlights = queuedLoader([initialLoad, manualLoad, failingLoad]);

    const { result } = renderHook(() => useFlights({ loadFlights }));

    expect(loadFlights).toHaveBeenCalledTimes(1);
    expect(result.current.flights).toEqual([]);
    expect(result.current.status).toBe(RefreshStatus.InitialLoading);

    await act(async () => {
      result.current.refreshFlights();
    });
    expect(loadFlights).toHaveBeenCalledTimes(2);

    const latest = [aFlight({ flightNumber: "FL-LATEST" })];
    await act(async () => {
      manualLoad.resolve(latest);
      await manualLoad.promise;
    });
    expect(result.current.flights).toEqual(latest);
    expect(result.current.status).toBe(RefreshStatus.Loaded);

    const stalePredecessor = [aFlight({ flightNumber: "FL-STALE" })];
    await act(async () => {
      initialLoad.resolve(stalePredecessor);
      await initialLoad.promise;
    });
    expect(result.current.flights).toEqual(latest);

    await act(async () => {
      result.current.refreshFlights();
    });
    expect(result.current.status).toBe(RefreshStatus.BackgroundRefreshing);

    await act(async () => {
      failingLoad.reject(new Error("network down"));
      await failingLoad.promise.catch(() => {});
    });

    // The board still shows the last successful data, now flagged stale.
    expect(result.current.flights).toEqual(latest);
    expect(result.current.status).toBe(RefreshStatus.Stale);
  });
});
