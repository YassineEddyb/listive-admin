import { Badge } from '@/components/ui/badge';

type StatusVariant =
  | 'active'
  | 'trialing'
  | 'canceled'
  | 'paused'
  | 'past_due'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'revoked'
  | 'open'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'submitted'
  | 'under_review'
  | 'planned'
  | 'implemented'
  | 'declined'
  | 'completed';

const statusLabels: Record<string, string> = {
  active: 'Active',
  trialing: 'Trialing',
  canceled: 'Canceled',
  paused: 'Paused',
  past_due: 'Past Due',
  incomplete: 'Incomplete',
  incomplete_expired: 'Expired',
  unpaid: 'Unpaid',
  revoked: 'Revoked',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  submitted: 'Submitted',
  under_review: 'Under Review',
  planned: 'Planned',
  implemented: 'Implemented',
  declined: 'Declined',
  completed: 'Completed',
  // Generation / Image statuses
  pending: 'Pending',
  partial: 'Partial',
  failed: 'Failed',
  generating: 'Generating',
  archived: 'Archived',
  processing: 'Processing',
  success: 'Success',
};

const statusVariantMap: Record<string, 'active' | 'trialing' | 'canceled' | 'paused' | 'past_due' | 'revoked' | 'info' | 'warning' | 'success' | 'destructive' | 'default'> = {
  active: 'active',
  trialing: 'trialing',
  canceled: 'canceled',
  paused: 'paused',
  past_due: 'past_due',
  incomplete: 'warning',
  incomplete_expired: 'canceled',
  unpaid: 'destructive',
  revoked: 'revoked',
  open: 'info',
  in_progress: 'trialing',
  resolved: 'success',
  closed: 'canceled',
  submitted: 'info',
  under_review: 'warning',
  planned: 'trialing',
  implemented: 'success',
  declined: 'destructive',
  completed: 'success',
  // Generation / Image statuses
  pending: 'warning',
  partial: 'warning',
  failed: 'destructive',
  generating: 'trialing',
  archived: 'canceled',
  processing: 'trialing',
  success: 'success',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status] || 'default';
  const label = statusLabels[status] || status;

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
