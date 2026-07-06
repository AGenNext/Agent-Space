import type { FastifyInstance } from "fastify";
import type { SpaceContextService } from "../../services/space-context-service.js";

export async function registerContextRoutes(app: FastifyInstance, service: SpaceContextService): Promise<void> {
  app.get("/v1/spaces/:space_id/members", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listMembers(space_id) };
  });

  app.post("/v1/spaces/:space_id/members", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const member = await service.addMember(space_id, request.body as any);
    return reply.code(201).send(member);
  });

  app.get("/v1/spaces/:space_id/sources", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listSources(space_id) };
  });

  app.post("/v1/spaces/:space_id/sources", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const source = await service.attachSource(space_id, request.body as any);
    return reply.code(201).send(source);
  });

  app.get("/v1/spaces/:space_id/artifacts", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listArtifacts(space_id) };
  });

  app.post("/v1/spaces/:space_id/artifacts", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const artifact = await service.createArtifact(space_id, request.body as any);
    return reply.code(201).send(artifact);
  });

  app.get("/v1/spaces/:space_id/storage-bindings", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listStorageBindings(space_id) };
  });

  app.post("/v1/spaces/:space_id/storage-bindings", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const binding = await service.createStorageBinding(space_id, request.body as any);
    return reply.code(201).send(binding);
  });
}
