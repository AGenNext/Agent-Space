import { createId, nowIso } from "../domain/ids.js";
import type { Classification, Space, SpaceType } from "../domain/types.js";
import type { SpaceRepository } from "../repositories/space-repository.js";
import type { AuditService } from "./audit-service.js";

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
  constructor(
    private readonly repository: SpaceRepository,
    private readonly audit?: AuditService
  ) {}

  listSpaces(): Promise<Space[]> {
    return this.repository.list();
  }

  getSpace(spaceId: string): Promise<Space> {
    return this.repository.get(spaceId);
  }

  async createSpace(input: CreateSpaceInput): Promise<Space> {
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

    const created = await this.repository.create(space);
    await this.audit?.record({
      space_id: created.id,
      action: "space.created",
      actor_id: input.owner_id,
      target_id: created.id,
      metadata: { type: created.type, classification: created.classification }
    });
    return created;
  }

  async updateSpace(spaceId: string, input: UpdateSpaceInput): Promise<Space> {
    const updated = await this.repository.update(spaceId, input);
    await this.audit?.record({
      space_id: spaceId,
      action: "space.updated",
      target_id: spaceId,
      metadata: input
    });
    return updated;
  }

  async archiveSpace(spaceId: string): Promise<Space> {
    const archived = await this.repository.update(spaceId, {
      status: "archived",
      archived_at: nowIso()
    });
    await this.audit?.record({ space_id: spaceId, action: "space.archived", target_id: spaceId });
    return archived;
  }

  async retireSpace(spaceId: string): Promise<Space> {
    const retired = await this.repository.update(spaceId, {
      status: "retired",
      retired_at: nowIso()
    });
    await this.audit?.record({ space_id: spaceId, action: "space.retired", target_id: spaceId });
    return retired;
  }
}
