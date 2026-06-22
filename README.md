## Running Locally

```sh
npm install
npm run dev
```

## Verification

```sh
npm run test
npm run lint
```

## Implementation Notes

- Flights auto-refresh every 30 seconds and can also be refreshed manually.
- The board keeps showing the last successful data during background refreshes.
- If a refresh fails after data has loaded, the last successful data remains
  visible and is marked as stale.
- Filtering by status is memoized so the filtered/grouped board is recomputed
  only when flights or filters change.
- Grouping is isolated behind a grouping abstraction so future grouping by gate
  or airline would be straightforward.
- The raw API-to-flight transformation is isolated from rendering code.
- Failure handling can be exercised through the failure simulation control.

## AI Usage Note

### Written By Me

- The product requirements interpretation and final behavior decisions.
- An extensive review and implementation pass after the initial AI output,
  which was too simple and not modular enough for the requirements.
- Corrections to state handling, test coverage, folder boundaries, and
  production-readiness concerns.

### Generated Or Assisted By AI

- Initial React/Vite implementation scaffolding.
- Some component, hooks, and test structure.
- Review support for identifying gaps against the assignment requirements

### Corrections Made To AI Output

- Reworked the initial simple implementation into a more modular structure with
  separate API mapping, domain logic, polling hooks, board rendering, and app
  composition.
- Tightened test coverage around the riskiest behavior: refresh status
  derivation, filtering, grouping, and stale-data handling.
- Kept the data-mapping logic separated from UI rendering so the API boundary is
  easier to change later.

### What I Would Do Differently With More Time

With more time, I would add a E2E test suite covering the core loading,
refresh, stale-data, and filtering flows. I would also make the time model more
explicit by using an airport-local date/time reference instead of relying on
viewer-local formatting. For larger datasets, I would explore virtualization or
pagination so the board remains responsive under heavier payloads. Finally, I
would move the failure simulation behind a dev-only flag so it can be
tree-shaken from production builds, and expand it to cover more failure cases such as 
slow responses, malformed payloads, HTTP errors, and aborted requests.
