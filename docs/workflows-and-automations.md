# Workflows and Automations

## Decision

Agent-Space uses both workflows and automations.

A workflow is a structured process that coordinates humans, agents, tools, tasks, approvals, files, artifacts, and runs toward an outcome.

An automation is a trigger-driven or rule-driven execution that performs one or more steps without requiring manual action each time.

```txt
Workflow = the process
Automation = the automatic execution of part or all of the process
```

## Definitions

### Workflow

A workflow answers:

> What sequence of work should happen to achieve this outcome?

A workflow may include:

- human steps
- agent steps
- tool calls
- approvals
- conditional branches
- file checks
- artifact generation
- status changes
- notifications
- handoffs
- recurring reviews

Examples:

- Customer research synthesis workflow
- Pull request review workflow
- Product requirements approval workflow
- Incident response workflow
- Weekly status report workflow
- Client onboarding workflow
- Deployment approval workflow

### Automation

An automation answers:

> What should happen automatically when a trigger or schedule occurs?

An automation may be:

- event-triggered
- schedule-triggered
- condition-triggered
- manually triggered but automatically executed

Examples:

- When a task is marked `ready_for_review`, notify the reviewer
- Every Friday, generate a project status report
- When a PR is opened, assign the code review agent
- When a file is uploaded, summarize it and attach the summary artifact
- When tests fail, create a debugging task
- When an artifact is approved, publish it to the client space

## Product language

Use this language in the product:

```txt
Workflow = visible process or playbook
Automation = automatic rule, trigger, or scheduled action
Run = one execution instance
Step = one unit inside a workflow
Tool = callable action used by a step
Artifact = output produced by a step or run
Approval = human decision gate
```

## Relationship to other Agent-Space concepts

```txt
Space
  └── Workflow
        ├── Steps
        │     ├── Human action
        │     ├── Agent action
        │     ├── Tool call
        │     ├── Approval gate
        │     └── Automation rule
        └── Run
              ├── Tool executions
              ├── Logs
              ├── Artifacts
              └── Decisions
```

## Workflow vs automation vs run

| Concept | Meaning |
|---|---|
| Workflow | The reusable process definition |
| Automation | A rule that automatically starts or performs work |
| Run | A specific execution of a workflow, automation, task, or agent action |

Example:

```txt
Workflow: Weekly project report
Automation: Every Friday at 5 PM, start the workflow
Run: The report generated on 2026-05-29
Artifact: The generated weekly report document
```

## Workflow model

```ts
export interface WorkflowDefinition {
  id: string;
  spaceId: string;
  name: string;
  description?: string;
  trigger?: WorkflowTrigger;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  createdBy: ActorRef;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'archived';
```

## Step model

```ts
export interface WorkflowStep {
  id: string;
  name: string;
  type: WorkflowStepType;
  actor?: ActorRef;
  toolId?: string;
  input?: unknown;
  dependsOn?: string[];
  condition?: WorkflowCondition;
  requiresApproval?: boolean;
  producesArtifactTypes?: ArtifactType[];
}

export type WorkflowStepType =
  | 'human_action'
  | 'agent_action'
  | 'tool_call'
  | 'approval_gate'
  | 'condition'
  | 'notification'
  | 'status_update'
  | 'artifact_generation';
```

## Automation model

```ts
export interface AutomationRule {
  id: string;
  spaceId: string;
  name: string;
  description?: string;
  trigger: WorkflowTrigger;
  action: AutomationAction;
  enabled: boolean;
  createdBy: ActorRef;
  permissionScopeId: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkflowTrigger =
  | EventTrigger
  | ScheduleTrigger
  | ConditionTrigger
  | ManualTrigger;
```

## Trigger types

```ts
export interface EventTrigger {
  type: 'event';
  eventName: string;
  filters?: Record<string, unknown>;
}

export interface ScheduleTrigger {
  type: 'schedule';
  cron: string;
  timezone: string;
}

export interface ConditionTrigger {
  type: 'condition';
  expression: string;
  checkInterval?: string;
}

export interface ManualTrigger {
  type: 'manual';
}
```

## Run model

```ts
export interface WorkflowRun {
  id: string;
  workflowId?: string;
  automationRuleId?: string;
  spaceId: string;
  projectId?: string;
  taskId?: string;
  status: RunStatus;
  startedBy: ActorRef;
  currentStepId?: string;
  stepRuns: WorkflowStepRun[];
  artifacts?: ArtifactRef[];
  startedAt: string;
  completedAt?: string;
}

export type RunStatus =
  | 'queued'
  | 'running'
  | 'waiting_for_approval'
  | 'succeeded'
  | 'failed'
  | 'cancelled';
```

## Approval gates

Workflows should support approval gates for high-impact actions.

Examples:

- before sending external communication
- before publishing a customer-facing artifact
- before merging a pull request
- before deploying
- before deleting files
- before granting access
- before committing budget or spend

## Example: Pull request review workflow

```txt
Trigger: GitHub PR opened
Steps:
  1. Link PR as artifact
  2. Assign code review agent
  3. Run static checks
  4. Agent reviews diff
  5. Agent posts review summary
  6. Human approval gate
  7. Mark PR ready for merge
```

Automation:

```txt
When github.pull_request.opened occurs, start Pull Request Review Workflow.
```

## Example: File summary automation

```txt
Trigger: file.uploaded
Action:
  1. Ask document agent to summarize file
  2. Create summary artifact
  3. Link summary to the file and project
  4. Notify project channel
```

## Example: Weekly report workflow

```txt
Trigger: every Friday at 17:00
Steps:
  1. Collect completed tasks
  2. Collect open blockers
  3. Summarize recent artifacts
  4. Draft report
  5. Human approval gate
  6. Publish report to project channel
```

## Principles

1. Workflows describe how work should happen.
2. Automations decide when work happens automatically.
3. Runs record what actually happened.
4. Steps should be visible and inspectable.
5. High-impact actions require approval gates.
6. Every automated action must be scoped to a space.
7. Every run should produce logs, status, and optionally artifacts.
8. Automation should accelerate collaboration, not hide accountability.
