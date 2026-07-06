import { InvalidTransitionError } from "./errors.js";
import type { SpaceStatus } from "./types.js";

const transitions: Record<SpaceStatus, SpaceStatus[]> = {
  draft: ["active", "retired"],
  active: ["restricted", "review", "archived", "retired"],
  restricted: ["active", "review", "archived", "retired"],
  review: ["active", "restricted", "archived", "retired"],
  archived: ["retired"],
  retired: []
};

export function assertSpaceTransition(from: SpaceStatus, to: SpaceStatus): void {
  if (from === to) return;
  if (!transitions[from].includes(to)) {
    throw new InvalidTransitionError(`Invalid space lifecycle transition from ${from} to ${to}`);
  }
}
