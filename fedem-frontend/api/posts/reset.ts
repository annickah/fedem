import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { BlogPost } from '../../src/data/blogPosts.js';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, errorMessage, sendJson } from '../_lib/http.js';
import { deleteBlobImages, initialPosts } from '../_lib/posts.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    assertSameOrigin(request);
    await requireUser(request, ['admin']);
    await ensureSchema();
    const sql = getSql();
    const rows = await sql.query('SELECT data FROM blog_posts') as Array<{ data: BlogPost }>;
    await Promise.all(rows.map((row) => deleteBlobImages(row.data)));
    await sql.query('DELETE FROM blog_posts');
    await Promise.all(
      initialPosts.map((post) => sql.query(
        'INSERT INTO blog_posts (id, data, published) VALUES ($1, $2::jsonb, $3)',
        [post.id, JSON.stringify(post), post.published !== false],
      )),
    );
    await sql.query(
      `INSERT INTO cms_settings (key, value) VALUES ('cms', '{"initialized":true}'::jsonb)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    );
    return sendJson(response, 200, { posts: initialPosts });
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}