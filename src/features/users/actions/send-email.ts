'use server';

import { ADMIN_FROM_EMAIL, resendClient } from '@/libs/resend/resend-client';
import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

interface SendEmailParams {
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  adminId: string;
}

export async function sendEmailToUser({
  userId,
  userEmail,
  subject,
  message,
  adminId,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #374752; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 18px;">Listive</h2>
        </div>
        <div style="background: #f8fafb; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="white-space: pre-wrap; line-height: 1.6; color: #374752; font-size: 14px;">${escapeHtml(message)}</div>
        </div>
        <p style="color: #94a3b8; font-size: 11px; margin-top: 16px; text-align: center;">
          This email was sent from the Listive admin panel. Please do not reply directly.
        </p>
      </div>
    `;

    const { error } = await resendClient.emails.send({
      from: ADMIN_FROM_EMAIL,
      to: userEmail,
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error('[sendEmailToUser] Resend error:', error);
      return { success: false, error: error.message };
    }

    // Log admin action
    await supabaseAdminClient.from('admin_actions').insert({
      admin_id: adminId,
      action_type: 'email_sent',
      target_type: 'user',
      target_id: userId,
      details: { subject, to: userEmail },
    });

    return { success: true };
  } catch (err) {
    console.error('[sendEmailToUser] Error:', err);
    return { success: false, error: 'Failed to send email' };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
