// lib/emailResend.ts
import { Resend } from 'resend';
import { renderHtml } from './renderHtml';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function sendVerificationEmail(to: string, link: string, type: string) {
  return await resend.emails.send({
    from: `no-reply@${process.env.NEXT_PUBLIC_EMAIL_URL}`,
    to,
    subject: 'Verifica tu correo electrónico',
    html: renderHtml(link, type),
  });
}
