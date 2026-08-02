import { randomUUID } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { Inquiry } from '../../src/data/adminTypes.js';
import { fingerprint, requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, clientIp, errorMessage, readBody, sendJson } from '../_lib/http.js';

interface InquiryBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string;
}

interface InquiryRow {
  id: string;
  type: 'message' | 'membership';
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'processed';
  response_text: string | null;
  response_sent: boolean;
  created_at: string;
  updated_at: string;
}

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    status: row.status,
    responseText: row.response_text ?? '',
    responseSent: row.response_sent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    await ensureSchema();
    const sql = getSql();
    if (request.method === 'POST') {
      assertSameOrigin(request);
      const body = readBody<InquiryBody>(request);
      if (body.website) return sendJson(response, 200, { success: true });
      const name = body.name?.trim() ?? '';
      const email = body.email?.trim().toLowerCase() ?? '';
      const subject = body.subject?.trim() ?? '';
      const message = body.message?.trim() ?? '';
      if (name.length < 2 || name.length > 120 || !/^\S+@\S+\.\S+$/.test(email) || subject.length < 2 || subject.length > 120 || message.length < 10 || message.length > 5000) {
        return sendJson(response, 400, { error: 'Veuillez vérifier les informations saisies.' });
      }
      const ipFingerprint = fingerprint(clientIp(request));
      await sql.query("DELETE FROM inquiry_attempts WHERE created_at < NOW() - INTERVAL '1 day'");
      const attempts = await sql.query(
        "SELECT COUNT(*)::int AS count FROM inquiry_attempts WHERE fingerprint = $1 AND created_at > NOW() - INTERVAL '1 hour'",
        [ipFingerprint],
      ) as Array<{ count: number }>;
      if ((attempts[0]?.count ?? 0) >= 5) return sendJson(response, 429, { error: 'Trop de demandes. Réessayez plus tard.' });
      const type = subject.toLowerCase().includes('adhésion') || subject.toLowerCase().includes('adhesion') ? 'membership' : 'message';
      const id = randomUUID();
      await sql.query(
        `INSERT INTO inquiries (id, type, name, email, subject, message)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [id, type, name, email, subject, message],
      );
      await sql.query('INSERT INTO inquiry_attempts (fingerprint) VALUES ($1)', [ipFingerprint]);
      return sendJson(response, 201, { success: true, id });
    }
    if (request.method === 'GET') {
      await requireUser(request);
      const status = typeof request.query.status === 'string' ? request.query.status : '';
      const type = typeof request.query.type === 'string' ? request.query.type : '';
      const clauses: string[] = [];
      const values: string[] = [];
      if (['new', 'in_progress', 'processed'].includes(status)) { values.push(status); clauses.push(`status = $${values.length}`); }
      if (['message', 'membership'].includes(type)) { values.push(type); clauses.push(`type = $${values.length}`); }
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
      const rows = await sql.query(
        `SELECT id, type, name, email, subject, message, status, response_text, response_sent, created_at, updated_at
         FROM inquiries ${where} ORDER BY created_at DESC LIMIT 500`,
        values,
      ) as InquiryRow[];
      return sendJson(response, 200, { inquiries: rows.map(mapInquiry) });
    }
    return sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}