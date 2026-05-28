# Plugin and Tool Architecture

## Decision

Agent-Space uses both plugins and tools.

A plugin is an integration package that connects Agent-Space to an external system, runtime, editor, storage provider, communication channel, or capability domain.

A tool is a specific callable action exposed by a plugin and made available to agents, humans, workflows, or automation policies.

```txt
Plugin
  └── exposes Tools
```

## Definitions

### Plugin

A plugin answers:

> How does Agent-Space connect to this external capability?

Examples:

- GitHub Plugin
- VS Code Plugin
- Eclipse Che Plugin
- Slack Plugin
- Google Drive Plugin
- Jira Plugin
- Browser Sandbox Plugin
- Data Notebook Plugin

A plugin owns integration-specific concerns such as:

- authentication with the external system
- provider configuration
- capability discovery
- tool registration
- provider-specific API calls
- mapping provider objects into Agent-Space references
- lifecycle management for external resources

### Tool

A tool answers:

> What specific action can be performed?

Examples:

GitHub Plugin tools:

- `github.read_repository`
- `github.create_branch`
- `github.commit_changes`
- `github.open_pull_request`
- `github.request_review`
- `github.comment_on_issue`

Eclipse Che Plugin tools:

- `che.create_workspace`
- `che.start_workspace`
- `che.stop_workspace`
- `che.get_workspace_url`
- `che.delete_workspace`

VS Code Plugin tools:

- `vscode.open_workspace`
- `vscode.open_file`
- `vscode.show_diff`
- `vscode.apply_patch`

## Product language

Use this language in the product:

```txt
Integrations = user-facing installed capabilities
Plugins = developer-facing integration packages
Tools = callable actions exposed by plugins
Environments = places where work runs
Artifacts = things produced by work
Runs = execution records
```

## System boundary

Agent-Space owns:

- spaces
- projects
- tasks
- agents
- humans
- files and artifact references
- channels and chat references
- memory scope references
- permission scope references
- environment references
- run scope references
- lifecycle metadata

Plugins own:

- connection to external systems
- provider-specific APIs
- provider-specific object mapping
- available tools
- provider lifecycle operations

Tools own:

- one specific action
- input schema
- output schema
- execution constraints
- permission requirements
- audit metadata

## Architecture

```txt
Agent-Space
  ├── Space Registry
  ├── Project Registry
  ├── Task Registry
  ├── Agent Membership
  ├── Human Membership
  ├── File References
  ├── Channel References
  ├── Environment References
  ├── Permission Scopes
  └── Run Scopes

Plugin Registry
  ├── GitHub Plugin
  │   ├── github.read_repository
  │   ├── github.create_branch
  │   ├── github.commit_changes
  │   └── github.open_pull_request
  │
  ├── Eclipse Che Plugin
  │   ├── che.create_workspace
  │   ├── che.start_workspace
  │   ├── che.stop_workspace
  │   └── che.get_workspace_url
  │
  └── VS Code Plugin
      ├── vscode.open_workspace
      ├── vscode.open_file
      ├── vscode.show_diff
      └── vscode.apply_patch
```

## Plugin contract

```ts
export interface AgentSpacePlugin {
  id: string;
  name: string;
  type: PluginType;
  version: string;

  capabilities: PluginCapability[];
  tools: ToolDefinition[];

  configure(input: PluginConfigInput): Promise<PluginConfig>;
  healthCheck(config: PluginConfig): Promise<PluginHealth>;
}

export type PluginType =
  | 'code_host'
  | 'editor'
  | 'environment'
  | 'file_storage'
  | 'communication'
  | 'project_management'
  | 'browser_runtime'
  | 'data_runtime'
  | 'custom';
```

## Tool contract

```ts
export interface ToolDefinition {
  id: string;
  pluginId: string;
  name: string;
  description: string;
  inputSchema: JsonSchema;
  outputSchema: JsonSchema;
  requiredPermission: string;
  riskLevel: ToolRiskLevel;
  requiresHumanApproval: boolean;
}

export type ToolRiskLevel = 'read' | 'write' | 'execute' | 'external_side_effect';
```

## Tool execution contract

```ts
export interface ToolExecutionRequest {
  toolId: string;
  spaceId: string;
  projectId?: string;
  taskId?: string;
  runId: string;
  requestedBy: ActorRef;
  actingAs?: ActorRef;
  permissionScopeId: string;
  input: unknown;
}

export interface ToolExecutionResult {
  toolId: string;
  runId: string;
  status: 'succeeded' | 'failed' | 'requires_approval';
  output?: unknown;
  error?: string;
  artifacts?: ArtifactRef[];
  externalRefs?: ExternalRef[];
  audit: ToolAuditRecord;
}
```

## Approval model

Tools must declare their risk level.

Recommended default policy:

| Risk level | Example | Human approval |
|---|---|---|
| `read` | read repo, list files | Usually no |
| `write` | create branch, edit file | Sometimes |
| `execute` | run command, start environment | Policy-based |
| `external_side_effect` | open PR, deploy, send email | Usually yes |

## Example: GitHub Plugin

GitHub is a plugin.

Opening a pull request is a tool.

```txt
Plugin: github
Tool: github.open_pull_request
Risk: external_side_effect
Approval: required by default
```

## Example: Eclipse Che Plugin

Eclipse Che is a plugin.

Starting a workspace is a tool.

```txt
Plugin: eclipse-che
Tool: che.start_workspace
Risk: execute
Approval: policy-based
```

## Example: VS Code Plugin

VS Code is a plugin or editor provider.

Opening a file is a tool.

```txt
Plugin: vscode
Tool: vscode.open_file
Risk: read
Approval: usually not required
```

## Principles

1. Agent-Space stays runtime-agnostic.
2. Plugins connect capabilities.
3. Tools perform specific actions.
4. Every tool call is scoped to a space.
5. Every tool call is permission checked.
6. Every tool call creates an audit record.
7. High-impact side effects require human approval.
8. External systems are referenced, not absorbed into Agent-Space.
