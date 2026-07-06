import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { registerErrorHandler } from "./http/error-handler.js";
import { registerAuditRoutes } from "./http/routes/audit-routes.js";
import { registerContextRoutes } from "./http/routes/context-routes.js";
import { registerHealthRoutes } from "./http/routes/health-routes.js";
import { registerSpaceRoutes } from "./http/routes/space-routes.js";
import { InMemoryAuditRepository } from "./repositories/audit-repository.js";
import {
  InMemorySpaceArtifactRepository,
  InMemorySpaceMemberRepository,
  InMemorySpaceSourceRepository,
  InMemoryStorageBindingRepository
} from "./repositories/child-repositories.js";
import { InMemorySpaceRepository } from "./repositories/space-repository.js";
import { AuditService } from "./services/audit-service.js";
import { SpaceContextService } from "./services/space-context-service.js";
import { SpaceService } from "./services/space-service.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Agent-Space API",
        version: "0.1.0"
      }
    }
  });
  await app.register(swaggerUi, { routePrefix: "/docs" });

  const auditService = new AuditService(new InMemoryAuditRepository());
  const spaceRepository = new InMemorySpaceRepository();
  const spaceService = new SpaceService(spaceRepository, auditService);
  const spaceContextService = new SpaceContextService(
    spaceRepository,
    new InMemorySpaceMemberRepository(),
    new InMemorySpaceSourceRepository(),
    new InMemorySpaceArtifactRepository(),
    new InMemoryStorageBindingRepository(),
    auditService
  );

  registerErrorHandler(app);
  await registerHealthRoutes(app);
  await registerSpaceRoutes(app, spaceService);
  await registerContextRoutes(app, spaceContextService);
  await registerAuditRoutes(app, auditService);

  return app;
}
