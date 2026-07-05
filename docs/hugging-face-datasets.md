# Hugging Face Datasets — Agent-Space Reference

Source: https://huggingface.co/docs/hub/datasets-overview

## Role in Agent-Space

Hugging Face Datasets should be treated as a governed dataset source, public dataset publishing surface, and ML-ready data collaboration layer for Agent-Space.

Agent-Space already owns bounded workspaces for files, memory, channels, runs, permissions, environments, and artifacts. Datasets extend that boundary with explicit dataset identity, metadata, provenance, licensing, splits, preview, and loading contracts.

```txt
Dataset inside Agent-Space = Source + Metadata + License + Split + Viewer + Provenance + Access Policy + Runtime Binding
```

## What Hugging Face provides

The Hugging Face Hub hosts dataset repositories for a broad range of machine learning tasks, including NLP, computer vision, audio, translation, automatic speech recognition, and image classification.

Relevant Hub capabilities:

- Git-backed dataset repositories
- dataset cards through `README.md`
- Dataset Viewer / Data Studio for browser-based exploration
- support for public and private datasets
- metadata, tags, task/domain discovery, and licensing context
- programmatic loading through the `datasets` library
- streaming access for datasets too large to fit locally
- integration with model cards through dataset metadata

## Agent-Space product interpretation

Hugging Face Datasets should not become the storage authority for Agent-Space.

Instead:

```txt
Hugging Face Dataset = external/public/collaborative dataset surface
Agent-Space = governed workspace boundary and policy authority
```

Agent-Space should store references, policy, provenance, classification, and lifecycle state. The dataset itself may live on Hugging Face, RustFS, CubeFS, S3-compatible storage, local filesystem, or another backend.

## Dataset source contract

Add `dataset` as a first-class `SpaceSource` type.

```yaml
space_source:
  id: source:hf-dataset-example
  space_id: space:agent-research-lab
  type: dataset
  provider: huggingface
  reference: hf://datasets/org-or-user/dataset-name
  visibility: public | private | gated
  license: apache-2.0 | mit | cc-by-4.0 | other | unknown
  card_required: true
  viewer_supported: true
  streaming_supported: true
  policy_id: policy:dataset-access
  provenance_required: true
```

## Dataset artifact contract

Datasets can also be outputs of agent runs.

```yaml
space_artifact:
  id: artifact:dataset-example
  space_id: space:agent-research-lab
  run_id: run:curation-example
  type: dataset
  provider: huggingface | rustfs | cubefs | s3 | local
  storage_ref: hf://datasets/org/dataset | s3://bucket/key | cubefs://volume/path
  dataset_card_ref: README.md
  splits:
    - train
    - validation
    - test
  provenance: required
  retention_class: draft | active | archive | legal-hold
```

## Required metadata

Every dataset attached to a space should capture:

- dataset identifier
- source provider
- owner / publisher
- license
- visibility: public, private, or gated
- task/domain tags
- dataset card URL or repository path
- split names
- file formats
- data classification
- PII/sensitive-data assessment
- intended use
- prohibited use
- citation requirement
- provenance chain
- retention policy

## Governance rules

Agent-Space should enforce these rules before a dataset is used by an agent:

1. No dataset can be loaded without a `space_id`.
2. No private or gated dataset can be accessed without an explicit policy grant.
3. No dataset can be used for training, evaluation, benchmarking, or publishing unless license metadata exists.
4. No generated dataset can be published publicly without a dataset card.
5. No production secret, customer record, or restricted source can be exported to a public dataset repository.
6. Every dataset load, stream, transform, export, and publish action must generate an audit event.

## Product milestones

### D0 — Dataset reference model

- Add `dataset` to `SpaceSource.type`.
- Add Hugging Face provider reference format: `hf://datasets/{owner}/{name}`.
- Add required metadata fields for license, card, visibility, and provenance.

### D1 — Dataset intake

- Attach existing Hugging Face dataset to a space.
- Validate dataset card existence.
- Capture license, splits, viewer availability, and source URL.
- Store dataset reference without copying data.

### D2 — Dataset runtime binding

- Allow an agent run to load a dataset only through an active space.
- Support streaming mode for large datasets.
- Emit audit events for load, stream, sample, and transform.

### D3 — Dataset publishing

- Publish demo-safe or research-safe datasets from a space to Hugging Face.
- Generate dataset card templates.
- Block publish when license, provenance, or sensitivity checks fail.

### D4 — Dataset viewer integration

- Surface Hugging Face Dataset Viewer / Data Studio links inside the Agent-Space console.
- Show split summaries, sample rows, schema, and file formats where available.

### D5 — Dataset governance

- Add approval gate for public dataset publishing.
- Add retention policy for derived datasets.
- Add lineage view from source dataset → run → derived artifact → published dataset.

## Console UX

Add a `Datasets` tab inside each space.

Minimum view:

```txt
Space
 ├─ Overview
 ├─ Members
 ├─ Sources
 ├─ Datasets
 │   ├─ Attached datasets
 │   ├─ Dataset cards
 │   ├─ Splits
 │   ├─ Licenses
 │   ├─ Viewer links
 │   ├─ Runtime bindings
 │   └─ Publish approvals
 ├─ Runs
 ├─ Artifacts
 └─ Audit
```

## API additions

```txt
POST   /spaces/{space_id}/datasets
GET    /spaces/{space_id}/datasets
GET    /spaces/{space_id}/datasets/{dataset_id}
PATCH  /spaces/{space_id}/datasets/{dataset_id}
POST   /spaces/{space_id}/datasets/{dataset_id}/validate
POST   /spaces/{space_id}/datasets/{dataset_id}/bind-runtime
POST   /spaces/{space_id}/datasets/{dataset_id}/publish
GET    /spaces/{space_id}/datasets/{dataset_id}/lineage
```

## Non-goals

Agent-Space should not become a Hugging Face clone.

Non-goals:

- replacing Hugging Face Hub
- owning model hosting
- owning the `datasets` Python library
- copying all datasets into Agent-Space by default
- bypassing dataset license or gated access terms

## Product rule

```txt
Datasets may live anywhere.
Agent-Space decides whether they are allowed inside the work boundary.
```
