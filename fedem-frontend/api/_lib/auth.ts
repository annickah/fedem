import { createHash, randomUUID } from 'node:crypto';
import { compare } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ensureSchema, getSql } from './db.js';

const COOKIE_NAME = 'fedem_admin_session';

export interface CmsUser {
  id: string;
  email: string;
  password_hash: string;
  pin_hash: string | null;
  role: 'admin' | 'editor';
  active: boolean;
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters.');
  return new TextEncoder().encode(value);
}

function cookies(header = '') {
  return Object.fromEntries(header.split(';').filter(Boolean).map((part) => {
    const [name, ...value] = part.trim().split('=');
    return [name, decodeURIComponent(value.join('='))];
  }));
}

export function fingerprint(ip: string) {
  return createHash('sha256').update(`${ip}:${process.env.AUTH_SECRET || 'fedem'}`).digest('hex');
}

export async function verifyPassword(password: string, hash: string) {
  return compare(password, hash);
}

export async function createSession(response: VercelResponse, user: CmsUser) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .setJti(randomUUID())
    .sign(secret());
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=28800; SameSite=Strict${secure}`);
}

export function clearSession(response: VercelResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  response.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${secure}`);
}

export async function requireUser(request: VercelRequest, roles: Array<'admin' | 'editor'> = ['admin', 'editor']) {
  const token = cookies(request.headers.cookie)[COOKIE_NAME];
  if (!token) throw new Error('Authentication required.');
  const verified = await jwtVerify(token, secret(), { algorithms: ['HS256'] });
  if (!verified.payload.sub) throw new Error('Invalid session.');

  await ensureSchema();
  const sql = getSql();
  const rows = await sql.query(
    'SELECT id, email, password_hash, pin_hash, role, active FROM cms_users WHERE id = $1 AND active = TRUE LIMIT 1',
    [verified.payload.sub],
  ) as CmsUser[];
  const user = rows[0];
  if (!user || !roles.includes(user.role)) throw new Error('Access denied.');
  return user;
}