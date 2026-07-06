import { createId, nowIso } from "../domain/ids.js";
import type { Classification, SpaceArtifact, SpaceMember, SpaceRole, SpaceSource, StorageBinding } from "../domain/types.js";
import type {
  SpaceArtifactRepository,
  SpaceMemberRepository,
  SpaceSourceRepository,
  StorageBindingRepository
} from "../repositories/child-repositories.js";
import type { SpaceRepository } from "../repositories/space-repository.js";
import type { AuditService } from "./audit-service.js";

export interface AddMemberInput {
  principal_id: string;
  role: SpaceRole;
  granted_by?: string;
  expires_at?: string;
}

export interface AttachSourceInput {
  type: SpaceSource["type"];
  provider: SpaceSource["provider"];
  reference: string;
  classification?: Classification;
  content_hash?: string;
  provenance?: Record<string, unknown>;
  policy_refs?: string[];
}

export interface CreateArtifactInput {
  run_id?: string;
  agent_id?: string;
  type: SpaceArtifact["type"];
  storage_ref: string;
  classification?: Classification;
  content_hash?: string;
  retention_class?: string;
  provenance?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface CreateStorageBindingInput {
  provider: StorageBinding["provider"];
  access_protocols: string[];
  purpose: StorageBinding["purpose"];
  classification?: Classification;
  endpoint_ref?: string;
  bucket_or_volume?: string;
  versioning?: boolean;
  object_lock?: boolean;
  retention_policy_id?: string;
}

export class SpaceContextService {
  constructor(
    private readonly spaces: SpaceRepository,
    private readonly members: SpaceMemberRepository,
    private readonly sources: SpaceSourceRepository,
    private readonly artifacts: SpaceArtifactRepository,
    private readonly storageBindings: StorageBindingRepository,
    private readonly audit?: AuditService
  ) {}

  async listMembers(spaceId: string): Promise<SpaceMember[]> {
    await this.spaces.get(spaceId);
    return this.members.listBySpace(spaceId);
  }

  async addMember(spaceId: string, input: AddMemberInput): Promise<SpaceMember> {
    await this.spaces.get(spaceId);
    const timestamp = nowIso();
    const member = await this.members.create({
      id: createId("member"),
      space_id: spaceId,
      principal_id: input.principal_id,
      role: input.role,
      status: "active",
      granted_by: input.granted_by,
      expires_at: input.expires_at,
      created_at: timestamp,
      updated_at: timestamp
    });

    await this.audit?.record({
      space_id: spaceId,
      action: "space.member.added",
      actor_id: input.granted_by,
      target_id: member.id,
      metadata: { principal_id: member.principal_id, role: member.role }
    });

    return member;
  }

  async listSources(spaceId: string): Promise<SpaceSource[]> {
    await this.spaces.get(spaceId);
    return this.sources.listBySpace(spaceId);
  }

  async attachSource(spaceId: string, input: AttachSourceInput): Promise<SpaceSource> {
    await this.spaces.get(spaceId);
    const timestamp = nowIso();
    const source = await this.sources.create({
      id: createId("source"),
      space_id: spaceId,
      type: input.type,
      provider: input.provider,
      reference: input.reference,
      status: "attached",
      classification: input.classification,
      content_hash: input.content_hash,
      provenance: input.provenance,
      policy_refs: input.policy_refs ?? [],
      created_at: timestamp,
      updated_at: timestamp
    });

    await this.audit?.record({
      space_id: spaceId,
      action: "space.source.attached",
      target_id: source.id,
      metadata: { provider: source.provider, type: source.type, classification: source.classification }
    });

    return source;
  }

  async listArtifacts(spaceId: string): Promise<SpaceArtifact[]> {
    await this.spaces.get(spaceId);
    return this.artifacts.listBySpace(spaceId);
  }

  async createArtifact(spaceId: string, input: CreateArtifactInput): Promise<SpaceArtifact> {
    await this.spaces.get(spaceId);
    const timestamp = nowIso();
    const artifact = await this.artifacts.create({
      id: createId("artifact"),
      space_id: spaceId,
      run_id: input.run_id,
      agent_id: input.agent_id,
      type: input.type,
      storage_ref: input.storage_ref,
      status: "draft",
      classification: input.classification,
      content_hash: input.content_hash,
      retention_class: input.retention_class,
      provenance: input.provenance,
      metadata: input.metadata,
      created_at: timestamp,
      updated_at: timestamp
    });

    await this.audit?.record({
      space_id: spaceId,
      action: "space.artifact.created",
      actor_id: input.agent_id,
      target_id: artifact.id,
      metadata: { type: artifact.type, retention_class: artifact.retention_class }
    });

    return artifact;
  }

  async listStorageBindings(spaceId: string): Promise<StorageBinding[]> {
    await this.spaces.get(spaceId);
    return this.storageBindings.listBySpace(spaceId);
  }

  async createStorageBinding(spaceId: string, input: CreateStorageBindingInput): Promise<StorageBinding> {
    await this.spaces.get(spaceId);
    const timestamp = nowIso();
    const binding = await this.storageBindings.create({
      id: createId("storage"),
      space_id: spaceId,
      provider: input.provider,
      access_protocols: input.access_protocols,
      purpose: input.purpose,
      status: "active",
      classification: input.classification,
      endpoint_ref: input.endpoint_ref,
      bucket_or_volume: input.bucket_or_volume,
      versioning: input.versioning ?? true,
      object_lock: input.object_lock ?? false,
      retention_policy_id: input.retention_policy_id,
      audit: {
        reads: true,
        writes: true,
        deletes: true,
        exports: true
      },
      created_at: timestamp,
      updated_at: timestamp
    });

    await this.audit?.record({
      space_id: spaceId,
      action: "space.storage_binding.created",
      target_id: binding.id,
      metadata: { provider: binding.provider, purpose: binding.purpose, access_protocols: binding.access_protocols }
    });

    return binding;
  }
}
