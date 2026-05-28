# Entities

## Definition

An entity is any uniquely identifiable object, actor, resource, or concept that Agent-Space can reference, relate, govern, audit, or act upon.

Entities are the common identity layer underneath Agent-Space.

```txt
If Agent-Space needs to reference it, relate it, permission it, audit it, or attach context to it, it should be modeled as an entity or entity reference.
```

## Why entities matter

Agent-Space brings together many kinds of things:

- humans
- agents
- spaces
- projects
- tasks
- files
- artifacts
- plugins
- tools
- environments
- workflows
- automations
- runs
- approvals
- channels
- messages
- external systems

Without a common entity model, every object type needs its own custom relationship, permission, audit, and reference logic.

The entity model provides a shared foundation.

## Entity vs object

An object is a domain-specific record.

An entity is the identity and reference abstraction that allows that object to participate in the wider Agent-Space graph.

```txt
Object = the specific domain record
Entity = the common identity wrapper/reference
```

Example:

```txt
Task object: title, description, status, assignee, due date
Entity: id, type, space scope, owner, lifecycle, references, permissions
```

## Entity vs actor

An actor is an entity that can perform actions.

Actors include:

- humans
- agents
- services
- workflows
- automations

Not all entities are actors.

Examples:

```txt
Human = entity + actor
Agent = entity + actor
File = entity, not usually actor
Artifact = entity, not usually actor
Automation = entity + actor when it executes
```

## Entity categories

Recommended high-level categories:

```txt
actor
workspace
work
content
execution
integration
governance
communication
external
system
```

## Entity types

```ts
export type EntityType =
  | 'human'
  | 'agent'
  | 'service_account'
  | 'space'
  | 'project'
  | 'task'
  | 'file'
  | 'artifact'
  | 'channel'
  | 'message'
  | 'plugin'
  | 'tool'
  | 'extension'
  | 'environment'
  | 'workflow'
  | 'automation'
  | 'run'
  | 'approval'
  | 'decision'
  | 'permission_scope'
  | 'memory_scope'
  | 'external_ref'
  | 'system';
```

## Entity reference

Most Agent-Space models should use lightweight entity references rather than embedding full objects.

```ts
export interface EntityRef {
  id: string;
  type: EntityType;
  displayName?: string;
  spaceId?: string;
  externalRef?: ExternalRef;
}
```

## Base entity model

```ts
export interface BaseEntity {
  id: string;
  type: EntityType;
  displayName: string;
  description?: string;

  spaceId?: string;
  projectId?: string;

  status: EntityStatus;
  visibility: EntityVisibility;

  createdBy: EntityRef;
  owner?: EntityRef;

  metadata?: Record<string, unknown>;

  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export type EntityStatus =
  | 'active'
  | 'inactive'
  | 'draft'
  | 'archived'
  | 'deleted';

export type EntityVisibility =
  | 'private'
  | 'space'
  | 'project'
  | 'organization'
  | 'public';
```

## Actor reference

```ts
export interface ActorRef extends EntityRef {
  type: 'human' | 'agent' | 'service_account' | 'workflow' | 'automation' | 'system';
}
```

## External reference

External systems should be referenced through external refs instead of being absorbed into Agent-Space.

```ts
export interface ExternalRef {
  provider: string;
  type: string;
  id?: string;
  url?: string;
  displayName?: string;
  metadata?: Record<string, unknown>;
}
```

Examples:

```json
{
  "provider": "github",
  "type": "pull_request",
  "id": "42",
  "url": "https://github.com/org/repo/pull/42"
}
```

```json
{
  "provider": "eclipse-che",
  "type": "workspace",
  "id": "workspace_abc",
  "url": "https://che.example.com/workspace/abc"
}
```

## Entity relationships

Entities should be connected through typed relationships.

```ts
export interface EntityRelationship {
  id: string;
  source: EntityRef;
  target: EntityRef;
  type: EntityRelationshipType;
  createdBy: EntityRef;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type EntityRelationshipType =
  | 'contains'
  | 'belongs_to'
  | 'assigned_to'
  | 'created_by'
  | 'owned_by'
  | 'depends_on'
  | 'blocks'
  | 'references'
  | 'produced_by'
  | 'derived_from'
  | 'supersedes'
  | 'reviews'
  | 'approves'
  | 'uses'
  | 'executes'
  | 'triggers'
  | 'attached_to'
  | 'mentions'
  | 'linked_to';
```

## Example relationships

```txt
space contains project
project contains task
task assigned_to agent
run produced_by agent
artifact produced_by run
artifact derived_from file
workflow uses tool
automation triggers workflow
message mentions human
approval approves artifact
```

## Entity graph

The entity model allows Agent-Space to build a graph of work context.

Example:

```txt
Space: agent-platform-dev
  contains Project: auth-service
    contains Task: fix failing auth tests
      assigned_to Agent: engineering-agent
      uses Tool: github.create_branch
      uses Environment: eclipse-che workspace
      produces Artifact: Pull Request #42
      requires Approval: human review
```

## Entity provenance

Important entities should have provenance.

Minimum provenance should include:

```txt
created_by
created_at
source_entity_refs
related_run_ids
related_tool_call_ids
approval_history
version_history
external_refs
```

## Permission implications

Permissions can be attached to entities or entity relationships.

Examples:

- human can view project
- agent can read file
- workflow can execute tool
- automation can create task
- task can use environment
- project can access memory scope

## Product principle

Entities are the shared identity fabric of Agent-Space.

They make it possible for humans, agents, files, tasks, projects, tools, workflows, artifacts, and external systems to participate in one coherent collaboration graph.
