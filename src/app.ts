import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { registerErrorHandler } from "./http/error-handler.js";
import { registerHealthRoutes } from "./http/routes/health-routes.js";
import { registerSpaceRoutes } from "./http/routes/space-routes.js";
import { InMemorySpaceRepository } from "./repositories/space-repository.js";
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

  const spaceRepository = new InMemorySpaceRepository();
  const spaceService = new SpaceService(spaceRepository);

  registerErrorHandler(app);
  await registerHealthRoutes(app);
  await registerSpaceRoutes(app, spaceService);

  return app;
}
