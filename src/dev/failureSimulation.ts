import { useState } from "react";
import type { FlightLoader } from "../api/fetchFlights";

const FORCE_FAILURE_STORAGE_KEY = "flight-board:force-failures";
const FAILURE_SIMULATION_LATENCY_MS = 750;

export function useForceFailure() {
  const [forceFailure, setForceFailure] = useState(readStoredForceFailure);

  function updateForceFailure(nextForceFailure: boolean) {
    setForceFailure(nextForceFailure);
    storeForceFailure(nextForceFailure);
  }

  return { forceFailure, updateForceFailure };
}

export function withFailureSimulation(loadFlights: FlightLoader): FlightLoader {
  return async ({ signal }) => {
    if (!readStoredForceFailure()) {
      return loadFlights({ signal });
    }

    await delay(FAILURE_SIMULATION_LATENCY_MS, signal);

    const abortController = new AbortController();
    const request = loadFlights({ signal: abortController.signal });
    abortController.abort();
    return request;
  };
}

function readStoredForceFailure(): boolean {
  try {
    return localStorage.getItem(FORCE_FAILURE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function storeForceFailure(forceFailure: boolean) {
  try {
    localStorage.setItem(FORCE_FAILURE_STORAGE_KEY, `${forceFailure}`);
  } catch {
    // Storage unavailable
  }
}

function delay(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.reject(createAbortError());
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      signal.removeEventListener("abort", abort);
      resolve();
    }, ms);

    function abort() {
      clearTimeout(timeout);
      reject(createAbortError());
    }

    signal.addEventListener("abort", abort, { once: true });
  });
}

function createAbortError() {
  return new DOMException("Request aborted", "AbortError");
}
