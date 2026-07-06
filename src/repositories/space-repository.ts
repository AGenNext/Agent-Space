import { NotFoundError } from "../domain/errors.js";
import { assertSpaceTransition } from "../domain/lifecycle.js";
import type { Space } from "../domain/types.js";

export interface SpaceRepository {
  list(): Promise<Space[]>;
  get(spaceId: string): Promise<Space>;
  create(space: Space): Promise<Space>;
  update(spaceId: string, patch: Partial<Space>): Promise<Space>;
}

export class InMemorySpaceRepository implements SpaceRepository {
  private readonly spaces = new Map<string, Space>();

  async list(): Promise<Space[]> {
    return [...this.spaces.values()];
  }

  async get(spaceId: string): Promise<Space> {
    const space = this.spaces.get(spaceId);
    if (!space) throw new NotFoundError(`Space not found: ${spaceId}`);
    return space;
  }

  async create(space: Space): Promise<Space> {
    this.spaces.set(space.id, space);
    return space;
  }

  async update(spaceId: string, patch: Partial<Space>): Promise<Space> {
    const existing = await this.get(spaceId);
    if (patch.status) {
      assertSpaceTransition(existing.status, patch.status);
    }

    const updated: Space = {
      ...existing,
      ...patch,
      id: existing.id,
      updated_at: new Date().toISOString()
    };

    this.spaces.set(spaceId, updated);
    return updated;
  }
}
