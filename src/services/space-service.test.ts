import { describe, expect, it } from "vitest";
import { InMemorySpaceRepository } from "../repositories/space-repository.js";
import { SpaceService } from "./space-service.js";

describe("SpaceService", () => {
  it("creates a draft space", async () => {
    const service = new SpaceService(new InMemorySpaceRepository());

    const space = await service.createSpace({
      name: "Customer ACME",
      type: "customer",
      classification: "confidential",
      owner_id: "user:chinmay"
    });

    expect(space.id).toMatch(/^space:/);
    expect(space.status).toBe("draft");
    expect(space.name).toBe("Customer ACME");
  });

  it("archives an active space", async () => {
    const service = new SpaceService(new InMemorySpaceRepository());
    const space = await service.createSpace({
      name: "Agent Platform Dev",
      type: "project",
      classification: "internal",
      owner_id: "user:chinmay"
    });

    await service.updateSpace(space.id, { status: "active" });
    const archived = await service.archiveSpace(space.id);

    expect(archived.status).toBe("archived");
    expect(archived.archived_at).toBeDefined();
  });

  it("rejects invalid lifecycle transitions", async () => {
    const service = new SpaceService(new InMemorySpaceRepository());
    const space = await service.createSpace({
      name: "Invalid Transition",
      type: "lab",
      classification: "internal",
      owner_id: "user:chinmay"
    });

    await expect(service.archiveSpace(space.id)).rejects.toThrow("Invalid space lifecycle transition");
  });
});
