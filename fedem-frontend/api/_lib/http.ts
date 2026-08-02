import type { VercelRequest, VercelResponse } from '@vercel/node';

export function sendJson(response: VercelResponse, status: number, data: unknown) {
  response.setHeader('Cache-Control', 'no-store');
  return response.status(status).json(data);
}

export function readBody<T>(request: VercelRequest): T {
  if (typeof request.body === 'string') return JSON.parse(request.body) as T;
  return (request.body ?? {}) as T;
}

export function assertSameOrigin(request: VercelRequest) {
  const origin = request.headers.origin;
  if (!origin) return;
  const forwardedHost = request.headers['x-forwarded-host'];
  const host = Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || request.headers.host;
  if (!host || new URL(origin).host !== host) throw new Error('Cross-origin request rejected.');
}

export function clientIp(request: VercelRequest) {
  const forwarded = request.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || request.socket.remoteAddress || 'unknown';
}

export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected server error.';
}