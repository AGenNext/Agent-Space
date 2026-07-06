import { createId, nowIso } from "../domain/ids.js";
import type { Classification, Space, SpaceType } from "../domain/types.js";
import type { SpaceRepository } from "../repositories/space-repository.js";

export interface CreateSpaceInput {
  name: string;
  description?: string;
  type: SpaceType;
  classification: Classification;
  owner_id: string;
  parent_space_id?: string;
  tags?: string[];
}

export interface UpdateSpaceInput {
  name?: string;
  description?: string;
  status?: Space["status"];
  classification?: Classification;
  tags?: string[];
}

export class SpaceService {
  constructor(private readonly repository: SpaceRepository) {}

  listSpaces(): Promise<Space[]> {
    return this.repository.list();
  }

  getSpace(spaceId: string): Promise<Space> {
    return this.repository.get(spaceId);
  }

  createSpace(input: CreateSpaceInput): Promise<Space> {
    const timestamp = nowIso();
    const space: Space = {
      id: createId("space"),
      name: input.name,
      description: input.description,
      type: input.type,
      status: "draft",
      classification: input.classification,
      owner_id: input.owner_id,
      parent_space_id: input.parent_space_id,
      tags: input.tags ?? [],
      policy_refs: [],
      storage_binding_refs: [],
      created_at: timestamp,
      updated_at: timestamp
    };

    return this.repository.create(space);
  }

  updateSpace(spaceId: string, input: UpdateSpaceInput): Promise<Space> {
    return this.repository.update(spaceId, input);
  }

  archiveSpace(spaceId: string): Promise<Space> {
    return this.repository.update(spaceId, {
      status: "archived",
      archived_at: nowIso()
    });
  }

  retireSpace(spaceId: string): Promise<Space> {
    return this.repository.update(spaceId, {
      status: "retired",
      retired_at: nowIso()
    });
  }
}
