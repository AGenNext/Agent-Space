export type SpaceType =
  | "personal"
  | "team"
  | "project"
  | "tenant"
  | "customer"
  | "lab"
  | "production"
  | "demo"
  | "archive"
  | "compliance-review";

export type SpaceStatus = "draft" | "active" | "restricted" | "review" | "archived" | "retired";
export type Classification = "public" | "internal" | "confidential" | "restricted";

export interface Space {
  id: string;
  name: string;
  description?: string;
  type: SpaceType;
  status: SpaceStatus;
  classification: Classification;
  owner_id: string;
  parent_space_id?: string;
  tags?: string[];
  policy_refs?: string[];
  storage_binding_refs?: string[];
  created_at: string;
  updated_at: string;
  archived_at?: string;
  retired_at?: string;
}

export type SpaceRole = "owner" | "admin" | "operator" | "contributor" | "viewer" | "auditor";
export type MemberStatus = "invited" | "active" | "suspended" | "removed";

export interface SpaceMember {
  id: string;
  space_id: string;
  principal_id: string;
  role: SpaceRole;
  status: MemberStatus;
  granted_by?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export type SourceStatus = "attached" | "available" | "offline" | "restricted" | "revoked" | "archived";

export interface SpaceSource {
  id: string;
  space_id: string;
  type: string;
  provider: string;
  reference: string;
  status: SourceStatus;
  classification?: Classification;
  content_hash?: string;
  provenance?: Record<string, unknown>;
  policy_refs?: string[];
  created_at: string;
  updated_at: string;
}

export interface SpaceArtifact {
  id: string;
  space_id: string;
  run_id?: string;
  agent_id?: string;
  type: string;
  storage_ref: string;
  status: string;
  classification?: Classification;
  content_hash?: string;
  retention_class?: string;
  provenance?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface StorageBinding {
  id: string;
  space_id: string;
  provider: string;
  access_protocols: string[];
  purpose: string;
  status: string;
  classification?: Classification;
  endpoint_ref?: string;
  bucket_or_volume?: string;
  versioning?: boolean;
  object_lock?: boolean;
  retention_policy_id?: string;
  audit?: {
    reads?: boolean;
    writes?: boolean;
    deletes?: boolean;
    exports?: boolean;
  };
  created_at: string;
  updated_at: string;
}
