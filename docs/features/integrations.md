# Integrations

> Third-party service dashboards for Polar.sh and Resend.

## Integrations Page (`/admin/integrations`)

Tabbed interface with one tab per integration:

### Polar.sh Tab

Data fetched directly from the Polar.sh API via `@polar-sh/sdk`:

| Section | Data | SDK Method |
|---------|------|------------|
| Orders | Recent orders, amounts, statuses | `polar.orders.list()` |
| Customers | Customer list with emails | `polar.customers.list()` |
| Subscriptions | Active subscriptions | `polar.subscriptions.list()` |
| Metrics | Revenue metrics, MRR | Computed from orders/subscriptions |

### Resend Tab

Data fetched from the Resend API via `resend` SDK:

| Section | Data | SDK Method |
|---------|------|------------|
| Recent Emails | Last 100 sent emails | `resend.emails.list()` |
| Domains | Domain verification status | `resend.domains.list()` |
| Metrics | Delivery rates, bounce rates | Computed from email statuses |

## From Addresses

| Address | Purpose |
|---------|---------|
| `admin@listive.app` | Admin notifications |
| `support@listive.app` | Support ticket replies |

## Implementation

| File | Purpose |
|------|---------|
| `src/features/integrations/controllers/get-polar-data.ts` | Polar API calls |
| `src/features/integrations/controllers/get-resend-data.ts` | Resend API calls |
| `src/libs/polar/polar-client.ts` | Polar SDK client (sandbox/production toggle) |
| `src/libs/resend/resend-client.ts` | Resend client + from address constants |
