import { describe, expect, it } from "vitest";
import {
  InMemorySpaceArtifactRepository,
  InMemorySpaceMemberRepository,
  InMemorySpaceSourceRepository,
  InMemoryStorageBindingRepository
} from "../repositories/child-repositories.js";
import { InMemorySpaceRepository } from "../repositories/space-repository.js";
import { SpaceContextService } from "./space-context-service.js";
import { SpaceService } from "./space-service.js";

function createServices() {
  const spaceRepository = new InMemorySpaceRepository();
  return {
    spaces: new SpaceService(spaceRepository),
    context: new SpaceContextService(
      spaceRepository,
      new InMemorySpaceMemberRepository(),
      new InMemorySpaceSourceRepository(),
      new InMemorySpaceArtifactRepository(),
      new InMemoryStorageBindingRepository()
    )
  };
}

describe("SpaceContextService", () => {
  it("adds members inside an existing space", async () => {
    const { spaces, context } = createServices();
    const space = await spaces.createSpace({
      name: "Team Space",
      type: "team",
      classification: "internal",
      owner_id: "user:owner"
    });

    const member = await context.addMember(space.id, {
      principal_id: "agent:researcher",
      role: "contributor"
    });

    expect(member.space_id).toBe(space.id);
    expect(member.status).toBe("active");
    expect(await context.listMembers(space.id)).toHaveLength(1);
  });

  it("attaches sources and storage bindings", async () => {
    const { spaces, context } = createServices();
    const space = await spaces.createSpace({
      name: "Storage Space",
      type: "project",
      classification: "confidential",
      owner_id: "user:owner"
    });

    const source = await context.attachSource(space.id, {
      type: "repository",
      provider: "github",
      reference: "repo:AGenNext/Agent-Space"
    });

    const binding = await context.createStorageBinding(space.id, {
      provider: "rustfs",
      access_protocols: ["s3"],
      purpose: "artifacts",
      bucket_or_volume: "agent-space-artifacts"
    });

    expect(source.status).toBe("attached");
    expect(binding.versioning).toBe(true);
    expect(await context.listSources(space.id)).toHaveLength(1);
    expect(await context.listStorageBindings(space.id)).toHaveLength(1);
  });

  it("creates artifacts", async () => {
    const { spaces, context } = createServices();
    const space = await spaces.createSpace({
      name: "Artifact Space",
      type: "lab",
      classification: "internal",
      owner_id: "user:owner"
    });

    const artifact = await context.createArtifact(space.id, {
      type: "report",
      storage_ref: "object:agent-space-artifacts/report.md",
      retention_class: "active"
    });

    expect(artifact.space_id).toBe(space.id);
    expect(artifact.status).toBe("draft");
    expect(await context.listArtifacts(space.id)).toHaveLength(1);
  });

  it("rejects child resources for missing spaces", async () => {
    const { context } = createServices();

    await expect(
      context.addMember("space:missing", {
        principal_id: "user:viewer",
        role: "viewer"
      })
    ).rejects.toThrow("Space not found");
  });
});
