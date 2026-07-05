# CubeFS for Agent-Space

CubeFS is a cloud-native, open-source distributed storage system for unstructured data. Its public site describes support for S3, HDFS, and POSIX access protocols, along with big data, AI/LLM, container platform, data sharing, and storage-compute separation scenarios. CubeFS is also listed as a CNCF Incubating project.

For AGenNext, CubeFS is a candidate **distributed storage substrate** for large-scale Agent-Space environments where object, file, and analytics-oriented access patterns may need to coexist.

Source: https://cubefs.io/

## Why it matters

Agent-Space may need more than one storage pattern:

- object storage for artifacts and evidence
- POSIX-like access for legacy tools
- HDFS-style access for data/analytics workloads
- Kubernetes CSI integration for cloud-native workloads
- multi-tenant isolation
- erasure coding for large-scale cost control

CubeFS is relevant because it supports multiple protocols and cloud-native deployment patterns from one distributed storage system.

## CubeFS concepts relevant to Agent-Space

| CubeFS concept | Agent-Space interpretation |
|---|---|
| S3 support | Store and retrieve object-style artifacts. |
| POSIX support | Support tools that expect filesystem semantics. |
| HDFS support | Support big data and analytics compatibility. |
| Multi-engine | Choose replicas or erasure coding based on workload. |
| Horizontal scalability | Scale storage modules independently. |
| Multi-tenancy | Align storage isolation with Agent-Space tenant boundaries. |
| Kubernetes CSI | Attach governed storage to cloud-native workloads. |
| Cloud-native status | Fit CNCF-oriented AGenNext infrastructure principles. |

## Agent-Space mapping

```txt
Space files, artifacts, datasets, logs, and analytics data
  ↓
CubeFS multi-protocol distributed storage
  ↓
S3 / POSIX / HDFS / CSI access surfaces
  ↓
Agent-Space metadata, permissions, provenance, and lifecycle
  ↓
Agent-Platform governance
```

## Recommended deployment model

```yaml
space_storage:
  provider: cubefs
  category: distributed-multi-protocol-storage
  access_protocols:
    - s3
    - posix
    - hdfs
    - csi
  workloads:
    - agent-artifacts
    - large-datasets
    - analytics
    - ai-training
    - shared-workspaces
  governance:
    tenant_isolation_required: true
    space_id_required: true
    provenance_required: true
    storage_policy_required: true
    lifecycle_policy_required: true
```

## Storage class mapping

```yaml
storage_classes:
  hot-workspace:
    purpose: active agent workspace data
    engine: replica
    access: posix-or-csi
  artifact-object:
    purpose: generated artifacts and exports
    engine: replica-or-erasure-code
    access: s3
  dataset-lake:
    purpose: analytics and AI datasets
    engine: erasure-code
    access: hdfs-or-s3
  compliance-evidence:
    purpose: audit evidence and retained records
    engine: replica
    access: s3
    retention: governed
```

## Design rules

1. Use CubeFS when Agent-Space needs multi-protocol distributed storage, not just simple object buckets.
2. Map CubeFS tenants and volumes to Agent-Space boundaries.
3. Keep agent access mediated by policy even when the underlying protocol permits direct reads.
4. Use CSI for Kubernetes workloads that need mounted volumes.
5. Use S3 for portable artifact access.
6. Use HDFS-style access only for analytics/data workloads that justify it.
7. Treat storage policy as part of space lifecycle governance.

## AGenNext takeaway

CubeFS fits Agent-Space as a large-scale, CNCF-aligned distributed storage layer when spaces need S3, POSIX, HDFS, and Kubernetes storage semantics together.