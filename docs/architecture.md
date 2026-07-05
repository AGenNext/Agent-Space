# Agent-Space Architecture

Agent-Space is the governed workspace boundary for AGenNext.

It does not replace identity, storage, runtime, memory, or policy engines. It binds them into a coherent operating context.

## Core rule

```txt
No space, no work.
```

Every agent run, memory read, file access, storage write, tool call, artifact creation, channel action, and scheduled task must resolve to an explicit `space_id`.

## Architecture position

```txt
User / Agent / Team
  ↓
Console / API / Channel
  ↓
Agent-Space
  ↓
Members + Sources + Storage Bindings + Artifacts + Run Scope + Lifecycle
  ↓
Agent-IGA + OPA + OpenFGA + Audit
  ↓
Agent-Platform
  ↓
Runtime / Memory / Storage / Tools / Integrations
```

## What Agent-Space owns

Agent-Space owns the boundary contract:

- space identity
- workspace type
- lifecycle state
- classification
- membership references
- source references
- artifact references
- storage binding references
- run scope references
- permission scope references
- audit hooks
- lifecycle policy references

## What Agent-Space does not own

Agent-Space does not own:

- identity verification
- final authorization decision engine
- runtime execution
- tool implementation
- memory backend implementation
- object/file storage implementation
- deployment execution
- model routing

It coordinates and scopes these capabilities.

## Control-plane flow

```txt
1. User or agent requests work.
2. Agent-Space resolves active space.
3. Agent-IGA checks membership and role.
4. OPA evaluates policy.
5. OpenFGA evaluates relationships.
6. Agent-Platform approves, rejects, or requests human review.
7. Runtime executes only inside the approved space scope.
8. Artifacts, traces, and audit events are written back to the space.
```

## Data-plane flow

```txt
Attached sources
  ↓
Source references + provenance
  ↓
Space-scoped access policy
  ↓
Runtime reads allowed context
  ↓
Artifacts written through storage binding
  ↓
Audit + lifecycle metadata recorded
```

## Storage rule

```txt
Storage backend is replaceable.
Space boundary is authoritative.
```

Agent-Space supports multiple storage patterns:

- local development storage
- S3-compatible object storage
- RustFS-backed object storage
- CubeFS-backed multi-protocol distributed storage
- Kubernetes CSI volume storage
- public demo assets for Hugging Face Spaces
- local-first source surfaces inspired by Spacedrive

Storage systems provide durability and protocols. Agent-Space provides governance, identity, lifecycle, and audit.

## Runtime rule

Agent runs must carry:

```yaml
run_scope:
  space_id: space:example
  agent_id: agent:example
  member_or_service_account: user:example
  allowed_sources: []
  allowed_tools: []
  allowed_storage_bindings: []
  approval_policy: policy:example
```

A runtime that cannot provide `space_id` should be rejected before execution.

## Lifecycle rule

Space lifecycle controls behavior:

| State | Behavior |
|---|---|
| Draft | Metadata may be edited. Agent runs blocked. |
| Active | Normal governed work allowed. |
| Restricted | Only approved or reduced-risk operations allowed. |
| Review | Write operations blocked except audit/review annotations. |
| Archived | Read-only historical access. |
| Retired | Closed boundary; access only by recovery/deletion policy. |

## Security defaults

- deny by default
- no unscoped runs
- no storage attachment without policy
- no public demo with production data
- no agent access to raw secrets
- audit lifecycle transitions
- audit file/source/artifact access
- preserve provenance

## Integration positions

| Integration | Position |
|---|---|
| Hugging Face Spaces | Public demo surface mapped to an Agent-Space. |
| Spacedrive | Local-first file/source discovery reference. |
| Spacebot | Team-agent operating reference for channels, workers, branches, memory, and cron. |
| RustFS | S3-compatible object storage backend candidate. |
| CubeFS | Distributed multi-protocol storage backend candidate. |
| CNCF Cloud Native Storage | Ecosystem selection map for runtime storage. |

## Production architecture target

```txt
API Gateway / Console
  ↓
Agent-Space Service
  ↓
SurrealDB or platform metadata store
  ↓
Policy hooks: OPA + OpenFGA + Agent-IGA
  ↓
Storage adapters: local, S3, RustFS, CubeFS
  ↓
Runtime adapters: Agent-Runs, workers, scheduled jobs
  ↓
Audit stream + observability
```

## Architecture promise

Agent-Space makes agentic work locatable, governable, auditable, and retireable.

It is the product boundary that turns scattered context into a safe operating space.