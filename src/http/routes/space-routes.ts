import type { FastifyInstance } from "fastify";
import type { SpaceService } from "../../services/space-service.js";
import { createSpaceSchema, updateSpaceSchema, validateBody } from "../validation.js";

export async function registerSpaceRoutes(app: FastifyInstance, service: SpaceService): Promise<void> {
  app.get("/v1/spaces", async () => ({ items: await service.listSpaces() }));

  app.post("/v1/spaces", async (request, reply) => {
    const input = validateBody(createSpaceSchema, request);
    const space = await service.createSpace(input);
    return reply.code(201).send(space);
  });

  app.get("/v1/spaces/:space_id", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return service.getSpace(space_id);
  });

  app.patch("/v1/spaces/:space_id", async (request) => {
    const { space_id } = request.params as { space_id: string };
    const input = validateBody(updateSpaceSchema, request);
    return service.updateSpace(space_id, input);
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
