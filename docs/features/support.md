# Support Tickets

> Manage user support requests and admin replies.

## Ticket Queue (`/admin/support`)

- Data table of all support tickets
- Columns: ticket ID, subject, user, category, status, priority, created date
- Filterable by status and priority
- Status badges: `open` (red), `in_progress` (yellow), `resolved` (green), `closed` (gray)

## Ticket Detail (`/admin/support/[id]`)

### Ticket Information
- Subject, description, category
- User info (email, name)
- Product reference (if linked)
- Timestamps: created, updated, resolved

### Controls
- **Status Control** — dropdown to change status (open → in_progress → resolved → closed)
- **Priority Control** — dropdown to change priority (low, normal, high, urgent)
- Status/priority changes logged to audit trail

### Reply System
- Admin can reply to tickets via `TicketReplyForm`
- Replies stored in `ticket_replies` table
- Each reply linked to the admin user who wrote it
- Users can see admin replies on their own tickets (RLS policy)

## Implementation

| File | Purpose |
|------|---------|
| `src/features/support/controllers/get-tickets.ts` | Fetch all tickets with replies |
| `src/features/support/components/ticket-table.tsx` | Ticket queue table |
| `src/features/support/components/ticket-status-control.tsx` | Status dropdown |
| `src/features/support/components/ticket-priority-control.tsx` | Priority dropdown |
| `src/features/support/components/ticket-reply-form.tsx` | Reply form |
| `src/features/support/actions/update-ticket-action.ts` | Status/priority update |
| `src/features/support/actions/ticket-reply-action.ts` | Reply submission |
