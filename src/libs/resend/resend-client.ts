import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('[Resend] RESEND_API_KEY not set — email features will be disabled');
}

export const resendClient = new Resend(process.env.RESEND_API_KEY || '');

export const ADMIN_FROM_EMAIL = 'Listive Admin <admin@listive.app>';
export const SUPPORT_FROM_EMAIL = 'Listive Support <support@listive.app>';
