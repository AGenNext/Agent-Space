# Eclipse Che Plugin

## Decision

Eclipse Che should be integrated as an optional Agent-Space plugin, not as the core Agent-Space runtime.

Agent-Space owns the workspace/context boundary. Eclipse Che can provide one implementation of a development environment attached to that boundary.

## Why Che is useful

Eclipse Che is useful for engineering-oriented spaces where humans and agents need a shared, browser-accessible, containerized development workspace.

It can help provide:

- cloud development environments
- repo-based workspaces
- devfile-driven workspace definitions
- browser IDE access
- terminal access
- containerized tooling
- reproducible project environments
- safer agent execution boundaries for coding tasks

## Plugin role

Che should act as an `environment` plugin.

```txt
Agent-Space
  owns: space, project, member, agent, file, channel, permission, run, environment references

Eclipse Che Plugin
  owns: developer workspace provisioning and lifecycle through Che
```

## Boundary

| Layer | Responsibility |
|---|---|
| Agent-Space | Defines the space, project, agent, task, permissions, and environment reference |
| Agent-Platform | Governs whether an agent or human may create/use the environment |
| Agent-Runs | Records execution activity and links work to the space |
| Agent-Drive | Stores or references artifacts produced by the workspace |
| Eclipse Che Plugin | Creates, starts, stops, and links Che workspaces |
| Eclipse Che | Provides the actual browser-based developer environment |

## Core use case

A human creates a coding task inside Agent-Space and assigns it to an engineering agent.

```txt
Task: Fix failing authentication tests
Space: agent-platform-dev
Project: auth-service
Assignee: engineering-agent
Environment: eclipse-che
Repo: github.com/org/auth-service
```

Agent-Space resolves the space boundary, permissions, files, channels, memory scope, and run scope.

The Eclipse Che plugin provisions or attaches a Che workspace for that repo.

The engineering agent can then work inside a controlled development environment, while Agent-Space tracks the task, chat, files, decisions, run logs, and approvals.

## Example lifecycle

```txt
1. User creates or opens a task
2. User or agent requests a development environment
3. Agent-Space checks permissions and policy
4. Eclipse Che plugin creates or reuses a Che workspace
5. Che returns workspace URL and status
6. Agent-Space stores environment reference
7. Human or agent opens the workspace
8. Work happens in the Che environment
9. Agent-Runs records activity
10. Outputs are linked back to task, files, branches, commits, or PRs
```

## Environment reference model

```json
{
  "id": "env_123",
  "space_id": "space_agent_platform_dev",
  "project_id": "project_auth_service",
  "task_id": "task_fix_auth_tests",
  "type": "eclipse_che",
  "provider": "che",
  "status": "running",
  "workspace_url": "https://che.example.com/workspace/abc",
  "repo_url": "https://github.com/org/auth-service",
  "branch": "agent/task-fix-auth-tests",
  "devfile_ref": "./devfile.yaml",
  "created_by": "user_123",
  "assigned_agent_id": "agent_engineering",
  "permissions_scope_id": "perm_scope_456",
  "run_scope_id": "run_scope_789"
}
```

## Suggested plugin contract

```ts
export interface EnvironmentPlugin {
  id: string;
  type: string;

  createEnvironment(input: CreateEnvironmentInput): Promise<EnvironmentRef>;
  getEnvironment(id: string): Promise<EnvironmentRef>;
  startEnvironment(id: string): Promise<EnvironmentRef>;
  stopEnvironment(id: string): Promise<EnvironmentRef>;
  deleteEnvironment(id: string): Promise<void>;
}

export interface CreateEnvironmentInput {
  spaceId: string;
  projectId?: string;
  taskId?: string;
  repoUrl?: string;
  branch?: string;
  devfileRef?: string;
  requestedBy: string;
  assignedAgentId?: string;
  permissionScopeId: string;
}
```

## Agent permission rules

Agents should not receive unrestricted workspace access by default.

Recommended controls:

- require an explicit space
- require an explicit task or run scope
- restrict repo access by permission scope
- create task-specific branches
- require approval before pushing to protected branches
- require approval before opening or merging PRs
- record files accessed and commands executed when possible
- stop or revoke workspaces when the task is complete

## Devfile strategy

Che works well with devfiles. Agent-Space can treat devfiles as reusable environment templates.

Example mapping:

```txt
Space template: engineering-node-service
Environment provider: eclipse-che
Devfile: .agent-space/devfiles/node-service.yaml
Allowed agents:
  - engineering-agent
  - qa-agent
Commands:
  - install
  - test
  - lint
  - build
```

## MVP integration

For the first Che plugin milestone, implement:

- register Che as an environment provider
- create environment reference in Agent-Space
- launch Che workspace from repo/devfile
- display workspace URL on task/project page
- start/stop workspace
- link workspace to task and run scope
- log lifecycle events

Do not make Che a hard dependency for Agent-Space.

## Product principle

Agent-Space should remain runtime-agnostic.

Eclipse Che is one environment provider among many.

Other future environment providers may include:

- local container runtime
- remote VM
- browser automation sandbox
- data analysis notebook
- document editing workspace
- custom enterprise execution environment
