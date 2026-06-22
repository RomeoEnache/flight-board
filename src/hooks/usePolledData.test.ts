import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePolledData } from "./usePolledData";

describe("usePolledData", () => {
  it("does not re-subscribe when the loader identity changes on every render", () => {
    let loadCount = 0;
    const { rerender } = renderHook(() =>
      usePolledData<number>(() => {
        loadCount += 1;
        return new Promise<number>(() => {});
      }, 30_000),
    );

    expect(loadCount).toBe(1);

    rerender();
    rerender();
    rerender();

    expect(loadCount).toBe(1);
  });

  it("keeps polling and recovers after a failed background refresh", async () => {
    vi.useFakeTimers();
    try {
      const steps: Array<() => Promise<string[]>> = [
        () => Promise.resolve(["A"]),
        () => Promise.reject(new Error("network down")),
        () => Promise.resolve(["B"]),
      ];
      let call = 0;
      const loader = vi.fn(() =>
        (steps[call++] ?? (() => new Promise<string[]>(() => {})))(),
      );

      const { result } = renderHook(() => usePolledData(loader, 30_000));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(result.current.data).toEqual(["A"]);
      expect(result.current.lastRefreshFailed).toBe(false);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
      expect(result.current.data).toEqual(["A"]);
      expect(result.current.lastRefreshFailed).toBe(true);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(30_000);
      });
      expect(result.current.data).toEqual(["B"]);
      expect(result.current.lastRefreshFailed).toBe(false);

      expect(loader).toHaveBeenCalledTimes(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it("stops the scheduled poll after unmount", async () => {
    vi.useFakeTimers();
    try {
      const loader = vi.fn(() => Promise.resolve(["A"]));
      const { unmount } = renderHook(() => usePolledData(loader, 30_000));

      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      expect(loader).toHaveBeenCalledTimes(1); // mount load done, next poll scheduled

      unmount();
      await vi.advanceTimersByTimeAsync(30_000 * 3);

      expect(loader).toHaveBeenCalledTimes(1); // timer cleared, no further loads
    } finally {
      vi.useRealTimers();
    }
  });
});
