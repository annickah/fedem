import { del } from '@vercel/blob';
import type { BlogPost } from '../../src/data/blogPosts.js';
import { blogPosts } from '../../src/data/blogPosts.js';
import { ensureSchema, getSql } from './db.js';

export const initialPosts = blogPosts.map((post) => ({ ...post, published: post.published ?? true }));

function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function cmsInitialized() {
  await ensureSchema();
  const rows = await getSql().query("SELECT value FROM cms_settings WHERE key = 'cms' LIMIT 1") as Array<{ value: { initialized?: boolean } }>;
  return rows[0]?.value?.initialized === true;
}

export async function seedPosts() {
  if (await cmsInitialized()) return;
  const sql = getSql();
  await Promise.all(
    initialPosts.map((post) => sql.query(
      `INSERT INTO blog_posts (id, data, published)
       VALUES ($1, $2::jsonb, $3)
       ON CONFLICT (id) DO NOTHING`,
      [post.id, JSON.stringify(post), post.published !== false],
    )),
  );
  await sql.query(
    `INSERT INTO cms_settings (key, value) VALUES ('cms', '{"initialized":true}'::jsonb)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
  );
}

function boundedString(value: unknown, max: number, required = false) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new Error('A required field is missing.');
    return undefined;
  }
  if (typeof value !== 'string' || value.length > max) throw new Error('Invalid post content.');
  return value;
}

export function validatePost(value: unknown): BlogPost {
  if (!value || typeof value !== 'object') throw new Error('Invalid post payload.');
  const post = value as Partial<BlogPost>;
  if (!Number.isSafeInteger(post.id) || Number(post.id) <= 0) throw new Error('Invalid post id.');
  if (!Array.isArray(post.paragraphs) || post.paragraphs.length > 50) throw new Error('Invalid paragraphs.');
  if (!Array.isArray(post.highlights) || post.highlights.length > 30) throw new Error('Invalid tags.');
  if (post.paragraphs.some((item) => typeof item !== 'string' || item.length > 10_000)) throw new Error('Paragraph too long.');
  if (post.highlights.some((item) => typeof item !== 'string' || item.length > 100)) throw new Error('Tag too long.');
  if ((post.images?.length ?? 0) > 6) throw new Error('Too many images.');
  post.images?.forEach((image) => {
    if (!image || typeof image.src !== 'string' || image.src.length > 2000) throw new Error('Invalid image.');
    if (!/^https:\/\//i.test(image.src) && !/^\/images\/[\w/-]+\.(jpe?g|png|webp)$/i.test(image.src)) {
      throw new Error('Image must use HTTPS or an approved local path.');
    }
  });
  return serialize({
    ...post,
    id: Number(post.id),
    slug: boundedString(post.slug, 180, true),
    title: boundedString(post.title, 240, true),
    excerpt: boundedString(post.excerpt, 1200, true),
    category: boundedString(post.category, 80, true),
    readTime: boundedString(post.readTime, 40, true),
    sourceLabel: boundedString(post.sourceLabel, 160, true),
    sourceUrl: boundedString(post.sourceUrl, 1000),
    date: boundedString(post.date, 80),
    imagePosition: boundedString(post.imagePosition, 40),
    paragraphs: post.paragraphs,
    highlights: post.highlights,
    images: post.images ?? [],
    published: post.published !== false,
  } as BlogPost);
}

export async function deleteBlobImages(post?: BlogPost) {
  const urls = post?.images?.map((image) => image.src).filter((url) => url.includes('.blob.vercel-storage.com')) ?? [];
  if (urls.length) await Promise.allSettled(urls.map((url) => del(url)));
}