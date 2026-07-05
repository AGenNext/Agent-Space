# CNCF Cloud Native Storage Landscape for Agent-Space

The CNCF Landscape classifies cloud-native storage under **Runtime → Cloud Native Storage**. For Agent-Space, this category is the canonical upstream ecosystem map for storage systems that can back governed workspaces, artifacts, datasets, evidence, and runtime volumes.

Source: https://landscape.cncf.io/?view-mode=card&classify=category&sort-by=name&sort-direction=asc#runtime--cloud-native-storage

## Why this matters

Agent-Space should not hard-code one storage product as the platform truth.

A space may need different storage semantics depending on the workload:

- object storage for artifacts and evidence
- block storage for stateful Kubernetes workloads
- file storage for shared workspaces
- POSIX-style access for legacy tools
- HDFS-style access for analytics pipelines
- CSI-backed volumes for Kubernetes workloads
- local-first file references for personal/team context
- distributed storage for multi-node, HA, and large-scale environments

The CNCF Landscape is the external ecosystem map. Agent-Space is the governance boundary that decides how storage is attached, scoped, audited, and retired.

## Agent-Space storage principle

```txt
Storage backend is replaceable.
Space boundary is authoritative.
```

Storage systems provide durability and access protocols. Agent-Space provides:

- workspace identity
- tenant/project boundary
- permissions
- provenance
- retention
- lifecycle state
- audit trail
- policy attachment
- artifact ownership

## Storage layers

| Layer | Purpose | Example references |
|---|---|---|
| Local-first data surface | Discover files across user devices and sources. | Spacedrive |
| Object storage | Store artifacts, datasets, traces, evidence, and exports. | RustFS / S3-compatible systems |
| Distributed multi-protocol storage | Provide S3, POSIX, HDFS, and CSI-style access for large-scale workloads. | CubeFS |
| Kubernetes volume storage | Provide mounted volumes for stateful workloads. | CSI-compatible cloud-native storage |
| Archive and evidence storage | Preserve retained or immutable records. | Object lock / WORM-capable backends |
| Public demo storage | Host demo-safe assets and model demos. | Hugging Face Spaces assets |

## Decision framework

| Requirement | Prefer |
|---|---|
| Simple artifacts and generated files | S3-compatible object storage |
| Immutable audit evidence | Object storage with versioning and object lock |
| Large shared datasets | Distributed storage with object or HDFS-style access |
| Kubernetes stateful workloads | CSI-backed volume storage |
| Local user files and device context | Local-first source reference layer |
| Public demos | Hugging Face Spaces or static demo assets |
| Multi-protocol enterprise storage | CubeFS-style distributed storage |

## Minimum storage contract

Every storage backend attached to Agent-Space should implement this logical contract:

```yaml
space_storage_binding:
  id: storage:example
  space_id: space:example
  provider: rustfs | cubefs | s3 | local | other
  access_protocols:
    - s3
    - posix
    - hdfs
    - csi
  purpose: artifacts | datasets | evidence | runtime-volumes | archive | demo-assets
  classification: public | internal | confidential | restricted
  versioning: true
  retention_policy_id: policy:retention
  audit:
    reads: true
    writes: true
    deletes: true
    exports: true
```

## Rules

1. Do not treat storage access as authorization.
2. Every object, file, volume, or dataset must resolve back to a space.
3. Storage references must preserve provenance.
4. Public demo storage must not contain production secrets or production data.
5. Backend-specific features should be exposed through a common Agent-Space policy model.
6. Lifecycle states should control storage access, retention, export, and deletion behavior.

## AGenNext takeaway

The CNCF cloud-native storage landscape is the selection map. Agent-Space is the control boundary.

Agent-Space should support many storage backends while enforcing one product rule:

```txt
No storage attachment without space governance.
```
