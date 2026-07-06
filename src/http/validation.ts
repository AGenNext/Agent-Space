import type { FastifyReply, FastifyRequest } from "fastify";
import { z, type ZodSchema } from "zod";

export class ValidationError extends Error {
  constructor(public readonly issues: unknown) {
    super("Request validation failed");
    this.name = "ValidationError";
  }
}

export function validateBody<T>(schema: ZodSchema<T>, request: FastifyRequest): T {
  const result = schema.safeParse(request.body);
  if (!result.success) {
    throw new ValidationError(result.error.flatten());
  }
  return result.data;
}

export function validationErrorResponse(error: ValidationError, reply: FastifyReply) {
  return reply.code(400).send({
    error: "validation_error",
    message: error.message,
    issues: error.issues
  });
}

export const classificationSchema = z.enum(["public", "internal", "confidential", "restricted"]);
export const spaceTypeSchema = z.enum([
  "personal",
  "team",
  "project",
  "tenant",
  "customer",
  "lab",
  "production",
  "demo",
  "archive",
  "compliance-review"
]);
export const spaceStatusSchema = z.enum(["draft", "active", "restricted", "review", "archived", "retired"]);

export const createSpaceSchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(2000).optional(),
  type: spaceTypeSchema,
  classification: classificationSchema,
  owner_id: z.string().min(3).max(192),
  parent_space_id: z.string().startsWith("space:").optional(),
  tags: z.array(z.string().min(1).max(64)).optional()
});

export const updateSpaceSchema = z.object({
  name: z.string().min(1).max(160).optional(),
  description: z.string().max(2000).optional(),
  status: spaceStatusSchema.optional(),
  classification: classificationSchema.optional(),
  tags: z.array(z.string().min(1).max(64)).optional()
});

export const addMemberSchema = z.object({
  principal_id: z.string().min(3).max(192),
  role: z.enum(["owner", "admin", "operator", "contributor", "viewer", "auditor"]),
  granted_by: z.string().min(3).max(192).optional(),
  expires_at: z.string().datetime().optional()
});

export const attachSourceSchema = z.object({
  type: z.string().min(1).max(64),
  provider: z.string().min(1).max(64),
  reference: z.string().min(1).max(2048),
  classification: classificationSchema.optional(),
  content_hash: z.string().max(256).optional(),
  provenance: z.record(z.unknown()).optional(),
  policy_refs: z.array(z.string().startsWith("policy:")).optional()
});

export const createArtifactSchema = z.object({
  run_id: z.string().startsWith("run:").optional(),
  agent_id: z.string().startsWith("agent:").optional(),
  type: z.string().min(1).max(64),
  storage_ref: z.string().min(1).max(2048),
  classification: classificationSchema.optional(),
  content_hash: z.string().max(256).optional(),
  retention_class: z.string().min(1).max(64).optional(),
  provenance: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional()
});

export const createStorageBindingSchema = z.object({
  provider: z.string().min(1).max(64),
  access_protocols: z.array(z.enum(["file", "s3", "posix", "hdfs", "csi", "http"])).min(1),
  purpose: z.string().min(1).max(64),
  classification: classificationSchema.optional(),
  endpoint_ref: z.string().max(2048).optional(),
  bucket_or_volume: z.string().max(512).optional(),
  versioning: z.boolean().optional(),
  object_lock: z.boolean().optional(),
  retention_policy_id: z.string().startsWith("policy:").optional()
});
