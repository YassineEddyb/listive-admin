# Listive Admin — Documentation Hub

> **Single source of truth for the Listive Admin Panel codebase.**
>
> Listive Admin is the internal admin panel for the Listive platform. It provides full operational visibility into users, subscriptions, credits, products, images, support tickets, feedback, webhooks, and third-party integrations.

---

## Quick Navigation

| Section | Description |
|---------|-------------|
| [Project](project/vision.md) | Vision and technology choices |
| [Architecture](architecture/overview.md) | System design, folder structure, database |
| [Features](features/dashboard.md) | Per-feature deep dives |
| [Design System](design-system/components.md) | UI components, tokens, and patterns |
| [Standards](standards/coding-rules.md) | Code conventions, Git workflow, performance |
| [Context](context/known-issues.md) | Known issues and architectural decisions |
| [BLUEPRINT](../BLUEPRINT.md) | Master index at project root |

---

## Documentation Structure

```
docs/
├── README.md                     ← You are here
├── project/
│   ├── vision.md                 — Product vision & goals
│   └── tech-stack.md             — Complete technology inventory
├── architecture/
│   ├── overview.md               — System architecture & data flow
│   ├── folder-structure.md       — Source tree map with annotations
│   └── database.md               — Admin tables, views, functions, migrations
├── features/
│   ├── dashboard.md              — Dashboard home & KPIs
│   ├── auth.md                   — Authentication & admin guard
│   ├── users.md                  — User management & timeline
│   ├── subscriptions.md          — Subscription management
│   ├── credits.md                — Credit management & adjustments
│   ├── products.md               — Product & image management
│   ├── support.md                — Support tickets & replies
│   ├── feedback.md               — Feedback management
│   ├── integrations.md           — Polar.sh & Resend dashboards
│   ├── system.md                 — System health & settings
│   └── search.md                 — Global search
├── design-system/
│   ├── components.md             — Component inventory
│   ├── tokens.md                 — Colors, typography, shadows, animations
│   └── patterns.md               — Recurring UI & code patterns
├── standards/
│   ├── coding-rules.md           — TypeScript, React, naming conventions
│   ├── git-workflow.md           — Branching, commits, deployment
│   └── performance.md            — Optimization rules & techniques
└── context/
    ├── known-issues.md           — Bugs & technical debt tracker
    └── decisions.md              — Architectural decision log
```

---

## For New Developers

1. Read [Vision](project/vision.md) to understand what we're building
2. Read [Tech Stack](project/tech-stack.md) for the tools we use
3. Read [Architecture Overview](architecture/overview.md) for how everything fits together
4. Read [Folder Structure](architecture/folder-structure.md) to navigate the source tree
5. Read [Coding Rules](standards/coding-rules.md) before writing code
6. Browse [Features](features/dashboard.md) for the area you'll be working on

## For AI Assistants

Start with [BLUEPRINT.md](../BLUEPRINT.md) at the project root. It contains the master index with inline summaries of every section. From there, drill into any specific documentation file for full details.

---

*Last updated: February 2026*
