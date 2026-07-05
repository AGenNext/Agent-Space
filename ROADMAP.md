# Agent-Space Product Roadmap

Agent-Space is the bounded workspace layer for AGenNext. It defines where agent work belongs, who and what is allowed inside the boundary, which files and memories are in scope, and how runs, artifacts, channels, storage, environments, and permissions are governed.

This roadmap turns Agent-Space from a conceptual boundary into a production-grade product module.

## Product thesis

Every agent action must happen inside an explicit space.

A space is not just a folder, project, tenant, or chat room. A space is a governed operating boundary for work.

```txt
Space = Identity + Context + Files + Memory + Channels + Runs + Storage + Permissions + Lifecycle
```

Agent-Space should become the canonical workspace primitive for:

- individual workspaces
- team workspaces
- customer environments
- tenant boundaries
- project spaces
- production domains
- lab/sandbox environments
- demo/public spaces
- compliance review spaces
- archival spaces

## Strategic goals

1. Make every agent action explicitly scoped.
2. Prevent unbounded agent execution.
3. Attach files, memory, channels, runs, tools, storage, and permissions to a space.
4. Support local-first, cloud-native, and distributed storage backends.
5. Provide a clean product UX for creating, entering, operating, auditing, and retiring spaces.
6. Make Agent-Space interoperable with Agent-Platform, Agent-Identity, Agent-Drive, Agent-Memory, Agent-Runs, Agent-Team, Agent-Channel, and Agent-IGA.
7. Keep storage backend replaceable while making the space boundary authoritative.

## Product pillars

| Pillar | Outcome |
|---|---|
| Space Core | Canonical data model, lifecycle, APIs, events, and policies for spaces. |
| Space UX | Console workflows for creating, browsing, joining, configuring, and retiring spaces. |
| Space Context | Files, memory, channels, runs, tools, and artifacts attached to the space boundary. |
| Space Storage | Pluggable storage backends for object, file, volume, local-first, and distributed storage. |
| Space Governance | Permission scopes, policies, audit trails, retention, provenance, and lifecycle controls. |
| Space Runtime | Environment bindings, run scoping, tool execution boundaries, and worker limits. |
| Space Integrations | Hugging Face Spaces, Spacedrive, Spacebot, RustFS, CubeFS, and CNCF storage landscape references. |
| Space Operations | Observability, backups, upgrades, migration, release gates, and production readiness. |

## North-star user journeys

### 1. Create a governed workspace

A user creates a new space for a project, tenant, customer, lab, or production environment.

The product should capture:

- name
- purpose
- owner
- members
- agents
- environment type
- data classification
- default permissions
- storage policy
- retention policy
- allowed integrations
- lifecycle stage

### 2. Enter a space before work begins

Before an agent or human starts work, the system resolves the active space.

No run, tool call, memory read, file access, or artifact write should happen without a space ID.

### 3. Attach files and sources

The user attaches files, folders, drives, object buckets, repositories, or source systems.

Agent-Space records references, provenance, permissions, and data policies without forcing all data into one backend.

### 4. Run agents inside a space

Agents operate only against scoped files, memory, channels, tools, and environments.

Runs generate traces, outputs, artifacts, and audit records tied back to the space.

### 5. Review and govern work

Admins can inspect:

- who accessed the space
- which agents ran
- which tools were used
- what memory was read
- what files were touched
- which artifacts were created
- which policies were enforced
- what approvals were required

### 6. Archive or retire a space

When work ends, the space can be archived, exported, retained, legally held, or deleted according to lifecycle and retention policy.

## Canonical lifecycle

```txt
Draft
  ↓
Active
  ↓
Restricted
  ↓
Review
  ↓
Archived
  ↓
Retired
```

### Lifecycle definitions

| State | Meaning |
|---|---|
| Draft | Space exists but cannot run agents yet. |
| Active | Normal work is allowed. |
| Restricted | Work is limited due to policy, risk, cost, or ownership issue. |
| Review | Space is locked for audit, handoff, compliance, or approval. |
| Archived | Read-only historical state. |
| Retired | Space is closed and no longer available for active work. |

## Data model roadmap

### Space

```yaml
space:
  id: space:customer-acme
  name: Customer ACME Workspace
  type: customer | project | team | lab | production | demo | archive
  owner_id: user:owner
  status: draft | active | restricted | review | archived | retired
  classification: public | internal | confidential | restricted
  created_at: timestamp
  updated_at: timestamp
  lifecycle_policy_id: policy:space-lifecycle
```

### SpaceMember

```yaml
space_member:
  id: member:example
  space_id: space:customer-acme
  principal_id: user:chinmay | agent:researcher | team:platform
  role: owner | admin | operator | contributor | viewer | auditor
  status: active | suspended | removed
```

### SpaceSource

```yaml
space_source:
  id: source:example
  space_id: space:customer-acme
  type: file | folder | bucket | repository | device | cloud | database | url | external-system
  provider: local | github | spacedrive | rustfs | cubefs | s3 | gcs | azure | other
  reference: uri-or-provider-reference
  policy_id: policy:source-access
  provenance_required: true
```

### SpaceArtifact

```yaml
space_artifact:
  id: artifact:example
  space_id: space:customer-acme
  run_id: run:example
  type: report | dataset | model-output | trace | evidence | export | document
  storage_ref: s3://bucket/key | cubefs://volume/path | local://path
  provenance: required
  retention_class: draft | active | archive | legal-hold
```

### SpaceRun

```yaml
space_run:
  id: run:example
  space_id: space:customer-acme
  agent_id: agent:example
  objective: summarize-attached-documents
  status: queued | running | waiting-for-approval | succeeded | failed | cancelled
  tools_used: []
  artifacts_created: []
  audit_required: true
```

## API roadmap

### Phase 1 APIs

```txt
POST   /spaces
GET    /spaces
GET    /spaces/{space_id}
PATCH  /spaces/{space_id}
POST   /spaces/{space_id}/members
GET    /spaces/{space_id}/members
POST   /spaces/{space_id}/sources
GET    /spaces/{space_id}/sources
POST   /spaces/{space_id}/runs
GET    /spaces/{space_id}/runs
GET    /spaces/{space_id}/artifacts
POST   /spaces/{space_id}/archive
POST   /spaces/{space_id}/retire
```

### Phase 2 APIs

```txt
POST   /spaces/{space_id}/policies
GET    /spaces/{space_id}/audit
GET    /spaces/{space_id}/memory
POST   /spaces/{space_id}/storage-bindings
GET    /spaces/{space_id}/storage-bindings
POST   /spaces/{space_id}/exports
POST   /spaces/{space_id}/handoff
POST   /spaces/{space_id}/review-lock
POST   /spaces/{space_id}/approval-gates
```

### Phase 3 APIs

```txt
POST   /spaces/{space_id}/federation
POST   /spaces/{space_id}/replication
POST   /spaces/{space_id}/legal-hold
POST   /spaces/{space_id}/cost-policy
GET    /spaces/{space_id}/risk-score
GET    /spaces/{space_id}/trust-score
GET    /spaces/{space_id}/lineage
```

## Storage roadmap

The CNCF Landscape classifies cloud-native storage under Runtime → Cloud Native Storage. Agent-Space should use that ecosystem as the reference map while keeping the space boundary independent from any single backend.

Reference: https://landscape.cncf.io/?view-mode=card&classify=category&sort-by=name&sort-direction=asc#runtime--cloud-native-storage

### Storage principle

```txt
Storage backend is replaceable.
Space boundary is authoritative.
```

### Storage classes

| Class | Purpose | Candidate systems |
|---|---|---|
| Local-first surface | Personal/team file discovery across devices and sources. | Spacedrive-style adapter |
| Object storage | Artifacts, datasets, traces, evidence, exports. | RustFS, S3-compatible stores |
| Distributed multi-protocol storage | S3, POSIX, HDFS, CSI, large datasets, shared workspaces. | CubeFS |
| Kubernetes volume storage | Stateful workloads and mounted runtime volumes. | CSI-compatible backends |
| Archive storage | Long-term retention and compliance records. | S3-compatible object lock/WORM backends |
| Demo/public storage | Demo-safe datasets and public artifacts. | Hugging Face Spaces assets, static storage |

### Storage milestones

| Milestone | Description |
|---|---|
| S0 | Define storage binding contract. |
| S1 | Add object storage adapter interface. |
| S2 | Add local filesystem development adapter. |
| S3 | Add RustFS/S3-compatible artifact backend. |
| S4 | Add CubeFS reference deployment profile. |
| S5 | Add storage policy engine for classification, retention, and access. |
| S6 | Add storage audit events for reads, writes, deletes, exports, and retention changes. |
| S7 | Add backup, restore, migration, and archive workflows. |

## Integration roadmap

### Hugging Face Spaces

Role: public ML/agent demo surface.

Milestones:

- publish demo-safe Gradio Space
- add Docker Space template
- add static HTML Space template
- add GitHub Actions sync workflow
- require `agent_space` metadata for every Space
- prevent production secrets and production data from public demos

### Spacedrive

Role: local-first file/device/cloud/source discovery reference.

Milestones:

- define source adapter contract
- define file identity and content hash model
- add provenance model for local-first references
- support offline source state
- map source references into space context

### Spacebot

Role: team-agent operating model.

Milestones:

- define channel model
- define worker model
- define branch model
- define cron/scheduled work model
- attach model routing policy to space
- attach memory graph access to space

### RustFS

Role: S3-compatible object backend.

Milestones:

- define bucket naming convention
- define artifact metadata headers
- support object versioning
- support retention classes
- support WORM/object lock for evidence
- integrate with audit events

### CubeFS

Role: multi-protocol distributed storage substrate.

Milestones:

- define CubeFS deployment profile
- map volumes to space boundaries
- define S3/POSIX/HDFS/CSI access patterns
- define tenant isolation strategy
- add workload-specific storage classes

## Product phases

## Phase 0 — Foundation

Goal: make Agent-Space understandable, installable, and coherent.

Deliverables:

- README with boundary definition
- reference docs for Hugging Face Spaces, Spacedrive, Spacebot, RustFS, CubeFS, and CNCF storage
- initial roadmap
- initial architecture diagram text
- product vocabulary
- storage principle
- lifecycle states
- API surface draft

Exit criteria:

- a new contributor can understand what Agent-Space owns
- docs explain what it does not own
- integration references are mapped to product roles

## Phase 1 — Core Workspace Primitive

Goal: implement the core space model.

Deliverables:

- `Space` schema
- `SpaceMember` schema
- `SpaceSource` schema
- `SpaceArtifact` schema
- `SpaceRun` reference schema
- lifecycle transitions
- default role model
- deny-by-default permission model
- basic CRUD APIs
- audit event model

Exit criteria:

- a space can be created, updated, listed, archived, and retired
- members can be added and removed
- sources can be attached
- every run requires a space ID

## Phase 2 — Space Console UX

Goal: make spaces usable from a product interface.

Deliverables:

- space list page
- create space wizard
- space overview page
- members tab
- sources tab
- runs tab
- artifacts tab
- policies tab
- audit tab
- lifecycle actions
- empty states and onboarding copy

Exit criteria:

- user can create a space without reading docs
- user can see what belongs to a space
- user can understand risk, ownership, and lifecycle state

## Phase 3 — Context and Source Attachments

Goal: attach real context safely.

Deliverables:

- file/source attachment model
- source adapter interface
- local filesystem dev adapter
- GitHub source reference adapter
- Spacedrive-style source reference contract
- provenance metadata
- offline/unavailable source state
- content hash model
- source permission checks

Exit criteria:

- a space can attach external sources without copying everything
- agents can only access approved sources
- provenance is preserved

## Phase 4 — Storage Backends

Goal: make Agent-Space storage-backend-agnostic.

Deliverables:

- storage binding contract
- local dev storage adapter
- S3-compatible object storage adapter
- RustFS reference profile
- CubeFS reference profile
- artifact registry
- retention policy model
- storage audit events
- export bundle format

Exit criteria:

- artifacts can be stored in object storage
- storage backend can be changed without changing the space model
- every stored object carries space metadata

## Phase 5 — Agent Runtime Boundary

Goal: enforce space scope at runtime.

Deliverables:

- run creation requires space ID
- tool calls require active space
- memory reads require active space
- file reads/writes require active space
- worker scopes
- branch scopes
- scheduled work scopes
- approval gates
- runtime audit traces

Exit criteria:

- no agent run can execute outside a space
- every tool call can be traced to a space
- scheduled jobs are governed by space policy

## Phase 6 — Governance and Compliance

Goal: make spaces enterprise-governable.

Deliverables:

- OPA policy hooks
- OpenFGA/ReBAC relationship model
- retention policies
- legal hold
- review lock
- approval workflows
- audit export
- compliance evidence artifacts
- risk score
- trust score
- policy violation events

Exit criteria:

- admins can prove what happened in a space
- restricted spaces cannot perform unsafe actions
- compliance artifacts can be exported

## Phase 7 — Public Demo and Marketplace Surfaces

Goal: support safe public demos and reusable space templates.

Deliverables:

- Hugging Face Spaces demo template
- Gradio demo template
- Docker Space template
- static Space template
- public demo data policy
- no-secret publication checks
- demo metadata contract
- space template registry
- template install workflow

Exit criteria:

- AGenNext can publish public agent demos safely
- demos map back to governed Agent-Space metadata
- templates can be reused across teams

## Phase 8 — Production Operations

Goal: make Agent-Space production-ready.

Deliverables:

- deployment manifests
- Helm/Kustomize profile
- Kubernetes readiness and liveness probes
- backup/restore guide
- migration guide
- observability dashboard
- audit log retention
- disaster recovery plan
- security hardening checklist
- release checklist

Exit criteria:

- Agent-Space can be deployed and operated reliably
- upgrades are documented
- storage migration and recovery are tested

## MVP scope

The MVP should be production-shaped but narrow.

Must include:

- create/list/read/update/archive spaces
- members and roles
- sources
- artifacts
- run scoping
- local dev storage
- S3-compatible storage interface
- audit events
- lifecycle states
- README/docs
- basic console screens

Should not include yet:

- full federation
- marketplace
- advanced legal hold
- multi-region replication
- complex storage migration
- full compliance automation

## Release plan

| Release | Name | Focus |
|---|---|---|
| v0.1 | Space Contract | Schemas, lifecycle, docs, API draft. |
| v0.2 | Space Core | CRUD APIs, members, sources, run scoping. |
| v0.3 | Space Console | Product UI for spaces, members, sources, runs, artifacts. |
| v0.4 | Space Storage | S3-compatible adapter, RustFS profile, artifact registry. |
| v0.5 | Space Governance | OPA/OpenFGA hooks, audit, approvals, retention. |
| v0.6 | Space Runtime | Workers, branches, cron, memory/tool/file access enforcement. |
| v0.7 | Space Demos | Hugging Face Spaces templates and safe demo workflows. |
| v0.8 | Space Scale | CubeFS profile, backup/restore, migration, large datasets. |
| v1.0 | Production Space | Hardened release with docs, tests, policies, operations, and security gates. |

## Engineering backlog

### Backend

- implement space schemas
- implement lifecycle transitions
- implement REST APIs
- implement event model
- implement audit log
- implement storage binding abstraction
- implement local storage adapter
- implement S3-compatible adapter
- implement artifact registry
- implement run scope validation
- implement source attachment validation

### Frontend

- create space wizard
- space overview page
- member management
- source attachment UI
- artifact browser
- run history
- audit timeline
- policy summary
- lifecycle controls
- storage binding configuration

### Governance

- define role model
- define OpenFGA tuples
- define OPA policies
- add deny-by-default checks
- add approval gate model
- add retention policy model
- add export/audit evidence format

### Integrations

- Hugging Face Spaces templates
- Spacedrive-style source adapter contract
- Spacebot-style channel/worker/branch model
- RustFS deployment notes
- CubeFS deployment notes
- CNCF storage landscape mapping

### Operations

- Dockerfile
- Kubernetes manifests
- Helm or Kustomize profile
- health checks
- metrics
- logs
- backup/restore
- CI checks
- release workflow
- security checklist

## Product metrics

| Metric | Meaning |
|---|---|
| Spaces created | Adoption of workspace primitive. |
| Runs with space ID | Runtime scoping coverage. |
| Unscoped run attempts blocked | Governance effectiveness. |
| Sources attached per space | Context richness. |
| Artifacts created per space | Work output. |
| Policy violations blocked | Safety and compliance. |
| Audit exports generated | Enterprise readiness. |
| Archived/retired spaces | Lifecycle hygiene. |
| Storage backend diversity | Portability. |
| Demo spaces published | External showcase readiness. |

## Non-goals

Agent-Space should not become:

- the identity provider
- the final policy engine
- the only file storage system
- the only runtime executor
- the memory database
- the model router
- the chat application
- the deployment engine

Agent-Space coordinates boundaries. Other modules execute their own responsibilities inside those boundaries.

## Architecture direction

```txt
User / Agent / Team
  ↓
Agent-Channel / Console / API
  ↓
Agent-Space
  ↓
Members + Sources + Memory Scope + Run Scope + Artifact Scope + Storage Binding
  ↓
Agent-IGA + OPA + OpenFGA + Audit
  ↓
Agent-Platform
  ↓
Runtime / Storage / Memory / Tools / Integrations
```

## Production readiness checklist

- [ ] Every run requires `space_id`
- [ ] Every artifact includes `space_id`
- [ ] Every source includes provenance
- [ ] Every member has a role
- [ ] Every lifecycle transition is audited
- [ ] Every storage binding has a policy
- [ ] Every public demo space is marked as demo-safe
- [ ] Every tool call is scoped
- [ ] Every memory read is scoped
- [ ] Every file read/write is scoped
- [ ] Every export is audited
- [ ] Every archived space is read-only
- [ ] Every retired space has a recovery or deletion policy

## Final product promise

Agent-Space makes agentic work safe to locate, govern, operate, inspect, and retire.

It gives AGenNext a simple but powerful rule:

```txt
No space, no work.
```
