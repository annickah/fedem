import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { DashboardMetrics } from '../../src/data/adminTypes.js';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { errorMessage, sendJson } from '../_lib/http.js';
import { getSiteSettings } from '../_lib/settings.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    await requireUser(request);
    await ensureSchema();
    const [counts, settings] = await Promise.all([
      getSql().query(`SELECT
        (SELECT COUNT(*)::int FROM inquiries WHERE type = 'membership') AS membership_requests,
        (SELECT COUNT(*)::int FROM blog_posts WHERE published = TRUE) AS published_articles,
        (SELECT COUNT(*)::int FROM inquiries WHERE type = 'message' AND status != 'processed') AS pending_messages,
        (SELECT COUNT(*)::int FROM inquiries) AS total_inquiries`),
      getSiteSettings(),
    ]);
    const row = counts[0] as Record<string, number>;
    const metrics: DashboardMetrics = {
      memberCount: settings.memberCount,
      membershipRequests: row.membership_requests ?? 0,
      publishedArticles: row.published_articles ?? 0,
      pendingMessages: row.pending_messages ?? 0,
      totalInquiries: row.total_inquiries ?? 0,
    };
    return sendJson(response, 200, { metrics });
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}