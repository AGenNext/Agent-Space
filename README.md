# Agent-Space

Agent-Space owns bounded workspaces for AGenNext agents, humans, files, memory, channels, runs, permissions, and environments.

## Decision

Agent-Space defines the workspace/context boundary where agent work happens.

A space can represent a tenant, project, team, customer environment, operational workspace, or managed infrastructure domain.

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
