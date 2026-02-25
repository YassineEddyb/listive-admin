# Product Vision

## What Is Listive Admin?

Listive Admin is the **internal admin panel** for the Listive platform. It provides full operational visibility and management capabilities for platform administrators, including:

- **User management** — view all users, edit profiles, send emails, track activity timelines
- **Financial oversight** — subscriptions, credits, transactions, manual adjustments
- **Content management** — products, images, templates, marketplace listings
- **Support operations** — ticket queue, priority management, admin replies
- **System monitoring** — health checks, webhook logs, audit trail
- **Integration dashboards** — Polar.sh and Resend API visibility

The core value proposition: **every platform operation that previously required direct database access is now a few clicks away in a clean, purpose-built interface.**

---

## Target Users

| Segment | Need |
|---------|------|
| Platform administrators | Full visibility into all user data and platform metrics |
| Support operators | Manage support tickets, reply to users, adjust credits |
| Business owners | Revenue metrics, subscription trends, user growth |
| Developers | System health, webhook logs, integration status |

---

## Core Principles

### 1. Read Everything, Write Carefully
The admin panel has full read access to all platform data via `service_role`. Write operations are limited to specific actions (credit adjustments, ticket replies, status updates) and every mutation is logged to the audit trail.

### 2. Cookie Isolation
The admin panel runs on the same Supabase database as the main Listive app but uses a separate auth cookie (`sb-admin-auth-token`) to prevent session conflicts. An admin can be logged into both the app and the admin panel simultaneously.

### 3. Double Guard Authorization
Access requires both a valid Supabase session AND a row in the `admin_users` table. Having a Supabase account alone is not sufficient — admin access must be explicitly granted.

### 4. Audit Everything
Every admin mutation (credit adjustment, ticket reply, status change, admin access grant/revoke) is recorded in the `admin_actions` table with who, what, when, and the full payload diff.

---

## Relationship to Main App

| Aspect | Main Listive App | Listive Admin |
|--------|-----------------|---------------|
| **Purpose** | User-facing product platform | Internal operations panel |
| **Port** | 3000 | 3005 |
| **Auth cookie** | `sb-auth-token` | `sb-admin-auth-token` |
| **Supabase client** | Anon key + service role | Primarily service role |
| **RLS** | Enforced (users see own data) | Bypassed (admins see all data) |
| **Deployment** | Netlify | Netlify |

---

*See [Tech Stack](tech-stack.md) for the complete technology inventory.*
