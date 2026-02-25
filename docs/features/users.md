# User Management

> View, search, and manage all platform users.

## User List (`/admin/users`)

- Paginated data table with sorting and search
- Columns: avatar, name, email, plan, credit balance, product count, status, joined date
- CSV export via `ExportButton`
- Data source: `admin_users_view` (Supabase view joining users, auth, credits, subscriptions)

## User Detail (`/admin/users/[id]`)

### Profile Section
- Avatar, full name, email
- Subscription status and plan name
- Credit balance
- Product count
- Onboarding status
- Account creation date

### Actions
- **Edit Profile** — dialog to update name, email
- **Send Email** — compose and send email via Resend
- **Adjust Credits** — add/deduct credits with reason (redirects to credits page)

### User Timeline
Chronological activity feed showing:
- Account creation
- Subscription changes
- Credit transactions
- Product creation
- Support tickets opened

## Implementation

| File | Purpose |
|------|---------|
| `src/features/users/controllers/get-users.ts` | Fetch user list from `admin_users_view` |
| `src/features/users/controllers/get-user-detail.ts` | Fetch single user with related data |
| `src/features/users/controllers/get-user-timeline.ts` | Build chronological activity feed |
| `src/features/users/components/users-table.tsx` | Data table with columns |
| `src/features/users/components/user-actions.tsx` | Action buttons on detail page |
| `src/features/users/components/edit-profile-dialog.tsx` | Profile edit dialog |
| `src/features/users/components/send-email-dialog.tsx` | Email compose dialog |
| `src/features/users/components/user-timeline.tsx` | Activity timeline |
| `src/features/users/actions/user-actions.ts` | User mutation actions |
| `src/features/users/actions/update-profile-action.ts` | Profile update server action |
| `src/features/users/actions/send-email.ts` | Email sending via Resend |
