import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { BlogPost } from '../../src/data/blogPosts.js';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, errorMessage, readBody, sendJson } from '../_lib/http.js';
import { cmsInitialized, initialPosts, seedPosts, validatePost } from '../_lib/posts.js';

interface PostRow {
  data: BlogPost;
  published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

function mapRow(row: PostRow): BlogPost {
  return {
    ...row.data,
    published: row.published,
    createdAt: row.data.createdAt ?? row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
  } as BlogPost & { version: number };
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    await ensureSchema();
    const sql = getSql();
    if (request.method === 'GET') {
      const all = request.query.all === '1';
      if (all) await requireUser(request);
      if (!(await cmsInitialized())) {
        return sendJson(response, 200, {
          posts: all ? initialPosts : initialPosts.filter((post) => post.published !== false),
        });
      }
      const rows = await sql.query(
        all
          ? 'SELECT data, published, version, created_at, updated_at FROM blog_posts ORDER BY updated_at DESC, id DESC'
          : 'SELECT data, published, version, created_at, updated_at FROM blog_posts WHERE published = TRUE ORDER BY updated_at DESC, id DESC',
      ) as PostRow[];
      return sendJson(response, 200, { posts: rows.map(mapRow) });
    }

    if (request.method === 'POST') {
      assertSameOrigin(request);
      await requireUser(request);
      await seedPosts();
      const post = validatePost(readBody(request));
      const now = new Date().toISOString();
      const saved = { ...post, createdAt: post.createdAt ?? now, updatedAt: now, version: 1 };
      await sql.query(
        `INSERT INTO blog_posts (id, data, published, version)
         VALUES ($1, $2::jsonb, $3, 1)
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, published = EXCLUDED.published,
           version = blog_posts.version + 1, updated_at = NOW()`,
        [post.id, JSON.stringify(saved), post.published !== false],
      );
      return sendJson(response, 200, { post: saved });
    }
    return sendJson(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    const message = errorMessage(error);
    return sendJson(response, /Authentication|Access denied/.test(message) ? 401 : 400, { error: message });
  }
}