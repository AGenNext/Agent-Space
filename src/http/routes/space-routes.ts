import type { FastifyInstance } from "fastify";
import type { SpaceService } from "../../services/space-service.js";

export async function registerSpaceRoutes(app: FastifyInstance, service: SpaceService): Promise<void> {
  app.get("/v1/spaces", async () => ({ items: await service.listSpaces() }));

  app.post("/v1/spaces", async (request, reply) => {
    const space = await service.createSpace(request.body as any);
    return reply.code(201).send(space);
  });

  app.get("/v1/spaces/:space_id", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return service.getSpace(space_id);
  });

  app.patch("/v1/spaces/:space_id", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return service.updateSpace(space_id, request.body as any);
  });

  app.post("/v1/spaces/:space_id/archive", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return service.archiveSpace(space_id);
  });

  app.post("/v1/spaces/:space_id/retire", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return service.retireSpace(space_id);
  });
}
