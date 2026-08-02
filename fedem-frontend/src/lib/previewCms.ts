import type { Inquiry } from '../data/adminTypes';
import type { BlogPost } from '../data/blogPosts';
import { defaultSiteSettings, type SiteSettings } from '../data/siteContent';

export const PREVIEW_POSTS_KEY = 'fedem-preview-posts-v1';
export const PREVIEW_INQUIRIES_KEY = 'fedem-preview-inquiries-v1';
export const PREVIEW_SETTINGS_KEY = 'fedem-preview-settings-v1';
export const PREVIEW_SESSION_KEY = 'fedem-preview-session-v1';

export const previewAdmin = {
  email: 'contact@fedem.mg',
  passwordCodePoints: [102, 101, 100, 101, 109, 97, 100, 109, 105, 110, 46, 109, 103, 50, 48, 50, 54],
  sessionHours: 8,
} as const;

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function isStaticPreviewEnvironment() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host.endsWith('arena.ai') || host.includes('.arena.');
}

export function verifyPreviewPassword(value: string) {
  const actual = Array.from(value).map((character) => character.codePointAt(0) ?? 0);
  const expected = previewAdmin.passwordCodePoints;
  let difference = actual.length ^ expected.length;
  const length = Math.max(actual.length, expected.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (actual[index] ?? 0) ^ (expected[index] ?? 0);
  }
  return difference === 0;
}

export function loadPreviewPosts(fallback: BlogPost[]) {
  return readJson(PREVIEW_POSTS_KEY, fallback);
}

export function savePreviewPosts(posts: BlogPost[]) {
  localStorage.setItem(PREVIEW_POSTS_KEY, JSON.stringify(posts));
}

export function loadPreviewInquiries() {
  return readJson<Inquiry[]>(PREVIEW_INQUIRIES_KEY, []);
}

export function savePreviewInquiries(inquiries: Inquiry[]) {
  localStorage.setItem(PREVIEW_INQUIRIES_KEY, JSON.stringify(inquiries));
}

export function loadPreviewSettings() {
  return readJson<SiteSettings>(PREVIEW_SETTINGS_KEY, defaultSiteSettings);
}

export function savePreviewSettings(settings: SiteSettings) {
  localStorage.setItem(PREVIEW_SETTINGS_KEY, JSON.stringify(settings));
}

export function createPreviewInquiry(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Inquiry {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    type: /adh[eé]sion/i.test(input.subject) ? 'membership' : 'message',
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: 'new',
    responseText: '',
    responseSent: false,
    createdAt: now,
    updatedAt: now,
  };
}