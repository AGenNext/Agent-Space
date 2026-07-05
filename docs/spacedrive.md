# Spacedrive for Agent-Space

Spacedrive is a local-first data and file surface for connecting files, clouds, devices, and sources in one app. Its public site describes it as connecting “every file, cloud, device, and source” in a local-first app, with browsing and search across user-owned data.

For AGenNext, Spacedrive is a useful reference implementation for the **data surface** side of Agent-Space.

Agent-Space defines the governed workspace boundary. Spacedrive shows how a user-facing file and source layer can make scattered data discoverable without forcing everything into a central cloud runtime.

Source: https://spacedrive.com/

## Why it matters

Agentic work depends on context. Context usually lives across many places:

- local files
- external drives
- NAS devices
- cloud storage
- source repositories
- notes
- email
- generated artifacts
- archived project folders

Spacedrive’s model aligns with the Agent-Space idea that a workspace is not only a folder. A space is a bounded operating context across files, devices, memory, runs, people, agents, policies, and artifacts.

## Spacedrive concepts relevant to Agent-Space

| Spacedrive concept | Agent-Space interpretation |
|---|---|
| Local-first file surface | Agent work should not require centralizing all data first. |
| Cross-device indexing | A space can span devices, drives, clouds, and source systems. |
| Content identity / hashes | Files and artifacts need stable identity beyond filename/path. |
| Offline awareness | A space can remember unavailable sources without pretending they are online. |
| Source connections | External sources can be attached as governed space inputs. |
| Search across sources | Agent context retrieval should work across attached space surfaces. |

## Agent-Space mapping

```txt
Files, devices, drives, clouds, notes, and archives
  ↓
Spacedrive-style data surface
  ↓
Agent-Space boundary
  ↓
Policy, identity, permissions, memory scope, run scope, artifact lifecycle
  ↓
Agent-Platform governance
```

## Recommended integration model

Agent-Space should treat Spacedrive-like systems as **source surfaces**, not as the final governance authority.

```yaml
space_source:
  id: source:spacedrive-local-library
  type: local-first-file-surface
  provider: spacedrive
  attachment_mode: indexed-reference
  data_policy:
    copy_files_by_default: false
    preserve_original_paths: true
    hash_content: true
    redact_before_agent_use: true
  governance:
    agent_space_required: true
    permission_check_required: true
    audit_reads: true
    audit_writes: true
```

## Design rules

1. Do not collapse file identity into file path alone.
2. Preserve source references and provenance.
3. Treat unavailable devices as offline sources, not deleted data.
4. Keep production data out of public demo spaces.
5. Require explicit permission before an agent reads, transforms, or exports files.
6. Keep local-first and cloud-first sources interoperable.

## AGenNext takeaway

Spacedrive is the user-facing inspiration for a personal or team data surface. Agent-Space is the governance layer that decides what an agent may do with that surface.