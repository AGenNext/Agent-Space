import { NotFoundError } from "../domain/errors.js";
import type { SpaceArtifact, SpaceMember, SpaceSource, StorageBinding } from "../domain/types.js";

export interface SpaceMemberRepository {
  listBySpace(spaceId: string): Promise<SpaceMember[]>;
  create(member: SpaceMember): Promise<SpaceMember>;
}

export interface SpaceSourceRepository {
  listBySpace(spaceId: string): Promise<SpaceSource[]>;
  create(source: SpaceSource): Promise<SpaceSource>;
}

export interface SpaceArtifactRepository {
  listBySpace(spaceId: string): Promise<SpaceArtifact[]>;
  create(artifact: SpaceArtifact): Promise<SpaceArtifact>;
}

export interface StorageBindingRepository {
  listBySpace(spaceId: string): Promise<StorageBinding[]>;
  create(binding: StorageBinding): Promise<StorageBinding>;
}

class InMemoryChildRepository<T extends { id: string; space_id: string }> {
  private readonly records = new Map<string, T>();

  async listBySpace(spaceId: string): Promise<T[]> {
    return [...this.records.values()].filter((record) => record.space_id === spaceId);
  }

  async create(record: T): Promise<T> {
    this.records.set(record.id, record);
    return record;
  }

  async get(recordId: string): Promise<T> {
    const record = this.records.get(recordId);
    if (!record) throw new NotFoundError(`Record not found: ${recordId}`);
    return record;
  }
}

export class InMemorySpaceMemberRepository
  extends InMemoryChildRepository<SpaceMember>
  implements SpaceMemberRepository {}

export class InMemorySpaceSourceRepository
  extends InMemoryChildRepository<SpaceSource>
  implements SpaceSourceRepository {}

export class InMemorySpaceArtifactRepository
  extends InMemoryChildRepository<SpaceArtifact>
  implements SpaceArtifactRepository {}

export class InMemoryStorageBindingRepository
  extends InMemoryChildRepository<StorageBinding>
  implements StorageBindingRepository {}
