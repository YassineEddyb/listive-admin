# Feedback Management

> Review and manage user feedback submissions.

## Feedback List (`/admin/feedback`)

- Data table of all feedback submissions
- Columns: feedback ID, title, type, user, status, rating, created date
- Types: `feature` (feature request), `bug` (bug report), `general` (general feedback)
- Status badges: `submitted`, `under_review`, `planned`, `implemented`, `declined`

## Feedback Detail (`/admin/feedback/[id]`)

- Full feedback description
- User info, submission date
- Category tags, severity (bugs), priority (features), rating (general)
- `can_follow_up` flag — whether user is open to follow-up
- **Status Control** — admin can review and change status through the workflow

## Review Workflow

```
submitted → under_review → planned → implemented
                        ↘ declined
```

All status changes logged to audit trail.

## Implementation

| File | Purpose |
|------|---------|
| `src/features/feedback/controllers/get-feedback.ts` | Fetch all feedback |
| `src/features/feedback/components/feedback-table.tsx` | Data table |
| `src/features/feedback/components/feedback-status-control.tsx` | Status control |
| `src/features/feedback/actions/update-feedback-action.ts` | Status update action |
