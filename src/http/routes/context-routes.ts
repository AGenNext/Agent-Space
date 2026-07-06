import type { FastifyInstance } from "fastify";
import type { SpaceContextService } from "../../services/space-context-service.js";
import {
  addMemberSchema,
  attachSourceSchema,
  createArtifactSchema,
  createStorageBindingSchema,
  validateBody
} from "../validation.js";

export async function registerContextRoutes(app: FastifyInstance, service: SpaceContextService): Promise<void> {
  app.get("/v1/spaces/:space_id/members", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listMembers(space_id) };
  });

  app.post("/v1/spaces/:space_id/members", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const input = validateBody(addMemberSchema, request);
    const member = await service.addMember(space_id, input);
    return reply.code(201).send(member);
  });

  app.get("/v1/spaces/:space_id/sources", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listSources(space_id) };
  });

  app.post("/v1/spaces/:space_id/sources", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const input = validateBody(attachSourceSchema, request);
    const source = await service.attachSource(space_id, input);
    return reply.code(201).send(source);
  });

  app.get("/v1/spaces/:space_id/artifacts", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listArtifacts(space_id) };
  });

  app.post("/v1/spaces/:space_id/artifacts", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const input = validateBody(createArtifactSchema, request);
    const artifact = await service.createArtifact(space_id, input);
    return reply.code(201).send(artifact);
  });

  app.get("/v1/spaces/:space_id/storage-bindings", async (request) => {
    const { space_id } = request.params as { space_id: string };
    return { items: await service.listStorageBindings(space_id) };
  });

  app.post("/v1/spaces/:space_id/storage-bindings", async (request, reply) => {
    const { space_id } = request.params as { space_id: string };
    const input = validateBody(createStorageBindingSchema, request);
    const binding = await service.createStorageBinding(space_id, input);
    return reply.code(201).send(binding);
  });
}
