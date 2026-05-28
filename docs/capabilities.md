# Types, Skills, and Knowledge

## Decision

Agent-Space distinguishes between type, skill, and knowledge.

```txt
Type = what something is
Skill = what something can do
Knowledge = what something knows or can reference
```

These concepts apply primarily to entities, agents, humans, tools, plugins, workflows, and environments.

## Why this matters

Agent-Space needs to reason about which entity should perform which work.

To do that well, the system must know:

- what the entity is
- what capabilities it has
- what domains it understands
- what tools it can use
- what knowledge sources it can access
- what constraints or permissions apply

Without this separation, the platform cannot reliably match tasks to agents, tools, humans, or workflows.

## Type

A type describes what an entity, tool, artifact, workflow, or environment is.

Examples:

```txt
Entity type: agent
Agent type: engineering-agent
Tool type: code_host.write
Artifact type: pull_request
Environment type: cloud_dev_workspace
Knowledge type: documentation
Skill type: code_review
```

Types are useful for classification, routing, validation, permissions, and UI grouping.

## Skill

A skill describes an ability that an entity can perform.

Skills should be action-oriented.

Examples:

- write code
- review code
- summarize documents
- synthesize research
- create project plans
- design workflows
- debug failing tests
- analyze spreadsheets
- draft legal memo
- create sales outreach
- operate GitHub
- use Eclipse Che
- use VS Code
- manage Kubernetes

Skills can belong to:

- humans
- agents
- teams
- workflows
- plugins
- tools
- environments

## Knowledge

Knowledge describes information, documentation, frameworks, methods, tool usage, domain expertise, or context that an entity can reference.

Knowledge is not the same as skill.

```txt
Skill = ability to do something
Knowledge = information used to do it well
```

Examples:

- React documentation
- Next.js app router knowledge
- GitHub pull request process
- Eclipse Che workspace lifecycle
- company engineering standards
- product management frameworks
- design system guidelines
- customer research repository
- SOC 2 control documentation
- onboarding playbook
- API reference documentation
- internal architecture decision records

## Type vs skill vs knowledge

| Concept | Question answered | Example |
|---|---|---|
| Type | What is it? | `agent`, `tool`, `artifact`, `environment` |
| Skill | What can it do? | `code_review`, `research_synthesis` |
| Knowledge | What does it know or reference? | `React docs`, `company coding standards` |

## Capability profile

A capability profile describes an entity's types, skills, knowledge, tools, and limits.

```ts
export interface CapabilityProfile {
  entityRef: EntityRef;

  primaryType: string;
  secondaryTypes?: string[];

  skills: SkillRef[];
  knowledgeRefs: KnowledgeRef[];
  allowedToolRefs?: ToolRef[];
  preferredEnvironmentRefs?: EntityRef[];

  constraints?: CapabilityConstraint[];
  confidence?: number;
  metadata?: Record<string, unknown>;
}
```

## Skill model

```ts
export interface Skill {
  id: string;
  name: string;
  description?: string;
  category: SkillCategory;
  level?: SkillLevel;
  verified?: boolean;
  evidenceRefs?: EntityRef[];
  relatedToolRefs?: ToolRef[];
  relatedKnowledgeRefs?: KnowledgeRef[];
  metadata?: Record<string, unknown>;
}

export interface SkillRef {
  id: string;
  name: string;
  level?: SkillLevel;
}

export type SkillCategory =
  | 'engineering'
  | 'product'
  | 'design'
  | 'research'
  | 'data'
  | 'operations'
  | 'sales'
  | 'marketing'
  | 'legal'
  | 'finance'
  | 'security'
  | 'communication'
  | 'tool_usage'
  | 'workflow_design'
  | 'custom';

export type SkillLevel =
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'expert';
```

## Knowledge model

```ts
export interface KnowledgeRef {
  id: string;
  name: string;
  type: KnowledgeType;
  source?: KnowledgeSource;
  scope?: KnowledgeScope;
  freshness?: KnowledgeFreshness;
  accessPolicyRef?: EntityRef;
  metadata?: Record<string, unknown>;
}

export type KnowledgeType =
  | 'documentation'
  | 'framework'
  | 'tool_usage'
  | 'api_reference'
  | 'codebase_context'
  | 'company_policy'
  | 'domain_expertise'
  | 'customer_context'
  | 'project_context'
  | 'decision_history'
  | 'playbook'
  | 'dataset'
  | 'memory'
  | 'custom';

export interface KnowledgeSource {
  provider: string;
  type: string;
  url?: string;
  entityRef?: EntityRef;
  externalRef?: ExternalRef;
}

export type KnowledgeScope =
  | 'global'
  | 'organization'
  | 'space'
  | 'project'
  | 'task'
  | 'private';

export type KnowledgeFreshness =
  | 'static'
  | 'versioned'
  | 'live'
  | 'stale'
  | 'unknown';
```

## Tool capability model

Tools should also declare their type, skill requirements, and knowledge assumptions.

```ts
export interface ToolCapabilityProfile {
  toolRef: ToolRef;
  toolType: string;
  requiredSkills?: SkillRef[];
  requiredKnowledgeRefs?: KnowledgeRef[];
  producedArtifactTypes?: string[];
  riskLevel: ToolRiskLevel;
}

export interface ToolRef extends EntityRef {
  type: 'tool';
}
```

Example:

```txt
Tool: github.open_pull_request
Type: code_host.external_side_effect
Required skill: use_github
Required knowledge: GitHub pull request process
Produces artifact: pull_request
Risk: external_side_effect
```

## Agent capability model

Agents should have explicit capability profiles.

Example:

```json
{
  "entityRef": {
    "id": "agent_engineering",
    "type": "agent",
    "displayName": "Engineering Agent"
  },
  "primaryType": "engineering-agent",
  "secondaryTypes": ["code-review-agent", "debugging-agent"],
  "skills": [
    { "id": "skill_write_code", "name": "write code", "level": "advanced" },
    { "id": "skill_review_code", "name": "review code", "level": "advanced" },
    { "id": "skill_debug_tests", "name": "debug failing tests", "level": "advanced" },
    { "id": "skill_use_github", "name": "use GitHub", "level": "intermediate" }
  ],
  "knowledgeRefs": [
    {
      "id": "knowledge_nextjs_docs",
      "name": "Next.js documentation",
      "type": "documentation",
      "scope": "global"
    },
    {
      "id": "knowledge_company_coding_standards",
      "name": "Company coding standards",
      "type": "company_policy",
      "scope": "organization"
    }
  ],
  "allowedToolRefs": [
    { "id": "tool_github_read_repository", "type": "tool", "displayName": "github.read_repository" },
    { "id": "tool_github_open_pull_request", "type": "tool", "displayName": "github.open_pull_request" },
    { "id": "tool_che_start_workspace", "type": "tool", "displayName": "che.start_workspace" }
  ]
}
```

## Matching work to entities

Capability profiles allow Agent-Space to route work.

Example:

```txt
Task: Fix failing authentication tests
Required skills:
  - debug failing tests
  - write code
  - use GitHub
Required knowledge:
  - repo architecture
  - test framework documentation
  - company coding standards
Required tools:
  - github.create_branch
  - che.start_workspace
  - github.open_pull_request

Best match:
  Engineering Agent
```

## Knowledge access rules

Knowledge should be permissioned.

An entity may have a skill but not have access to the required knowledge.

Example:

```txt
Agent has skill: summarize customer interviews
Agent does not have access: confidential customer research folder
Result: task cannot run until access is granted or a human provides approved context
```

## Capability constraints

```ts
export interface CapabilityConstraint {
  type: CapabilityConstraintType;
  description: string;
  metadata?: Record<string, unknown>;
}

export type CapabilityConstraintType =
  | 'requires_human_approval'
  | 'read_only'
  | 'no_external_side_effects'
  | 'space_scoped_only'
  | 'project_scoped_only'
  | 'time_limited'
  | 'cost_limited'
  | 'requires_fresh_knowledge'
  | 'custom';
```

## Principles

1. Types classify entities and capabilities.
2. Skills describe what entities can do.
3. Knowledge describes what entities know or can reference.
4. Skills and knowledge should be separately permissioned.
5. Tools should declare required skills and knowledge assumptions.
6. Work should be routed based on required skills, available knowledge, permissions, and risk.
7. Capability profiles should be inspectable by humans.
8. Agent-Space should not assume an agent can do work simply because it is available.
