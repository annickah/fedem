import { randomUUID } from 'node:crypto';
import { hash } from 'bcryptjs';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createSession, fingerprint, type CmsUser, verifyPassword } from '../_lib/auth.js';
import { ensureSchema, getSql } from '../_lib/db.js';
import { assertSameOrigin, clientIp, errorMessage, readBody, sendJson } from '../_lib/http.js';
import { seedPosts } from '../_lib/posts.js';

interface LoginBody {
  email?: string;
  credential?: string;
  mode?: 'password' | 'pin';
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    assertSameOrigin(request);
    const { email = '', credential = '', mode = 'password' } = readBody<LoginBody>(request);
    const normalizedEmail = email.trim().toLowerCase();
    const validCredential = mode === 'pin'
      ? /^\d{4,8}$/.test(credential)
      : credential.length >= 8 && credential.length <= 256;
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || !validCredential) {
      return sendJson(response, 400, { error: 'Identifiants invalides.' });
    }

    await ensureSchema();
    const sql = getSql();
    const ipFingerprint = fingerprint(clientIp(request));
    await sql.query("DELETE FROM login_attempts WHERE created_at < NOW() - INTERVAL '1 day'");
    const attempts = await sql.query(
      "SELECT COUNT(*)::int AS count FROM login_attempts WHERE fingerprint = $1 AND created_at > NOW() - INTERVAL '15 minutes'",
      [ipFingerprint],
    ) as Array<{ count: number }>;
    if ((attempts[0]?.count ?? 0) >= 10) {
      return sendJson(response, 429, { error: 'Trop de tentatives. Réessayez dans 15 minutes.' });
    }

    let users = await sql.query(
      'SELECT id, email, password_hash, pin_hash, role, active FROM cms_users WHERE LOWER(email) = $1 AND active = TRUE LIMIT 1',
      [normalizedEmail],
    ) as CmsUser[];
    let user = users[0];

    if (!user) {
      const countRows = await sql.query('SELECT COUNT(*)::int AS count FROM cms_users') as Array<{ count: number }>;
      const bootstrapEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
      const bootstrapHash = process.env.ADMIN_PASSWORD_HASH;
      const bootstrapPinHash = process.env.ADMIN_PIN_HASH;
      const bootstrapCredentialHash = mode === 'pin' ? bootstrapPinHash : bootstrapHash;
      if ((countRows[0]?.count ?? 0) === 0 && bootstrapEmail === normalizedEmail && bootstrapCredentialHash) {
        const validBootstrap = await verifyPassword(credential, bootstrapCredentialHash);
        if (validBootstrap) {
          const id = randomUUID();
          const passwordHash = bootstrapHash || await hash(randomUUID(), 12);
          const pinHash = bootstrapPinHash || null;
          await sql.query(
            `INSERT INTO cms_users (id, email, password_hash, pin_hash, role, active)
             VALUES ($1, $2, $3, $4, 'admin', TRUE)`,
            [id, normalizedEmail, passwordHash, pinHash],
          );
          users = await sql.query(
            'SELECT id, email, password_hash, pin_hash, role, active FROM cms_users WHERE id = $1',
            [id],
          ) as CmsUser[];
          user = users[0];
        }
      }
    }

    const credentialHash = mode === 'pin' ? user?.pin_hash : user?.password_hash;
    const valid = user && credentialHash ? await verifyPassword(credential, credentialHash) : false;
    if (!user || !valid) {
      await sql.query('INSERT INTO login_attempts (fingerprint) VALUES ($1)', [ipFingerprint]);
      return sendJson(response, 401, { error: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    await sql.query('DELETE FROM login_attempts WHERE fingerprint = $1 OR created_at < NOW() - INTERVAL \'1 day\'', [ipFingerprint]);
    await seedPosts();
    await createSession(response, user);
    return sendJson(response, 200, { user: { email: user.email, role: user.role } });
  } catch (error) {
    return sendJson(response, 500, { error: errorMessage(error) });
  }
}