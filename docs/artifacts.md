# Artifacts

## Definition

An artifact is a meaningful output, work product, or deliverable produced, modified, referenced, or reviewed inside Agent-Space.

Artifacts are the visible results of collaboration between humans, agents, tools, files, tasks, projects, and runs.

```txt
Work happens in spaces.
Runs execute work.
Tools perform actions.
Artifacts are produced, changed, or referenced as outcomes.
```

## Why artifacts matter

Professional collaboration is not complete when a message is sent or a task is marked done.

It is complete when a useful work product exists, is reviewable, and can be connected back to the context that produced it.

Artifacts provide that connection.

They answer:

- What was produced?
- Who or what produced it?
- Which task, project, run, file, or discussion created it?
- What changed?
- Is it draft, reviewed, approved, rejected, or published?
- Where does the artifact live?
- Can it be reused later?

## Examples

Artifacts may include:

- documents
- spreadsheets
- presentations
- diagrams
- images
- PDFs
- code patches
- pull requests
- research summaries
- meeting notes
- product requirement documents
- strategy memos
- test reports
- design reviews
- generated datasets
- analysis notebooks
- deployment plans
- decision records
- task outputs
- chat summaries

## Artifact vs file

A file is a storage object or reference.

An artifact is a work product with meaning, context, authorship, lifecycle state, and relationships.

A single artifact may be backed by one file, many files, an external URL, a database record, a GitHub pull request, a generated report, or a structured object.

```txt
File = where content is stored
Artifact = what the work product means
```

Example:

```txt
File: /launch/gtm-plan-v3.docx
Artifact: Go-To-Market Plan for Project Phoenix
Status: approved
Produced by: strategy-agent
Reviewed by: Chinmay
Linked task: task_create_gtm_plan
Linked run: run_123
```

## Artifact vs tool output

A tool output is the immediate response from a tool call.

An artifact is the durable work product that Agent-Space keeps, tracks, links, reviews, or reuses.

Example:

```txt
Tool: github.open_pull_request
Tool output: { pr_number: 42, url: "https://github.com/org/repo/pull/42" }
Artifact: Pull Request #42 for fixing authentication tests
```

## Artifact vs run

A run is an execution record.

An artifact is something produced or changed by that execution.

```txt
Run = what happened
Artifact = what came out of it
```

## Artifact lifecycle

Recommended lifecycle states:

```txt
draft
in_review
approved
rejected
published
archived
superseded
```

## Artifact model

```ts
export interface ArtifactRef {
  id: string;
  spaceId: string;
  projectId?: string;
  taskId?: string;
  runId?: string;

  type: ArtifactType;
  title: string;
  description?: string;

  status: ArtifactStatus;
  createdBy: ActorRef;
  modifiedBy?: ActorRef;
  reviewedBy?: ActorRef[];
  approvedBy?: ActorRef[];

  fileRefs?: FileRef[];
  externalRefs?: ExternalRef[];
  sourceRefs?: SourceRef[];

  version?: string;
  parentArtifactId?: string;
  supersedesArtifactId?: string;

  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type ArtifactType =
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'image'
  | 'diagram'
  | 'pdf'
  | 'code_patch'
  | 'pull_request'
  | 'issue'
  | 'research_summary'
  | 'meeting_notes'
  | 'decision_record'
  | 'test_report'
  | 'analysis_notebook'
  | 'dataset'
  | 'deployment_plan'
  | 'task_output'
  | 'chat_summary'
  | 'custom';

export type ArtifactStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived'
  | 'superseded';
```

## Relationships

Artifacts should be linkable to:

- spaces
- projects
- tasks
- runs
- agents
- humans
- files
- tools
- chats
- decisions
- approvals
- external systems

## Artifact provenance

Every artifact should preserve provenance.

Minimum provenance:

```txt
created_by
created_from_run
created_from_task
created_from_tool_calls
source_files
source_messages
review_status
approval_history
version_history
```

## Artifact approval

Artifacts can require review or approval depending on their type and risk.

Examples:

| Artifact | Approval default |
|---|---|
| Chat summary | Usually no |
| Research summary | Optional |
| Product requirements document | Recommended |
| Pull request | Required before merge |
| Customer-facing document | Required |
| Deployment plan | Required |
| Legal memo | Required |

## Artifact examples

### Research summary

```json
{
  "id": "artifact_research_summary_001",
  "spaceId": "space_customer_acme",
  "projectId": "project_market_research",
  "taskId": "task_summarize_interviews",
  "runId": "run_123",
  "type": "research_summary",
  "title": "Customer Interview Synthesis",
  "status": "in_review",
  "createdBy": {
    "type": "agent",
    "id": "agent_research"
  },
  "fileRefs": [
    {
      "id": "file_customer_interview_synthesis_doc",
      "provider": "agent-drive"
    }
  ]
}
```

### Pull request artifact

```json
{
  "id": "artifact_pr_42",
  "spaceId": "space_agent_platform_dev",
  "projectId": "project_auth_service",
  "taskId": "task_fix_auth_tests",
  "runId": "run_456",
  "type": "pull_request",
  "title": "Fix failing authentication tests",
  "status": "in_review",
  "createdBy": {
    "type": "agent",
    "id": "agent_engineering"
  },
  "externalRefs": [
    {
      "provider": "github",
      "type": "pull_request",
      "url": "https://github.com/org/auth-service/pull/42"
    }
  ]
}
```

## Product principle

Artifacts are not just attachments.

They are durable, reviewable, attributable work products that connect collaboration to outcomes.

Agent-Space should make artifacts easy to find, inspect, review, approve, version, and reuse.
