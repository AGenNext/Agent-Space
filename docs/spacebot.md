# Spacebot for Agent-Space

Spacebot describes itself as an AI operating system for teams, built around concurrent thinking, execution, channels, memories, workers, branches, cron, and multi-platform agents.

For AGenNext, Spacebot is a useful reference for the **agent/team operating layer** around a space.

Agent-Space defines the bounded workspace. Spacebot shows a practical product pattern for how agents, workers, memory, channels, and scheduled jobs can operate inside team contexts.

Source: https://spacebot.sh/

## Why it matters

A governed space is not only storage. It is also where work is coordinated.

Agentic team work needs:

- channels
- memory
- workers
- branches
- cron/scheduling
- platform adapters
- task execution
- model routing
- multi-agent boundaries

Spacebot’s architecture language maps well to the Agent-Space runtime boundary.

## Spacebot concepts relevant to Agent-Space

| Spacebot concept | Agent-Space interpretation |
|---|---|
| Channel | User-facing conversation surface inside a space. |
| Branch | Context fork for deeper thinking inside the same governed boundary. |
| Worker | Execution unit with limited context and specific tools. |
| Memory graph | Space-scoped memory and recall layer. |
| Cron | Scheduled work attached to a space. |
| Multi-platform adapters | Channels can connect Slack, Discord, Telegram, or other surfaces. |
| Model routing | Model choice should be governed by task, cost, trust, and policy. |
| Multiple agents | Each agent should have its own workspace, database, identity, and scope. |

## Agent-Space mapping

```txt
Team channel / agent conversation
  ↓
Branch or worker delegation
  ↓
Space-scoped memory, tools, files, and schedule
  ↓
Agent-Space boundary
  ↓
Agent-Platform governance
```

## Recommended contract

```yaml
space_agent_runtime:
  id: runtime:spacebot-style-team-agent
  surface: team-ai-os
  capabilities:
    channels: true
    workers: true
    branches: true
    memory_graph: true
    cron: true
    multi_platform: true
  governance:
    space_required: true
    worker_scope_required: true
    model_routing_policy_required: true
    audit_task_execution: true
    audit_memory_reads: true
    audit_file_access: true
```

## Design rules

1. Channels talk to users; workers execute bounded tasks.
2. Branches may think with context, but workers should receive only what they need.
3. Cron jobs must be attached to explicit spaces.
4. Model routing must be policy-aware and cost-aware.
5. Memory recall must be auditable and scoped.
6. Multi-platform adapters must not bypass space permissions.
7. Every worker action should produce an artifact, trace, or event.

## AGenNext takeaway

Spacebot is a reference for how Agent-Space can become operational: channels for collaboration, branches for reasoning, workers for execution, memory for continuity, and cron for recurring work — all under an explicit space boundary.