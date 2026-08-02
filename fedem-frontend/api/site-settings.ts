import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from './_lib/auth.js';
import { getSql } from './_lib/db.js';
import { assertSameOrigin, errorMessage, readBody, sendJson } from './_lib/http.js';
import { getSiteSettings, validateSiteSettings } from './_lib/settings.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    if (request.method === 'GET') {
      response.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return response.status(200).json({ settings: await getSiteSettings() });
    }
    if (request.method === 'PUT') {
      assertSameOrigin(request);
      await requireUser(request);
      const settings = validateSiteSettings(readBody(request));
      await getSql().query(
        `INSERT INTO cms_settings (key, value) VALUES ('site', $1::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [JSON.stringify(settings)],
      );
      return sendJson(response, 200, { settings });
    }
    return sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}