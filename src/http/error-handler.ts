import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { InvalidTransitionError, NotFoundError } from "../domain/errors.js";
import { ValidationError, validationErrorResponse } from "./validation.js";

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error, reply);
    }

    if (error instanceof NotFoundError) {
      return reply.code(404).send({ error: "not_found", message: error.message });
    }

    if (error instanceof InvalidTransitionError) {
      return reply.code(409).send({ error: "invalid_transition", message: error.message });
    }

    app.log.error(error);
    return reply.code(500).send({ error: "internal_error", message: "Internal server error" });
  });
}
