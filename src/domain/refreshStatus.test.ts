import { describe, expect, it } from "vitest";
import { deriveRefreshStatus, RefreshStatus } from "./refreshStatus";

describe("deriveRefreshStatus", () => {
  it.each([
    {
      name: "initial load before data exists",
      input: {
        lastUpdatedAt: null,
        isRefreshing: true,
        lastRefreshFailed: false,
      },
      expected: RefreshStatus.InitialLoading,
    },
    {
      name: "retry after first-load failure",
      input: {
        lastUpdatedAt: null,
        isRefreshing: true,
        lastRefreshFailed: true,
      },
      expected: RefreshStatus.InitialRefreshing,
    },
    {
      name: "stale data after background refresh failure",
      input: {
        lastUpdatedAt: "2026-01-01T08:00:00.000Z",
        isRefreshing: false,
        lastRefreshFailed: true,
      },
      expected: RefreshStatus.Stale,
    },
  ])("$name", ({ input, expected }) => {
    expect(deriveRefreshStatus(input)).toBe(expected);
  });
});
