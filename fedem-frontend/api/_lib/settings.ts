import { defaultSiteSettings, type SiteSettings } from '../../src/data/siteContent.js';
import { ensureSchema, getSql } from './db.js';

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureSchema();
  const rows = await getSql().query(
    "SELECT value FROM cms_settings WHERE key = 'site' LIMIT 1",
  ) as Array<{ value: SiteSettings }>;
  return rows[0]?.value ?? defaultSiteSettings;
}

export function validateSiteSettings(value: unknown): SiteSettings {
  if (!value || typeof value !== 'object') throw new Error('Paramètres invalides.');
  const settings = value as Partial<SiteSettings>;
  if (!Number.isInteger(settings.memberCount) || Number(settings.memberCount) < 0 || Number(settings.memberCount) > 1_000_000) {
    throw new Error('Nombre de membres invalide.');
  }
  if (!Array.isArray(settings.stats) || settings.stats.length > 20) throw new Error('Statistiques invalides.');
  if (!Array.isArray(settings.partners) || settings.partners.length > 30) throw new Error('Partenaires invalides.');
  settings.stats.forEach((stat) => {
    if (!stat || typeof stat.id !== 'string' || typeof stat.label !== 'string' || typeof stat.value !== 'number') {
      throw new Error('Une statistique est invalide.');
    }
    if (stat.label.length > 100 || stat.description.length > 200 || stat.prefix.length > 10 || stat.suffix.length > 20) {
      throw new Error('Une statistique contient un texte trop long.');
    }
  });
  settings.partners.forEach((partner) => {
    if (!partner || typeof partner.id !== 'string' || typeof partner.name !== 'string') throw new Error('Un partenaire est invalide.');
    if (partner.name.length > 120 || partner.image.length > 2000 || partner.url.length > 2000) throw new Error('Un partenaire contient une valeur trop longue.');
    if (partner.image && !/^https:\/\//i.test(partner.image)) throw new Error('Les logos partenaires doivent utiliser une URL HTTPS.');
    if (partner.url && !/^https:\/\//i.test(partner.url)) throw new Error('Les liens partenaires doivent utiliser HTTPS.');
  });
  return JSON.parse(JSON.stringify(settings)) as SiteSettings;
}