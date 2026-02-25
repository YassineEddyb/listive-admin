# Credit Management

> Manage credit balances, view transactions, and perform manual adjustments.

## Credits Page (`/admin/credits`)

Three-tab layout:

### Tab 1: Credit Balances
- Table of all users with their current credit balance
- Sortable by balance, user, date

### Tab 2: Transaction History
- Full transaction log across all users
- Columns: user, amount, type, description, reference, date
- Transaction types: `purchase`, `usage`, `refund`, `bonus`, `subscription`

### Tab 3: Credit Purchases
- All credit purchase records
- Columns: user, amount paid, credits received, status, date

## Manual Credit Adjustment

The `CreditAdjustmentForm` allows admins to:
1. Select a user
2. Choose add or deduct
3. Enter amount and reason
4. Submit → updates `user_credits` + creates `credit_transaction` + logs to `admin_actions`

All adjustments create an audit trail entry with the admin user, action type `adjust_credits`, and the amount/reason in the payload.

## Implementation

| File | Purpose |
|------|---------|
| `src/features/credits/controllers/get-transactions.ts` | Fetch balances, transactions, purchases |
| `src/features/credits/components/credit-balances-table.tsx` | Balance table |
| `src/features/credits/components/transaction-table.tsx` | Transaction history table |
| `src/features/credits/components/credit-adjustment-form.tsx` | Manual adjustment form |
| `src/features/credits/actions/adjust-credits-action.ts` | Credit adjustment server action |
