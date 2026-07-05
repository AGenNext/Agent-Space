# Hugging Face Spaces for Agent-Space

Hugging Face Spaces are lightweight hosted workspaces for publishing ML demos, agent demos, portfolio apps, research prototypes, and stakeholder-facing interfaces.

For AGenNext, a Hugging Face Space is not just a demo page. It is an external execution and presentation surface that must be attached to an explicit Agent-Space boundary.

## Why this matters

Agent-Space defines where work belongs, who can access it, which files and memory are in scope, and what governance boundaries apply.

Hugging Face Spaces provide a practical way to expose bounded demos without turning the core platform into a public runtime by default.

## Supported Space modes

Hugging Face Spaces can be created in several modes:

| Mode | Use in AGenNext |
|---|---|
| Gradio | Fast Python demos for agents, tools, model interaction, workflows, and evaluation views. |
| Docker | Full custom runtime when a demo needs system packages, custom services, or non-standard app servers. |
| Static HTML | Lightweight landing pages, dashboards, explainers, and static portfolio surfaces. |
| Custom Python | Python apps beyond the default Gradio workflow. |

## Agent-Space mapping

Every external Hugging Face Space should map back to an Agent-Space record.

```txt
Hugging Face Space
  ↓
External demo/runtime surface
  ↓
Agent-Space boundary
  ↓
Files, memory, channels, runs, policies, and lifecycle metadata
  ↓
Agent-Platform governance
```

## Recommended metadata contract

Each published Space should declare:

```yaml
agent_space:
  id: space:huggingface-demo
  owner: AGenNext
  surface: huggingface-space
  visibility: public-demo
  sdk: gradio | docker | static | python
  governance:
    policy_required: true
    secrets_allowed: false
    production_data_allowed: false
    human_review_required: true
  lifecycle:
    status: draft | active | archived
```

## Repository structure

Recommended layout for Spaces-related assets:

```txt
docs/
  hugging-face-spaces.md
spaces/
  gradio-demo/
    README.md
    app.py
    requirements.txt
  docker-demo/
    README.md
    Dockerfile
    app/
  static-demo/
    index.html
    README.md
.github/
  workflows/
    sync-huggingface-space.yml
```

## GitHub Actions integration

Hugging Face Spaces can be managed from GitHub Actions by mirroring a folder or branch into the Space repository.

Recommended use cases:

- publish demo apps from this repo to Hugging Face
- keep Space README and app files versioned in GitHub
- run validation before pushing demo code
- prevent accidental publication of secrets or production data

## Governance rules

1. No agent demo should be published without a mapped Agent-Space.
2. No production secrets should be stored in demo code.
3. No customer or production data should be committed to a Space.
4. Public Spaces should default to demo-safe datasets and mocked integrations.
5. Docker Spaces should be reviewed before publishing because they can host arbitrary runtimes.
6. GPU-backed Spaces should be explicitly tagged because they introduce cost and capacity implications.

## When to use Hugging Face Spaces

Use Hugging Face Spaces when the goal is to:

- showcase an agent workflow
- publish an ML or research demo
- present a portfolio artifact
- share a stakeholder demo
- run a lightweight public interface
- test Gradio, Docker, static, or Python app surfaces

Do not use Hugging Face Spaces as the default production runtime for governed enterprise workflows.

## Canonical references

- Hugging Face Spaces overview: https://huggingface.co/spaces
- Gradio: https://gradio.app/
- Spaces documentation: https://huggingface.co/docs/hub/spaces
- Spaces GPU upgrades: https://huggingface.co/docs/hub/spaces-gpus
- Managing Spaces with GitHub Actions: https://huggingface.co/docs/hub/spaces-github-actions
