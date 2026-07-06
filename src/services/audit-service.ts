import type { AuditAction, AuditEvent } from "../domain/audit.js";
import { createId, nowIso } from "../domain/ids.js";
import type { AuditRepository } from "../repositories/audit-repository.js";

export interface RecordAuditInput {
  space_id: string;
  action: AuditAction;
  actor_id?: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  constructor(private readonly repository: AuditRepository) {}

  record(input: RecordAuditInput): Promise<AuditEvent> {
    return this.repository.append({
      id: createId("audit"),
      space_id: input.space_id,
      action: input.action,
      actor_id: input.actor_id,
      target_id: input.target_id,
      metadata: input.metadata,
      created_at: nowIso()
    });
  }

  listBySpace(spaceId: string): Promise<AuditEvent[]> {
    return this.repository.listBySpace(spaceId);
  }
}
