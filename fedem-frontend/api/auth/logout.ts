import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearSession } from '../_lib/auth.js';
import { assertSameOrigin, sendJson } from '../_lib/http.js';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    assertSameOrigin(request);
    clearSession(response);
    return sendJson(response, 200, { success: true });
  } catch {
    return sendJson(response, 403, { error: 'Request rejected.' });
  }
}