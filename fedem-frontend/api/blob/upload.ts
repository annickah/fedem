import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { requireUser } from '../_lib/auth.js';
import { errorMessage, sendJson } from '../_lib/http.js';

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') return sendJson(response, 405, { error: 'Method not allowed.' });
  try {
    const result = await handleUpload({
      request,
      body: request.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname) => {
        const user = await requireUser(request);
        if (!pathname.startsWith('blog/')) throw new Error('Invalid upload path.');
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 5 * 1024 * 1024,
          addRandomSuffix: true,
          allowOverwrite: false,
          cacheControlMaxAge: 31536000,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return sendJson(response, 200, result);
  } catch (error) {
    return sendJson(response, 400, { error: errorMessage(error) });
  }
}