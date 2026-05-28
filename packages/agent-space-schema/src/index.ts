// Agent-Space Runtime Schema Proposal
//
// Proposed shared schema package for the Agent-Space graph/runtime model.
// This does not place code inside agent-backend directly. Backend runtimes may import,
// extend, or adapt this package after review.

export type ID = string;
export type ISODateTime = string;
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

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
  | 'action'
  | 'intent'
  | 'outcome'
  | 'memory'
  | 'approval'
  | 'decision'
  | 'policy'
  | 'taxonomy'
  | 'permission_scope'
  | 'memory_scope'
  | 'external_ref'
  | 'system';

export type EntityStatus = 'active' | 'inactive' | 'draft' | 'archived' | 'deleted';
export type EntityVisibility = 'private' | 'space' | 'project' | 'organization' | 'public';

export interface ExternalRef {
  provider: string;
  type: string;
  id?: string;
  url?: string;
  displayName?: string;
  metadata?: Record<string, JsonValue>;
}

export interface EntityRef {
  id: ID;
  type: EntityType;
  displayName?: string;
  spaceId?: ID;
  externalRef?: ExternalRef;
}

export interface BaseEntity {
  id: ID;
  type: EntityType;
  displayName: string;
  description?: string;
  spaceId?: ID;
  projectId?: ID;
  status: EntityStatus;
  visibility: EntityVisibility;
  createdBy: EntityRef;
  owner?: EntityRef;
  externalRefs?: ExternalRef[];
  metadata?: Record<string, JsonValue>;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  archivedAt?: ISODateTime;
}

export interface ActorRef extends EntityRef {
  type: 'human' | 'agent' | 'service_account' | 'workflow' | 'automation' | 'system';
}

export type ToolRiskLevel = 'read' | 'write' | 'execute' | 'external_side_effect';

export interface ToolRef extends EntityRef {
  type: 'tool';
}

export type SkillLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface SkillRef {
  id: ID;
  name: string;
  level?: SkillLevel;
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

export type KnowledgeScope = 'global' | 'organization' | 'space' | 'project' | 'task' | 'private';
export type KnowledgeFreshness = 'static' | 'versioned' | 'live' | 'stale' | 'unknown';

export interface KnowledgeRef {
  id: ID;
  name: string;
  type: KnowledgeType;
  scope?: KnowledgeScope;
  freshness?: KnowledgeFreshness;
  accessPolicyRef?: EntityRef;
  externalRef?: ExternalRef;
  metadata?: Record<string, JsonValue>;
}

export interface CapabilityProfile {
  entityRef: EntityRef;
  primaryType: string;
  secondaryTypes?: string[];
  skills: SkillRef[];
  knowledgeRefs: KnowledgeRef[];
  allowedToolRefs?: ToolRef[];
  preferredEnvironmentRefs?: EntityRef[];
  constraints?: string[];
  confidence?: number;
  metadata?: Record<string, JsonValue>;
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

export type ArtifactStatus = 'draft' | 'in_review' | 'approved' | 'rejected' | 'published' | 'archived' | 'superseded';

export interface Artifact extends BaseEntity {
  type: 'artifact';
  artifactType: ArtifactType;
  artifactStatus: ArtifactStatus;
  taskId?: ID;
  runId?: ID;
  fileRefs?: EntityRef[];
  sourceRefs?: EntityRef[];
  version?: string;
  supersedesArtifactId?: ID;
}

export type IntentType = 'goal' | 'request' | 'instruction' | 'objective' | 'hypothesis' | 'decision_needed' | 'problem_to_solve' | 'custom';
export type IntentStatus = 'open' | 'accepted' | 'planned' | 'in_progress' | 'satisfied' | 'rejected' | 'superseded' | 'archived';
export type IntentPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Intent extends BaseEntity {
  type: 'intent';
  intentType: IntentType;
  intentStatus: IntentStatus;
  priority?: IntentPriority;
  desiredOutcomeRefs?: EntityRef[];
  requiredSkillRefs?: SkillRef[];
  requiredKnowledgeRefs?: KnowledgeRef[];
  sourceRefs?: EntityRef[];
}

export type OutcomeType =
  | 'task_result'
  | 'artifact_created'
  | 'artifact_updated'
  | 'decision_made'
  | 'approval_result'
  | 'tool_result'
  | 'workflow_result'
  | 'automation_result'
  | 'environment_result'
  | 'external_side_effect'
  | 'knowledge_created'
  | 'memory_created'
  | 'custom';

export type OutcomeStatus = 'succeeded' | 'failed' | 'partial' | 'blocked' | 'approved' | 'rejected' | 'published' | 'superseded';

export interface Outcome extends BaseEntity {
  type: 'outcome';
  outcomeType: OutcomeType;
  outcomeStatus: OutcomeStatus;
  taskId?: ID;
  runId?: ID;
  actionId?: ID;
  producedBy?: EntityRef;
  artifactRefs?: EntityRef[];
  memoryRefs?: EntityRef[];
  approvalRefs?: EntityRef[];
  evidenceRefs?: EntityRef[];
}

export type MemoryType = 'preference' | 'decision' | 'fact' | 'summary' | 'lesson' | 'constraint' | 'working_context' | 'project_context' | 'customer_context' | 'tool_usage_context' | 'custom';
export type MemoryScope = 'global' | 'organization' | 'space' | 'project' | 'task' | 'actor_private';
export type MemoryStatus = 'active' | 'stale' | 'disputed' | 'archived' | 'deleted';

export interface Memory extends BaseEntity {
  type: 'memory';
  summary: string;
  memoryType: MemoryType;
  memoryScope: MemoryScope;
  memoryStatus: MemoryStatus;
  sourceRefs: EntityRef[];
  confidence?: number;
  freshness?: KnowledgeFreshness;
  accessPolicyRef?: EntityRef;
  expiresAt?: ISODateTime;
}

export type ActionType = 'human_action' | 'agent_action' | 'tool_action' | 'workflow_action' | 'automation_action' | 'system_action' | 'approval_action' | 'policy_action';
export type ActionStatus = 'proposed' | 'authorized' | 'requires_approval' | 'running' | 'succeeded' | 'failed' | 'blocked' | 'cancelled' | 'rejected';

export interface Action extends BaseEntity {
  type: 'action';
  actionType: ActionType;
  verb: string;
  actor: ActorRef;
  actingOnBehalfOf?: ActorRef;
  target?: EntityRef;
  runId?: ID;
  intentRef?: EntityRef;
  toolRef?: ToolRef;
  pluginRef?: EntityRef;
  environmentRef?: EntityRef;
  input?: JsonValue;
  output?: JsonValue;
  actionStatus: ActionStatus;
  riskLevel?: ToolRiskLevel;
  authorizationDecisionRef?: EntityRef;
  approvalRefs?: EntityRef[];
  artifactRefs?: EntityRef[];
  memoryRefs?: EntityRef[];
  policyRefs?: EntityRef[];
  startedAt: ISODateTime;
  completedAt?: ISODateTime;
}

export type RunStatus = 'queued' | 'running' | 'waiting_for_approval' | 'succeeded' | 'failed' | 'cancelled';

export interface Run extends BaseEntity {
  type: 'run';
  runStatus: RunStatus;
  workflowId?: ID;
  automationRuleId?: ID;
  taskId?: ID;
  startedBy: ActorRef;
  actionRefs?: EntityRef[];
  artifactRefs?: EntityRef[];
  outcomeRefs?: EntityRef[];
  startedAt: ISODateTime;
  completedAt?: ISODateTime;
}

export type PermissionAction = 'discover' | 'view' | 'read' | 'comment' | 'create' | 'update' | 'delete' | 'use' | 'execute' | 'approve' | 'reject' | 'share' | 'invite' | 'assign' | 'configure' | 'administer';
export type PermissionEffect = 'allow' | 'deny';

export interface PermissionGrant extends BaseEntity {
  type: 'permission_scope';
  subject: EntityRef;
  action: PermissionAction;
  resource: EntityRef;
  effect: PermissionEffect;
  conditions?: Record<string, JsonValue>[];
  expiresAt?: ISODateTime;
}

export type PolicyEnforcementMode = 'advisory' | 'warn' | 'require_approval' | 'block' | 'audit_only';

export interface UsagePolicy extends BaseEntity {
  type: 'policy';
  category: string;
  appliesTo: EntityRef[];
  condition: string;
  enforcementMode: PolicyEnforcementMode;
}

export type ApprovalStatus = 'requested' | 'approved' | 'rejected' | 'expired' | 'cancelled';

export interface Approval extends BaseEntity {
  type: 'approval';
  requestedBy: ActorRef;
  requestedFrom: EntityRef[];
  target: EntityRef;
  reason: string;
  approvalStatus: ApprovalStatus;
  decidedBy?: ActorRef;
  decidedAt?: ISODateTime;
}

export type GraphEdgeType =
  | 'contains'
  | 'belongs_to'
  | 'assigned_to'
  | 'created_by'
  | 'owned_by'
  | 'depends_on'
  | 'blocks'
  | 'references'
  | 'derived_from'
  | 'supersedes'
  | 'reviews'
  | 'approves'
  | 'rejects'
  | 'uses'
  | 'executes'
  | 'triggers'
  | 'produces'
  | 'modifies'
  | 'reads'
  | 'writes'
  | 'attaches'
  | 'mentions'
  | 'governs'
  | 'authorizes'
  | 'requires'
  | 'satisfies'
  | 'expresses_intent'
  | 'has_outcome'
  | 'creates_memory'
  | 'recalls_memory'
  | 'has_skill'
  | 'has_knowledge'
  | 'requires_skill'
  | 'requires_knowledge'
  | 'performed_action'
  | 'performed_with_tool'
  | 'performed_in_environment'
  | 'linked_to';

export interface GraphEdge {
  id: ID;
  source: EntityRef;
  target: EntityRef;
  type: GraphEdgeType;
  label?: string;
  weight?: number;
  createdBy: EntityRef;
  createdAt: ISODateTime;
  metadata?: Record<string, JsonValue>;
}

export type AgentSpaceNode =
  | BaseEntity
  | Artifact
  | Intent
  | Outcome
  | Memory
  | Action
  | Run
  | PermissionGrant
  | UsagePolicy
  | Approval;

export interface AgentSpaceGraph {
  nodes: AgentSpaceNode[];
  edges: GraphEdge[];
}

export interface RuntimeCommand {
  id: ID;
  spaceId: ID;
  actor: ActorRef;
  intent?: Intent;
  action: Action;
  dryRun?: boolean;
}

export interface RuntimeResult {
  commandId: ID;
  runRef?: EntityRef;
  actionRef: EntityRef;
  outcomeRefs?: EntityRef[];
  artifactRefs?: EntityRef[];
  memoryRefs?: EntityRef[];
  authorizationDecisionRef?: EntityRef;
  status: 'accepted' | 'rejected' | 'requires_approval' | 'completed' | 'failed';
  message?: string;
}
