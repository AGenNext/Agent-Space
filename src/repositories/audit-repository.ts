import type { AuditEvent } from "../domain/audit.js";

export interface AuditRepository {
  append(event: AuditEvent): Promise<AuditEvent>;
  listBySpace(spaceId: string): Promise<AuditEvent[]>;
}

export class InMemoryAuditRepository implements AuditRepository {
  private readonly events: AuditEvent[] = [];

  async append(event: AuditEvent): Promise<AuditEvent> {
    this.events.push(event);
    return event;
  }

  async listBySpace(spaceId: string): Promise<AuditEvent[]> {
    return this.events.filter((event) => event.space_id === spaceId);
  }
}
