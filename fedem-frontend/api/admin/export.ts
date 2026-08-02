import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireUser } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';

function csvCell(value: unknown) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') return response.status(405).end();
  await requireUser(request, ['admin']);
  await ensureSchema();
  const sql = getSql();
  const [posts, inquiries, settings, users] = await Promise.all([
    sql.query('SELECT id, data, published, version, created_at, updated_at FROM blog_posts ORDER BY id'),
    sql.query('SELECT * FROM inquiries ORDER BY created_at'),
    sql.query('SELECT key, value, updated_at FROM cms_settings ORDER BY key'),
    sql.query('SELECT id, email, role, active, created_at, updated_at FROM cms_users ORDER BY created_at'),
  ]);
  const format = request.query.format === 'csv' ? 'csv' : 'json';
  const date = new Date().toISOString().slice(0, 10);
  if (format === 'json') {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Content-Disposition', `attachment; filename="fedem-backup-${date}.json"`);
    return response.status(200).send(JSON.stringify({ exportedAt: new Date().toISOString(), posts, inquiries, settings, users }, null, 2));
  }
  const headers = ['record_type', 'id', 'title_or_name', 'email', 'status', 'payload', 'created_at', 'updated_at'];
  const rows = [
    ...posts.map((post: any) => ['post', post.id, post.data?.title, '', post.published ? 'published' : 'draft', post.data, post.created_at, post.updated_at]),
    ...inquiries.map((item: any) => ['inquiry', item.id, item.name, item.email, item.status, item, item.created_at, item.updated_at]),
    ...settings.map((item: any) => ['setting', item.key, item.key, '', '', item.value, '', item.updated_at]),
    ...users.map((item: any) => ['user', item.id, item.email, item.email, item.active ? item.role : 'inactive', { role: item.role }, item.created_at, item.updated_at]),
  ];
  const csv = [headers.map(csvCell).join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\n');
  response.setHeader('Content-Type', 'text/csv; charset=utf-8');
  response.setHeader('Content-Disposition', `attachment; filename="fedem-backup-${date}.csv"`);
  return response.status(200).send(`\uFEFF${csv}`);
}