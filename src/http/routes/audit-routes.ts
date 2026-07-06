import type { FastifyInstance } from "fastify";
import type { AuditService } from "../../services/audit-service.js";

export async function registerAuditRoutes(app: FastifyInstance, service: AuditService): Promise<void> {
  app.get("/v1/spaces/:space_id/audit", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listBySpace(space_id) };
  });
}
