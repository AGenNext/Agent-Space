# Governance, Identity, Access, Authorization, Permissions, Usage Policy, and Taxonomies

## Decision

Agent-Space needs a formal governance layer because agents, humans, tools, files, artifacts, workflows, and external systems collaborate inside shared professional spaces.

The governance layer defines:

- taxonomies
- acceptable values
- identity
- access
- authorization
- permissions
- usage policies
- governance framework
- audit requirements

```txt
Taxonomies define allowed language.
Identity defines who or what something is.
Access defines what can be reached.
Authorization decides whether an action is allowed.
Permissions express grants and restrictions.
Usage policies define acceptable behavior.
Governance supervises the whole system.
```

## 1. Taxonomies

A taxonomy is a controlled classification system for Agent-Space concepts.

Taxonomies keep the platform consistent by defining acceptable values for core concepts.

Examples:

- entity types
- actor types
- artifact types
- tool risk levels
- permission actions
- access levels
- workflow statuses
- approval statuses
- visibility levels
- knowledge types
- skill levels
- environment types
- policy categories

## 2. Acceptable values

Acceptable values are the allowed enum-like values inside a taxonomy.

They prevent ambiguity, inconsistent labels, and unsafe free-form permissions.

Example:

```ts
export type ToolRiskLevel =
  | 'read'
  | 'write'
  | 'execute'
  | 'external_side_effect';
```

The platform should allow extension through custom values, but only through governed taxonomy registration.

## 3. Identity

Identity defines who or what an actor or entity is.

Identity applies to:

- humans
- agents
- service accounts
- workflows
- automations
- organizations
- spaces
- plugins
- tools
- external systems

Identity should answer:

- Who is this?
- What is this?
- Is it verified?
- What entity does it map to?
- What external identities are linked?
- What authentication method was used?
- What actor is acting now?
- Is an agent acting on behalf of a human?

## 4. Access

Access defines whether an entity can reach, view, use, or interact with another entity, resource, context, or system.

Access is about reachability.

Examples:

- human can access a space
- agent can access a project
- agent can read a file
- workflow can use a tool
- plugin can reach an external API
- environment can access a repository

## 5. Authorization

Authorization is the decision process that determines whether a requested action is allowed.

Authorization evaluates:

- actor identity
- target entity
- action
- permission grants
- policy rules
- risk level
- context
- space scope
- project scope
- task scope
- approval requirements
- time, environment, and data constraints

```txt
Access = can reach it?
Authorization = can perform this action now?
```

## 6. Permissions

Permissions are explicit grants or restrictions that allow or deny actions on entities.

A permission should include:

- subject
- action
- resource
- scope
- effect
- conditions
- expiration
- source

Example:

```txt
Engineering Agent may read repository files in project auth-service within space agent-platform-dev.
```

## 7. Usage policy

Usage policy defines acceptable and prohibited behavior.

Usage policies apply to:

- humans
- agents
- workflows
- automations
- tools
- plugins
- environments
- files
- artifacts
- external systems

Examples:

- agents may not deploy to production without human approval
- agents may not email customers without approval
- agents may not access confidential files unless explicitly granted
- tools with external side effects require approval by default
- agents may only operate inside explicit spaces
- generated customer-facing artifacts require review before publication
- sensitive data cannot be sent to unapproved external providers

## 8. Governance framework

Governance is the system of rules, roles, policies, reviews, audit trails, and enforcement mechanisms that keep Agent-Space safe, accountable, compliant, and professionally usable.

Governance includes:

- taxonomy management
- identity lifecycle
- role management
- access control
- authorization decisions
- policy enforcement
- approval workflows
- audit logging
- risk classification
- compliance reporting
- exception management
- human oversight

## Recommended governance stack

```txt
Taxonomy Registry
  defines acceptable values

Identity Registry
  maps humans, agents, services, and external identities

Access Control
  defines reachability

Authorization Engine
  evaluates action requests

Permission Model
  stores grants, denies, roles, and scopes

Policy Engine
  evaluates usage rules and constraints

Approval System
  handles human decision gates

Audit Log
  records what happened and why

Governance Console
  lets admins inspect and change governance state
```

## Taxonomy model

```ts
export interface Taxonomy {
  id: string;
  name: string;
  description?: string;
  domain: TaxonomyDomain;
  values: TaxonomyValue[];
  status: TaxonomyStatus;
  version: string;
  managedBy: EntityRef;
  createdAt: string;
  updatedAt: string;
}

export interface TaxonomyValue {
  id: string;
  key: string;
  label: string;
  description?: string;
  status: TaxonomyValueStatus;
  metadata?: Record<string, unknown>;
}

export type TaxonomyDomain =
  | 'entity_type'
  | 'actor_type'
  | 'artifact_type'
  | 'tool_type'
  | 'tool_risk_level'
  | 'plugin_type'
  | 'environment_type'
  | 'workflow_status'
  | 'run_status'
  | 'approval_status'
  | 'permission_action'
  | 'access_level'
  | 'visibility_level'
  | 'knowledge_type'
  | 'skill_category'
  | 'policy_category'
  | 'custom';

export type TaxonomyStatus = 'draft' | 'active' | 'deprecated' | 'archived';
export type TaxonomyValueStatus = 'active' | 'deprecated' | 'disabled';
```

## Initial acceptable values

### Access levels

```ts
export type AccessLevel =
  | 'none'
  | 'discover'
  | 'view'
  | 'comment'
  | 'use'
  | 'edit'
  | 'execute'
  | 'approve'
  | 'admin'
  | 'owner';
```

### Permission actions

```ts
export type PermissionAction =
  | 'discover'
  | 'view'
  | 'read'
  | 'comment'
  | 'create'
  | 'update'
  | 'delete'
  | 'use'
  | 'execute'
  | 'approve'
  | 'reject'
  | 'share'
  | 'invite'
  | 'assign'
  | 'configure'
  | 'administer';
```

### Permission effects

```ts
export type PermissionEffect = 'allow' | 'deny';
```

### Identity assurance levels

```ts
export type IdentityAssuranceLevel =
  | 'unknown'
  | 'self_asserted'
  | 'verified_email'
  | 'sso_verified'
  | 'admin_verified'
  | 'service_verified';
```

### Policy enforcement modes

```ts
export type PolicyEnforcementMode =
  | 'advisory'
  | 'warn'
  | 'require_approval'
  | 'block'
  | 'audit_only';
```

## Identity model

```ts
export interface Identity {
  id: string;
  entityRef: EntityRef;
  identityType: IdentityType;
  displayName: string;
  assuranceLevel: IdentityAssuranceLevel;
  externalIdentities?: ExternalIdentity[];
  status: IdentityStatus;
  createdAt: string;
  updatedAt: string;
}

export type IdentityType =
  | 'human'
  | 'agent'
  | 'service_account'
  | 'workflow'
  | 'automation'
  | 'system'
  | 'external';

export type IdentityStatus =
  | 'active'
  | 'suspended'
  | 'revoked'
  | 'archived';

export interface ExternalIdentity {
  provider: string;
  subject: string;
  email?: string;
  username?: string;
  externalRef?: ExternalRef;
  verified: boolean;
}
```

## Actor session model

An actor session records who or what is acting right now.

```ts
export interface ActorSession {
  id: string;
  actor: ActorRef;
  actingOnBehalfOf?: ActorRef;
  spaceId?: string;
  projectId?: string;
  taskId?: string;
  authenticationMethod: string;
  assuranceLevel: IdentityAssuranceLevel;
  startedAt: string;
  expiresAt?: string;
}
```

## Permission model

```ts
export interface PermissionGrant {
  id: string;
  subject: EntityRef;
  action: PermissionAction;
  resource: EntityRef;
  scope?: PermissionScope;
  effect: PermissionEffect;
  conditions?: PermissionCondition[];
  source: PermissionSource;
  createdBy: EntityRef;
  createdAt: string;
  expiresAt?: string;
}

export interface PermissionScope {
  spaceId?: string;
  projectId?: string;
  taskId?: string;
  environmentId?: string;
  pluginId?: string;
  toolId?: string;
}

export interface PermissionCondition {
  type: string;
  value: unknown;
}

export type PermissionSource =
  | 'direct_grant'
  | 'role'
  | 'team'
  | 'workflow'
  | 'policy'
  | 'temporary_elevation'
  | 'system_default';
```

## Authorization request model

```ts
export interface AuthorizationRequest {
  actor: ActorRef;
  actingOnBehalfOf?: ActorRef;
  action: PermissionAction;
  resource: EntityRef;
  spaceId?: string;
  projectId?: string;
  taskId?: string;
  toolId?: string;
  riskLevel?: ToolRiskLevel;
  context?: Record<string, unknown>;
}

export interface AuthorizationDecision {
  requestId: string;
  decision: 'allow' | 'deny' | 'requires_approval';
  reason: string;
  matchedPermissions?: PermissionGrant[];
  matchedPolicies?: UsagePolicy[];
  requiredApprovals?: ApprovalRequirement[];
  decidedAt: string;
}
```

## Usage policy model

```ts
export interface UsagePolicy {
  id: string;
  name: string;
  description?: string;
  category: PolicyCategory;
  scope: PolicyScope;
  appliesTo: EntityRef[];
  condition: PolicyCondition;
  enforcementMode: PolicyEnforcementMode;
  status: PolicyStatus;
  createdBy: EntityRef;
  createdAt: string;
  updatedAt: string;
}

export type PolicyCategory =
  | 'data_access'
  | 'tool_usage'
  | 'external_side_effect'
  | 'human_approval'
  | 'security'
  | 'privacy'
  | 'compliance'
  | 'cost_control'
  | 'environment_usage'
  | 'artifact_publication'
  | 'custom';

export interface PolicyScope {
  organizationId?: string;
  spaceId?: string;
  projectId?: string;
  pluginId?: string;
  toolId?: string;
}

export interface PolicyCondition {
  expression: string;
  description?: string;
}

export type PolicyStatus = 'draft' | 'active' | 'paused' | 'archived';
```

## Approval requirement model

```ts
export interface ApprovalRequirement {
  id: string;
  requiredApproverType: 'human' | 'role' | 'team' | 'owner' | 'admin';
  requiredApproverRef?: EntityRef;
  reason: string;
  expiresAt?: string;
}
```

## Governance roles

Suggested default roles:

```txt
Owner
Admin
Space Admin
Project Lead
Member
Reviewer
Approver
Agent Operator
Agent Observer
External Collaborator
Auditor
```

## Role examples

### Owner

Can administer organization-level settings, policies, billing, identity, and governance.

### Space Admin

Can manage a specific space, members, agents, permissions, plugins, and policies within that space.

### Project Lead

Can manage project tasks, artifacts, project workflows, and project members.

### Approver

Can approve high-impact actions, artifacts, workflow gates, or external side effects.

### Agent Operator

Can configure, assign, and supervise agents within allowed scopes.

### Auditor

Can inspect activity, runs, authorization decisions, approvals, and policy history without changing work.

## Default governance rules

Recommended defaults:

1. Agents must operate inside an explicit space.
2. Tool calls must be scoped to a space, task, project, or run.
3. External side effects require human approval by default.
4. Deleting files or artifacts requires elevated permission.
5. Deployments require approval unless explicitly exempted.
6. Customer-facing artifacts require review before publication.
7. Sensitive data access must be explicitly granted.
8. Temporary permissions must expire.
9. Deny rules override allow rules.
10. Every authorization decision must be auditable.

## Audit requirements

Audit records should capture:

- actor
- action
- resource
- space/project/task scope
- permission decision
- matched policies
- approval status
- tools used
- external systems touched
- artifacts created or changed
- timestamp
- result

## Governance principle

Agent-Space should make autonomy safe by making identity, access, authorization, policy, permissions, and auditability explicit.

Professional collaboration requires trust. Trust requires governance.
