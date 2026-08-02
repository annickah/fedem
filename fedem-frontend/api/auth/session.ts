import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from '../_lib/auth.js';
import { sendJson } from '../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    const user = await requireUser(request);
    return sendJson(response, 200, { authenticated: true, user: { email: user.email, role: user.role } });
  } catch {
    return sendJson(response, 401, { authenticated: false });
  }
}