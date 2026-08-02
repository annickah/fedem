// ── FEDEM.mg official images ──
export const FEDEM_IMAGES = {
  group: 'https://fedem.mg/wp-content/uploads/2023/10/fedem-5-1024x768.jpg',
  agro: 'https://fedem.mg/wp-content/uploads/2023/10/fedem-3-1024x768.jpg',
  field: 'https://fedem.mg/wp-content/uploads/2023/10/Fedem-2.jpg',
} as const;

export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/profile.php?id=61550310201784',
} as const;

export const PARTNER_LOGOS = [
  { src: 'https://fedem.mg/wp-content/uploads/2023/11/Logo-768x290.png', name: 'Asfifo', url: 'https://www.asfifo.mg/' },
  { src: 'https://fedem.mg/wp-content/uploads/2023/11/Logo-1.png', name: 'Expert Conseils', url: 'https://expert-conseils.mg/' },
  { src: 'https://fedem.mg/wp-content/uploads/2023/11/camoi-768x768.png', name: 'Camoi', url: 'https://camoi.mg/' },
  { src: 'https://fedem.mg/wp-content/uploads/2023/11/CGA-768x768.png', name: 'CGA AVEMA', url: '#' },
] as const;

// ── Nature / leaf backgrounds (stock) ──
export const BG_LEAVES = {
  hero: 'https://images.pexels.com/photos/5668050/pexels-photo-5668050.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920',
  about: 'https://images.pexels.com/photos/1689609/pexels-photo-1689609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920',
  services: 'https://images.pexels.com/photos/5400705/pexels-photo-5400705.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920',
  blog: 'https://images.pexels.com/photos/12969324/pexels-photo-12969324.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1920',
} as const;

export const CONTACT_INFO = {
  phone: '(+261) 20 22 436 48',
  phoneHref: 'tel:+261202243648',
  email: 'contact@fedem.mg',
  address: '3ème étage, Immeuble Héritage\nLot IVX 72 Bis F Ankazomanga',
  city: 'Antananarivo 101, Madagascar',
  latitude: -18.8918482,
  longitude: 47.5135602,
  mapEmbedUrl:
    'https://www.openstreetmap.org/export/embed.html?bbox=47.5055602%2C-18.8968482%2C47.5215602%2C-18.8868482&layer=mapnik&marker=-18.8918482%2C47.5135602',
  mapUrl: 'https://www.openstreetmap.org/?mlat=-18.8918482&mlon=47.5135602#map=16/-18.8918482/47.5135602',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=3%C3%A8me%20%C3%A9tage%20Immeuble%20H%C3%A9ritage%2C%20Lot%20IVX%2072%20Bis%20F%20Ankazomanga%2C%20Antananarivo%2C%20Madagascar',
} as const;

export const USEFUL_LINKS = [
  { label: 'EDBM', href: 'https://edbm.mg/' },
  { label: "Ministère de l’Agriculture et de l’Élevage", href: 'https://www.minae.gov.mg/' },
  {
    label: "Ministère de l’Industrialisation, du Commerce et de la Consommation",
    href: 'https://www.micc.gov.mg/',
  },
  {
    label: 'Ministère des Mines et des Ressources Stratégiques',
    href: 'https://mines.gov.mg/',
  },
  { label: "Ministère de l’Économie et des Finances", href: 'https://www.mef.gov.mg/' },
  {
    label: "Ministère de l’Aménagement du Territoire et des Services Fonciers",
    href: 'https://www.matsf.gov.mg/',
  },
  { label: 'Ministère des Travaux Publics Madagascar', href: 'http://mtp.gov.mg/' },
] as const;
