import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { BlogPost } from '../../src/data/blogPosts.js';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, errorMessage, readBody, sendJson } from '../_lib/http.js';
import { deleteBlobImages, validatePost } from '../_lib/posts.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    assertSameOrigin(request);
    await ensureSchema();
    const idValue = Array.isArray(request.query.id) ? request.query.id[0] : request.query.id;
    const id = Number(idValue);
    if (!Number.isSafeInteger(id) || id <= 0) return sendJson(response, 400, { error: 'Invalid id.' });
    const sql = getSql();

    if (request.method === 'PUT') {
      await requireUser(request);
      const post = validatePost(readBody(request));
      if (post.id !== id) return sendJson(response, 400, { error: 'Post id mismatch.' });
      const currentRows = await sql.query(
        'SELECT data, version FROM blog_posts WHERE id = $1 LIMIT 1', [id],
      ) as Array<{ data: BlogPost; version: number }>;
      const current = currentRows[0];
      const requestedVersion = Number((post as BlogPost & { version?: number }).version ?? 0);
      if (current && requestedVersion && requestedVersion !== current.version) {
        return sendJson(response, 409, { error: 'Cet article a été modifié ailleurs. Rechargez-le avant de recommencer.' });
      }
      const nextVersion = (current?.version ?? 0) + 1;
      const now = new Date().toISOString();
      const saved = { ...post, createdAt: post.createdAt ?? now, updatedAt: now, version: nextVersion };
      await sql.query(
        `INSERT INTO blog_posts (id, data, published, version)
         VALUES ($1, $2::jsonb, $3, $4)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, published = EXCLUDED.published,
           version = EXCLUDED.version, updated_at = NOW()`,
        [id, JSON.stringify(saved), post.published !== false, nextVersion],
      );
      if (current) {
        const retained = new Set(post.images?.map((image) => image.src));
        await deleteBlobImages({ ...current.data, images: current.data.images?.filter((image) => !retained.has(image.src)) });
      }
      return sendJson(response, 200, { post: saved });
    }

    if (request.method === 'DELETE') {
      await requireUser(request, ['admin']);
      const rows = await sql.query('DELETE FROM blog_posts WHERE id = $1 RETURNING data', [id]) as Array<{ data: BlogPost }>;
      await deleteBlobImages(rows[0]?.data);
      return sendJson(response, 200, { success: true });
    }
    return sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    const message = errorMessage(error);
    return sendJson(response, /Authentication|Access denied/.test(message) ? 401 : 400, { error: message });
  }
}