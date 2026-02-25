import { resendClient } from '@/libs/resend/resend-client';

export interface ResendEmail {
  id: string;
  to: string;
  from: string;
  subject: string;
  status: string;
  created_at: string;
  last_event: string;
}

export interface ResendDomain {
  id: string;
  name: string;
  status: string;
  region: string;
  created_at: string;
}

export interface ResendMetrics {
  total_sent: number;
  delivered: number;
  bounced: number;
  complained: number;
  domains: number;
}

/**
 * Fetch recent emails from Resend.
 */
export async function getResendEmails(limit = 50): Promise<ResendEmail[]> {
  try {
    const result = await resendClient.emails.list();
    const emails = result.data?.data || [];

    return emails.slice(0, limit).map((email: any) => ({
      id: email.id || '',
      to: Array.isArray(email.to) ? email.to.join(', ') : email.to || '',
      from: email.from || '',
      subject: email.subject || '',
      status: email.last_event || email.status || 'sent',
      created_at: email.created_at || '',
      last_event: email.last_event || '',
    }));
  } catch (err: any) {
    console.error('[getResendEmails] Error:', err?.message || err);
    return [];
  }
}

/**
 * Fetch domains from Resend.
 */
export async function getResendDomains(): Promise<ResendDomain[]> {
  try {
    const result = await resendClient.domains.list();
    const domains = result.data?.data || [];

    return domains.map((domain: any) => ({
      id: domain.id || '',
      name: domain.name || '',
      status: domain.status || 'unknown',
      region: domain.region || '',
      created_at: domain.created_at || '',
    }));
  } catch (err: any) {
    console.error('[getResendDomains] Error:', err?.message || err);
    return [];
  }
}

/**
 * Compute aggregate email metrics.
 */
export async function getResendMetrics(): Promise<ResendMetrics> {
  try {
    const [emails, domains] = await Promise.all([
      getResendEmails(200),
      getResendDomains(),
    ]);

    const delivered = emails.filter((e) => e.status === 'delivered').length;
    const bounced = emails.filter((e) => e.status === 'bounced').length;
    const complained = emails.filter((e) => e.status === 'complained').length;

    return {
      total_sent: emails.length,
      delivered,
      bounced,
      complained,
      domains: domains.length,
    };
  } catch (err: any) {
    console.error('[getResendMetrics] Error:', err?.message || err);
    return {
      total_sent: 0,
      delivered: 0,
      bounced: 0,
      complained: 0,
      domains: 0,
    };
  }
}
