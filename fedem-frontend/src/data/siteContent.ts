export interface SiteStat {
  id: string;
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
}

export interface SitePartner {
  id: string;
  name: string;
  image: string;
  url: string;
  active: boolean;
}

export interface SiteSettings {
  memberCount: number;
  stats: SiteStat[];
  partners: SitePartner[];
}

export const defaultSiteSettings: SiteSettings = {
  memberCount: 10,
  stats: [
    { id: 'agriculture', value: 75, prefix: '', suffix: '%', label: 'Agriculture', description: 'de la population active' },
    { id: 'growth', value: 1.5, prefix: '+', suffix: '%', label: 'Croissance annuelle', description: 'en 30 ans' },
    { id: 'poverty', value: 86, prefix: '', suffix: '%', label: 'Population pauvre', description: 'petites exploitations agricoles' },
    { id: 'gdp', value: 26, prefix: '', suffix: '%', label: 'Part du PIB', description: 'de la totalité du PIB' },
    { id: 'workers', value: 600, prefix: '+', suffix: 'K', label: 'Nouveaux actifs / an', description: 'population active annuelle' },
    { id: 'farms', value: 2.5, prefix: '', suffix: 'M', label: 'Exploitations familiales', description: "dominent l'agriculture" },
    { id: 'rice', value: 2000, prefix: '+', suffix: 'K', label: 'Riziculteurs', description: 'ménages, 1,2 M ha' },
    { id: 'gdp-capita', value: 400, prefix: '', suffix: ' USD', label: 'PIB / habitant', description: 'par habitant' },
  ],
  partners: [
    { id: 'asfifo', name: 'ASFIFO', image: 'https://fedem.mg/wp-content/uploads/2023/11/Logo-768x290.png', url: 'https://www.asfifo.mg/', active: true },
    { id: 'expert-conseils', name: 'Expert Conseils', image: 'https://fedem.mg/wp-content/uploads/2023/11/Logo-1.png', url: 'https://expert-conseils.mg/', active: true },
    { id: 'camoi', name: 'CAMOI', image: 'https://fedem.mg/wp-content/uploads/2023/11/camoi-768x768.png', url: 'https://camoi.mg/', active: true },
    { id: 'cga-avema', name: 'CGA AVEMA', image: 'https://fedem.mg/wp-content/uploads/2023/11/CGA-768x768.png', url: 'https://cga-avema.mg/', active: true },
  ],
};