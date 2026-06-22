import { useForceFailure } from "./failureSimulation";

export function ForceFailureToggle() {
  const { forceFailure, updateForceFailure } = useForceFailure();

  return (
    <label className="force-failure-toggle">
      <input
        checked={forceFailure}
        onChange={(event) => updateForceFailure(event.target.checked)}
        type="checkbox"
      />
      <span>Force failures</span>
    </label>
  );
}
