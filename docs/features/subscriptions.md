# Subscription Management

> View and manage all platform subscriptions.

## Subscriptions Page (`/admin/subscriptions`)

- Data table with all subscriptions
- Columns: user, plan name, status, billing period, amount, start date, end date
- Status badges: `active`, `trialing`, `canceled`, `past_due`, `revoked`
- CSV export

## Actions

- **Cancel Subscription** — marks subscription as canceled
- All actions logged to audit trail

## Implementation

| File | Purpose |
|------|---------|
| `src/features/subscriptions/controllers/get-subscriptions.ts` | Fetch all subscriptions with plan data |
| `src/features/subscriptions/components/subscription-table.tsx` | Data table |
| `src/features/subscriptions/components/subscription-actions.tsx` | Action buttons |
| `src/features/subscriptions/actions/subscription-actions.ts` | Mutation server actions |
