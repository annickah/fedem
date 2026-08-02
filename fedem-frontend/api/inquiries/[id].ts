import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, errorMessage, readBody, sendJson } from '../_lib/http.js';

interface UpdateBody {
  status?: 'new' | 'in_progress' | 'processed';
  responseText?: string;
  sendReply?: boolean;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'PUT') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    assertSameOrigin(request);
    await requireUser(request);
    await ensureSchema();
    const id = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
    if (!id) return sendJson(response, 400, { error: 'Invalid id.' });
    const body = readBody<UpdateBody>(request);
    const status = body.status && ['new', 'in_progress', 'processed'].includes(body.status) ? body.status : 'in_progress';
    const responseText = body.responseText?.trim().slice(0, 10000) ?? '';
    const sql = getSql();
    const rows = await sql.query(
      'SELECT email, name, subject FROM inquiries WHERE id = $1 LIMIT 1', [id],
    ) as Array<{ email: string; name: string; subject: string }>;
    if (!rows[0]) return sendJson(response, 404, { error: 'Demande introuvable.' });
    let responseSent = false;
    if (body.sendReply && responseText && process.env.RESEND_API_KEY && process.env.REPLY_FROM_EMAIL) {
      const mailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.REPLY_FROM_EMAIL,
          to: [rows[0].email],
          subject: `Réponse FEDEM : ${rows[0].subject}`,
          html: `<p>Bonjour ${escapeHtml(rows[0].name)},</p><p>${escapeHtml(responseText).replace(/\n/g, '<br>')}</p><p>Cordialement,<br>FEDEM Madagascar</p>`,
        }),
      });
      responseSent = mailResponse.ok;
    }
    await sql.query(
      `UPDATE inquiries SET status = $2, response_text = $3, response_sent = $4, updated_at = NOW()
       WHERE id = $1`,
      [id, status, responseText || null, responseSent],
    );
    return sendJson(response, 200, { success: true, responseSent });
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}