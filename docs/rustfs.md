# RustFS for Agent-Space

RustFS is an S3-compatible object storage system positioned as a high-performance data foundation for AI/ML pipelines. Its public site emphasizes distributed object storage, S3 compatibility, cross-cloud deployment, object versioning, WORM support, active replication, Kubernetes usage, and edge deployment.

For AGenNext, RustFS is a candidate **object storage backend** for Agent-Space artifacts, datasets, traces, generated files, and demo-safe object stores.

Source: https://rustfs.com/

## Why it matters

Agent-Space needs durable object storage for:

- uploaded files
- generated artifacts
- datasets
- model outputs
- run logs
- evaluation evidence
- compliance snapshots
- exported bundles
- immutable records

RustFS is relevant because Agent-Space should support S3-compatible object storage without binding the platform to a single cloud vendor.

## RustFS concepts relevant to Agent-Space

| RustFS concept | Agent-Space interpretation |
|---|---|
| S3 compatibility | Keep storage portable across tools and cloud/on-prem environments. |
| Distributed object storage | Store large artifacts beyond local filesystem boundaries. |
| Kubernetes support | Fit the AGenNext cloud-native deployment baseline. |
| Cross-cloud | Support multi-cloud and sovereignty-oriented deployment. |
| Version control | Preserve historical artifact versions. |
| WORM/object locking | Support compliance-grade immutable evidence. |
| Active replication | Improve availability and disaster recovery. |
| Edge-capable binary | Useful for smaller edge or lab deployments. |

## Agent-Space mapping

```txt
Agent output, uploaded files, datasets, traces, evidence
  ↓
S3-compatible object storage bucket
  ↓
RustFS backend
  ↓
Agent-Space artifact registry
  ↓
Policy, retention, provenance, lifecycle, and audit
```

## Recommended bucket model

```yaml
space_storage:
  provider: rustfs
  protocol: s3-compatible
  buckets:
    - name: agent-space-artifacts
      purpose: generated artifacts
      versioning: true
      retention_policy: governed
    - name: agent-space-evidence
      purpose: compliance and audit evidence
      versioning: true
      object_lock: true
    - name: agent-space-datasets
      purpose: demo-safe datasets
      versioning: true
  governance:
    space_id_required: true
    object_metadata_required: true
    provenance_required: true
    retention_policy_required: true
    public_access_default: false
```

## Required object metadata

Every object written by an agent should include metadata like:

```yaml
x-agent-space-id: space:example
x-agent-run-id: run:example
x-agent-id: agent:example
x-artifact-type: report | dataset | trace | evidence | export
x-provenance: required
x-retention-class: draft | active | archive | legal-hold
```

## Design rules

1. Do not write objects without a space ID.
2. Enable versioning for generated artifacts and evidence.
3. Use object lock/WORM only for records that require immutability.
4. Keep public buckets disabled by default.
5. Attach retention policy to every governed bucket.
6. Treat S3 URLs as references, not authorization grants.
7. Never expose raw object credentials to agents.

## AGenNext takeaway

RustFS fits Agent-Space as a portable, S3-compatible object storage backend for AI-era artifacts and evidence. It should sit behind Agent-Space governance, not replace it.