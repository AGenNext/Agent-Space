export type AuditAction =
  | "space.created"
  | "space.updated"
  | "space.archived"
  | "space.retired"
  | "space.member.added"
  | "space.source.attached"
  | "space.artifact.created"
  | "space.storage_binding.created";

export interface AuditEvent {
  id: string;
  space_id: string;
  action: AuditAction;
  actor_id?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}
