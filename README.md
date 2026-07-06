# Agent-Space

Agent-Space owns bounded workspaces for AGenNext agents, humans, files, memory, channels, runs, permissions, and environments.

## Decision

Agent-Space defines the workspace/context boundary where agent work happens.

A space can represent a tenant, project, team, customer environment, operational workspace, or managed infrastructure domain.

## Roadmap

- [Product Roadmap](ROADMAP.md)

## Service

This repo now includes an initial TypeScript/Fastify service skeleton for the Agent-Space API.

```bash
npm install
npm run dev
```

The service starts on `http://localhost:8080` by default.

```bash
curl http://localhost:8080/healthz
curl http://localhost:8080/readyz
curl http://localhost:8080/v1/spaces
```

API docs are exposed at:

```txt
http://localhost:8080/docs
```

### Build and test

```bash
npm run build
npm test
npm run validate:openapi
```

### Docker

```bash
docker build -t agennext/agent-space:local .
docker run --rm -p 8080:8080 agennext/agent-space:local
```

## API surface

Requests are validated with Zod before they reach the service layer. Invalid requests return a structured `validation_error` response.

### Core spaces

```txt
GET    /v1/spaces
POST   /v1/spaces
GET    /v1/spaces/:space_id
PATCH  /v1/spaces/:space_id
POST   /v1/spaces/:space_id/archive
POST   /v1/spaces/:space_id/retire
```

### Space context

```txt
GET    /v1/spaces/:space_id/members
POST   /v1/spaces/:space_id/members
GET    /v1/spaces/:space_id/sources
POST   /v1/spaces/:space_id/sources
GET    /v1/spaces/:space_id/artifacts
POST   /v1/spaces/:space_id/artifacts
GET    /v1/spaces/:space_id/storage-bindings
POST   /v1/spaces/:space_id/storage-bindings
GET    /v1/spaces/:space_id/audit
```

## Audit events

The service records in-memory audit events for:

- `space.created`
- `space.updated`
- `space.archived`
- `space.retired`
- `space.member.added`
- `space.source.attached`
- `space.artifact.created`
- `space.storage_binding.created`

## Contracts

| Contract | Path |
|---|---|
| OpenAPI | [openapi/agent-space.openapi.yaml](openapi/agent-space.openapi.yaml) |
| Space schema | [schemas/space.schema.json](schemas/space.schema.json) |
| Space member schema | [schemas/space-member.schema.json](schemas/space-member.schema.json) |
| Space source schema | [schemas/space-source.schema.json](schemas/space-source.schema.json) |
| Space artifact schema | [schemas/space-artifact.schema.json](schemas/space-artifact.schema.json) |
| Storage binding schema | [schemas/storage-binding.schema.json](schemas/storage-binding.schema.json) |

## Scope

Agent-Space owns:

- workspace/space contracts
- tenant/project boundaries
- member references
- agent/team membership
- channel references
- drive/file references
- memory scope references
- environment references
- run/workflow scope references
- permission scope references
- lifecycle metadata

Agent-Space does not own:

- identity verification
- runtime execution
- memory backend implementation
- file storage adapters
- final platform authority
- deployment execution

## Boundary

| Component | Responsibility |
|---|---|
| Agent-Space | Workspace/context boundary |
| Agent-Channel | Communication within/between spaces |
| Agent-Drive | Files/artifacts attached to spaces |
| Agent-Memory | Memory scoped by space |
| Agent-Runs | Runs scoped by space |
| Agent-IGA | Access governance for spaces |
| Agent-Platform | Final authority and orchestration |
| Agent-Team | Teams operating inside spaces |

## Reference integrations

| Reference | Role in Agent-Space |
|---|---|
| [CNCF Cloud Native Storage Landscape](docs/cncf-cloud-native-storage.md) | Upstream ecosystem map for runtime cloud-native storage decisions. |
| [Hugging Face Spaces](docs/hugging-face-spaces.md) | Public ML, agent, Gradio, Docker, and static demo surfaces mapped to governed spaces. |
| [Hugging Face Datasets](docs/hugging-face-datasets.md) | Governed dataset source, dataset artifact, Dataset Viewer, streaming, licensing, and publishing surface. |
| [Spacedrive](docs/spacedrive.md) | Local-first file, device, cloud, and source surface for space context discovery. |
| [Spacebot](docs/spacebot.md) | Agent/team operating model with channels, workers, branches, memory, cron, and adapters. |
| [RustFS](docs/rustfs.md) | S3-compatible object storage backend for artifacts, datasets, evidence, and traces. |
| [CubeFS](docs/cubefs.md) | CNCF-aligned multi-protocol distributed storage for S3, POSIX, HDFS, and CSI workloads. |

## Space examples

```txt
space:cloud-prod-eu
space:kimsufi-lab
space:customer-acme
space:security-review
space:agent-platform-dev
```

## Flow

```txt
User or agent starts work
  ↓
Agent-Space resolves workspace boundary
  ↓
Input, files, memory, channels, permissions, and runs are scoped
  ↓
Agent-Platform governs actions inside the space
```

## Rule

Agents should not operate without an explicit space.

Space defines where the work belongs and what boundaries apply.
