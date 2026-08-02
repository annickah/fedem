import { FEDEM_IMAGES } from '../lib/constants';

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image?: string;
  images?: { src: string; alt: string; caption?: string; storagePath?: string }[];
  imagePosition?: string;
  sourceLabel: string;
  sourceUrl?: string;
  paragraphs: string[];
  highlights: string[];
  kind?: 'news' | 'resource';
  date?: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  visual?:
    | 'reforestation'
    | 'partnership'
    | 'territory'
    | 'producers'
    | 'women'
    | 'mobilization'
    | 'network'
    | 'training'
    | 'digital'
    | 'legal'
    | 'sectors'
    | 'social'
    | 'statistics';
}

const websiteSource = 'https://fedem.mg/';
const facebookNews: BlogPost[] = [
  {
    id: 101,
    slug: 'journee-reboisement-rekany-agri-anjozorobe',
    title: 'Journée de reboisement à Anjozorobe : ensemble pour un avenir plus vert',
    excerpt:
      "ACEP Madagascar et ADéfi Santé, en collaboration avec la FEDEM et Rekany Agri-bio, ont uni leurs engagements pour planter des arbres à Anjozorobe.",
    category: 'Environnement',
    readTime: '4 min',
    visual: 'reforestation',
    date: '17 mars 2025',
    images: [
      {
        src: 'https://acep.mg/sites/default/files/styles/wide/public/images/ACEP_RESPONSABLE_ensemble_pour_un_avenir_plus_vert.jpg.webp?itok=N7dDbN77',
        alt: "Journée de reboisement organisée à Anjozorobe avec ACEP Madagascar, ADéfi Santé, FEDEM et Rekany Agri-bio",
        caption: 'ACEP RESPONSABLE : une mobilisation collective pour un avenir plus vert à Anjozorobe.',
      },
    ],
    sourceLabel: 'Publication officielle ACEP Madagascar',
    sourceUrl: 'https://acep.mg/publications/acep-responsable-ensemble-avenir-plus-vert',
    kind: 'news',
    paragraphs: [
      "À Anjozorobe, ACEP Madagascar et ADéfi Santé, en étroite collaboration avec la FEDEM et Rekany Agri-bio, ont vécu une journée placée sous le signe de l'énergie positive, de la solidarité et de l'engagement.",
      "Les partenaires ont uni leurs convictions pour planter des arbres, symboles de vie, de croissance et de renouveau. Cette action collective donne une traduction concrète à leur engagement environnemental.",
      "L'initiative porte une vision commune : celle d'un Madagascar où chacun contribue, à son échelle, à protéger l'environnement et à bâtir un avenir durable.",
    ],
    highlights: ['Anjozorobe', 'ACEP Madagascar', 'ADéfi Santé', 'FEDEM', 'Rekany Agri-bio', 'Reboisement'],
  },
  {
    id: 102,
    slug: 'convention-faculte-sciences-universite-antananarivo',
    title: "Convention avec la Faculté des Sciences de l'Université d'Antananarivo",
    excerpt:
      "Une cérémonie de signature marque le rapprochement institutionnel entre la FEDEM et la Faculté des Sciences de l'Université d'Antananarivo.",
    category: 'Partenariat',
    readTime: '4 min',
    visual: 'partnership',
    imagePosition: 'center 38%',
    images: [
      {
        src: '/images/blog/convention-universitaire-fedem.jpg',
        alt: "Représentants de la FEDEM et de la Faculté des Sciences réunis à l'Université d'Antananarivo",
        caption: "La FEDEM et la Faculté des Sciences réunies à l'occasion de leur convention universitaire.",
      },
    ],
    sourceLabel: 'Publication FEDEM',
    sourceUrl: 'https://www.facebook.com/share/1DxWBTn6TW/',
    kind: 'news',
    paragraphs: [
      "Les photographies diffusées sur la page Facebook officielle montrent une cérémonie de signature organisée à la Faculté des Sciences de l'Université d'Antananarivo, en présence de représentants de l'université et de la FEDEM.",
      "La remise et la présentation des documents signés officialisent une démarche de collaboration. Ce rapprochement crée un cadre favorable aux échanges entre les compétences académiques, scientifiques et entrepreneuriales.",
      "Cette actualité souligne l'importance accordée par la FEDEM à la connaissance, à la formation et à la coopération institutionnelle pour accompagner les projets de développement.",
    ],
    highlights: ["Université d'Antananarivo", 'Faculté des Sciences', 'Convention', 'Coopération institutionnelle'],
  },
  {
    id: 103,
    slug: 'maison-developpement-durable-cga-anjozorobe',
    title: 'Développement durable et gestion agréée au plus près d’Anjozorobe',
    excerpt:
      "Une rencontre communautaire met en lumière la Maison du Développement Durable et le Centre de Gestion Agréé d'Anjozorobe.",
    category: 'Territoires',
    readTime: '4 min',
    visual: 'territory',
    images: [
      { src: '/images/blog/maison-developpement-durable-anjozorobe.jpg', alt: "Rencontre devant la Maison du Développement Durable à Anjozorobe" },
    ],
    sourceLabel: 'Archives photographiques FEDEM',
    kind: 'news',
    paragraphs: [
      "Une publication de la FEDEM présente une rencontre devant la Maison du Développement Durable, Foibe Fampandrosoana Maharitra, dans le district d'Anjozorobe. Le site accueille également une identification du Centre de Gestion Agréé d'Anjozorobe.",
      "Cette présence territoriale rapproche les dispositifs d'accompagnement des habitants, des porteurs de projets et des entrepreneurs. Elle facilite l'information, l'orientation et la structuration des activités locales.",
      "Le lien entre développement durable et gestion agréée rappelle que la réussite d'un projet rural repose autant sur son impact territorial que sur la qualité de son organisation et de son pilotage.",
    ],
    highlights: ['Maison du Développement Durable', 'Anjozorobe', 'Centre de Gestion Agréé', 'Proximité'],
  },
  {
    id: 104,
    slug: 'accompagnement-producteurs-communautes-rurales',
    title: 'Une action de proximité aux côtés des producteurs ruraux',
    excerpt:
      "La FEDEM poursuit son travail de terrain auprès des communautés rurales, dans une dynamique de partage, de structuration et d'accompagnement collectif.",
    category: 'Terrain',
    readTime: '3 min',
    visual: 'producers',
    images: [
      { src: '/images/blog/producteurs-accompagnement.jpg', alt: "Équipe FEDEM et producteurs ruraux lors d'une action de proximité" },
    ],
    sourceLabel: 'Archives photographiques FEDEM',
    kind: 'news',
    paragraphs: [
      "Les images partagées par la FEDEM montrent une rencontre de proximité réunissant son équipe et un groupe d'acteurs ruraux. Des sacs de produits agricoles et des supports remis aux participants sont visibles au centre de cette séquence collective.",
      "Au-delà du matériel présenté, cette actualité met en valeur la relation directe avec les communautés. L'écoute, la mobilisation et le travail en groupe sont essentiels pour identifier les besoins et construire des réponses adaptées au terrain.",
      "Cette démarche rejoint la mission de la fédération : renforcer les capacités des entrepreneurs et producteurs, tout en favorisant une organisation économique plus solidaire et inclusive.",
    ],
    highlights: ['Producteurs ruraux', 'Action de proximité', 'Accompagnement collectif', 'Économie solidaire'],
  },
  {
    id: 105,
    slug: 'vehivavy-fedem-8-mars-2025',
    title: '8 mars 2025 : droits, égalité et autonomisation des femmes',
    excerpt:
      "À l'occasion de la Journée internationale des femmes, la présidente de la FEDEM rappelle le rôle central des femmes dans le développement économique et social.",
    category: 'Vehivavy FEDEM',
    readTime: '4 min',
    visual: 'women',
    images: [
      { src: '/images/blog/vehivavy-fedem-8-mars-2025.jpg', alt: "Message de Tantely Rahoeliarivahy pour la Journée internationale des femmes 2025" },
    ],
    sourceLabel: 'Communication FEDEM',
    kind: 'news',
    date: '8 mars 2025',
    paragraphs: [
      "Dans son message publié à l'occasion de la Journée internationale des femmes 2025, Tantely Rahoeliarivahy, présidente de la FEDEM, met en avant le thème : « Pour TOUTES les femmes et les filles : droits, égalité et autonomisation ».",
      "Le message rappelle que l'égalité des sexes est un droit fondamental et que les femmes sont au cœur du développement économique et social. Cette conviction rejoint la volonté de placer l'humain au centre de l'activité économique.",
      "La publication se conclut par un appel collectif : « Ensemble, autonomisons, innovons et accélérons le changement ! » Une orientation qui associe droits, capacité d'action et participation économique.",
    ],
    highlights: ['8 mars 2025', 'Droits', 'Égalité', 'Autonomisation', 'Innovation'],
  },
  {
    id: 106,
    slug: 'vehivavy-fedem-mobilisation-anjozorobe',
    title: 'Vehivavy FEDEM mobilisée pour le développement durable à Anjozorobe',
    excerpt:
      "Des femmes membres et partenaires de la FEDEM se sont mobilisées à Anjozorobe autour de la Journée du 8 mars et du développement durable.",
    category: 'Mobilisation',
    readTime: '3 min',
    visual: 'mobilization',
    images: [
      { src: '/images/blog/vehivavy-fedem-marche.jpg', alt: "Mobilisation de Vehivavy FEDEM à Anjozorobe" },
    ],
    sourceLabel: 'Archives photographiques FEDEM',
    kind: 'news',
    date: '8 mars 2025',
    paragraphs: [
      "Une mobilisation de Vehivavy FEDEM est présentée dans les rues d'Anjozorobe à l'occasion du 8 mars. Le groupe porte une banderole associant la Journée des femmes à la promotion d'un développement durable dans le territoire.",
      "Cette présence publique rend visibles les femmes engagées dans la vie économique, associative et communautaire. Elle souligne leur capacité à porter des initiatives et à participer aux décisions qui concernent leur territoire.",
      "L'action complète le message institutionnel de la présidente en donnant une expression collective et locale aux objectifs de droits, d'égalité et d'autonomisation.",
    ],
    highlights: ['Vehivavy FEDEM', 'Anjozorobe', '8 mars', 'Développement durable'],
  },
];

const resourcePosts: BlogPost[] = [
  {
    id: 1,
    slug: 'modele-entreprenariat-rural-performant',
    title: "Construire un modèle d'entreprenariat rural performant",
    excerpt:
      "La FEDEM place l'humain au cœur de l'activité économique et structure un modèle social, solidaire, participatif et inclusif pour l'agrobusiness malgache.",
    category: 'Vision FEDEM',
    readTime: '6 min',
    image: FEDEM_IMAGES.agro,
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "La Fédération des Dirigeants et Entrepreneurs de Madagascar a conçu la promotion de l'agrobusiness comme un dispositif de formation, d'expérimentation et de pratique. Les sites d'intervention ont vocation à devenir des champs-écoles au service des entrepreneurs ruraux.",
      "Le modèle proposé est économique, social et solidaire. Il associe les entrepreneurs, les exploitants agricoles, les organisations paysannes, les structures d'accompagnement et les agrégateurs de services dans une logique participative et inclusive.",
      "L'approche par chaîne de valeur des filières porteuses constitue la base de la méthodologie. Elle relie la production, l'accompagnement technique, la gestion, le financement et la mise en marché afin de créer davantage de valeur sur les territoires.",
    ],
    highlights: ['Humain au centre', 'Économie sociale et solidaire', 'Approche chaîne de valeur'],
  },
  {
    id: 2,
    slug: 'sites-pilotes-territoires',
    title: 'Des sites pilotes au plus près des territoires',
    excerpt:
      "Analamanga, Bongolava, Anjozorobe et Vakinankaratra constituent les territoires pilotes sélectionnés pour expérimenter et déployer les actions FEDEM.",
    category: 'Territoires',
    readTime: '4 min',
    image: FEDEM_IMAGES.field,
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "La FEDEM concentre son modèle pilote dans quatre territoires : Analamanga, Bongolava, Anjozorobe et Vakinankaratra. Cette implantation permet d'adapter les interventions aux réalités agricoles, économiques et sociales locales.",
      "La proximité avec les entrepreneurs ruraux et les organisations paysannes facilite l'encadrement technique, l'expérimentation sur site et l'intégration sociale des projets.",
      "L'objectif est de consolider des méthodes reproductibles, capables d'être internalisées puis dupliquées dans d'autres zones en fonction des filières et des besoins identifiés.",
    ],
    highlights: ['Analamanga', 'Bongolava', 'Anjozorobe', 'Vakinankaratra'],
  },
  {
    id: 3,
    slug: 'agences-execution-mpme',
    title: "Agences d'exécution et MPME : organiser l'action locale",
    excerpt:
      "Les membres de la FEDEM, les exploitants agricoles et les MPME travaillent avec les organisations paysannes pour améliorer la qualité et la quantité des récoltes.",
    category: 'Mise en œuvre',
    readTime: '7 min',
    visual: 'network',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "Les entrepreneurs et sociétés d'exploitants agricoles membres de la FEDEM sont appelés à constituer des agences d'exécution. Ils conduisent les projets avec les organisations paysannes et participent au bon déroulement des exploitations.",
      "Les Micro, Petites et Moyennes Entreprises représentent l'unité de base de l'intervention, sans exclure l'accompagnement individuel. La restructuration paysanne, la formation professionnelle et l'encadrement technique soutiennent une compréhension commune entre les intervenants.",
      "Cette organisation vise une meilleure intégration des projets et une amélioration durable des récoltes, à la fois en qualité et en quantité.",
    ],
    highlights: ['Entrepreneurs agricoles', 'Organisations paysannes', 'MPME', 'Qualité des récoltes'],
  },
  {
    id: 4,
    slug: 'formation-recherche-action',
    title: 'Former, professionnaliser et transmettre par la recherche-action',
    excerpt:
      "La structure d'encadrement renforce les capacités intellectuelles et techniques des paysans et professionnalise les promoteurs d'activités génératrices de revenus.",
    category: 'Formation',
    readTime: '6 min',
    visual: 'training',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "La formation professionnelle est complétée par un renforcement des capacités et des compétences. La FEDEM prévoit une remise à niveau intellectuelle et technique des paysans ainsi qu'une professionnalisation des promoteurs d'activités génératrices de revenus.",
      "Le parcours porte aussi sur la capacité de mobilisation, la duplication des projets par l'internalisation des démarches et la réflexion sur les cursus de formation.",
      "La démarche de recherche-action relie directement les apprentissages à l'expérimentation sur le terrain. Elle permet d'observer, d'ajuster et de transmettre des pratiques adaptées au contexte rural.",
    ],
    highlights: ['Formation professionnelle', 'Renforcement de capacités', 'Mobilisation', 'Recherche-action'],
  },
  {
    id: 5,
    slug: 'accompagnement-gestion-digitalisation',
    title: "De l'idée au pilotage : business plan, coaching et digitalisation",
    excerpt:
      "La FEDEM accompagne les entrepreneurs ruraux dans le montage technique et financier, le coaching, la gestion agréée et la transformation numérique.",
    category: 'Accompagnement',
    readTime: '5 min',
    visual: 'digital',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "L'offre d'accompagnement couvre la mise en place de centres de formation professionnelle, le coaching des entrepreneurs ruraux et le montage des dossiers techniques et de financement.",
      "La digitalisation des processus de gestion aide les entreprises à structurer leurs données, suivre leurs activités et moderniser leur pilotage.",
      "La mise en place de Centres de Gestion Agréés complète cet accompagnement en apportant un cadre de gestion adapté aux besoins des entrepreneurs.",
    ],
    highlights: ['Coaching', 'Business plan', 'Digitalisation', 'Centre de Gestion Agréé'],
  },
  {
    id: 6,
    slug: 'foncier-amenagement-echanges',
    title: 'Foncier, aménagement et plateformes d’échanges',
    excerpt:
      "La planification territoriale, l'accès au foncier et la mise en relation entre paysans et agrégateurs sont trois leviers complémentaires du développement rural.",
    category: 'Structuration',
    readTime: '5 min',
    visual: 'legal',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "La FEDEM mobilise des compétences en aménagement et paysage afin de contribuer à une planification territoriale cohérente.",
      "L'approche juridique sur l'accès au foncier apporte un éclairage essentiel aux entrepreneurs et exploitants qui souhaitent sécuriser leurs projets.",
      "Les plateformes d'échanges rapprochent les paysans des agrégateurs de services. Elles facilitent la circulation de l'information, l'accès aux services et la distribution des produits.",
    ],
    highlights: ['Planification territoriale', 'Accès au foncier', 'Échanges', 'Distribution'],
  },
  {
    id: 7,
    slug: 'filieres-activites',
    title: 'Des filières agricoles aux activités complémentaires',
    excerpt:
      "Riz, agrumes, aviculture, écotourisme, exploitation minière responsable et sécurisation cynophile composent un champ d'expertises diversifié.",
    category: 'Filières',
    readTime: '5 min',
    visual: 'sectors',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "L'agriculture à grande échelle concerne notamment le riz, les agrumes et l'aviculture. Ces filières s'inscrivent dans une logique de professionnalisation et de création de valeur.",
      "La FEDEM présente également des compétences en écotourisme, en exploitation minière et en conduite de chenils pour la sécurisation cynophile des sites.",
      "Cette diversité reflète la composition multidisciplinaire de la fédération et sa capacité à intervenir sur plusieurs dimensions de l'entrepreneuriat territorial.",
    ],
    highlights: ['Riz', 'Agrumes', 'Aviculture', 'Écotourisme', 'Sécurisation des sites'],
  },
  {
    id: 8,
    slug: 'agriculture-malgache-chiffres',
    title: "L'agriculture malgache en quelques données structurantes",
    excerpt:
      "Population active, petites exploitations familiales, riziculture et contribution au PIB : les données publiées par FEDEM rappellent le poids stratégique du secteur.",
    category: 'Repères',
    readTime: '4 min',
    visual: 'statistics',
    sourceLabel: 'FEDEM.mg',
    sourceUrl: websiteSource,
    paragraphs: [
      "Les données affichées par la FEDEM indiquent que l'agriculture représente 75 % de la population active et génère environ 26 % du PIB. Le site mentionne aussi une croissance annuelle de 1,5 % sur trente ans.",
      "L'agriculture malgache est dominée par environ 2,5 millions de petites exploitations familiales. La riziculture concerne plus de deux millions de ménages et occupe plus de 1,2 million d'hectares.",
      "Ces ordres de grandeur expliquent la priorité accordée à la professionnalisation, au financement, à l'encadrement technique et à la structuration des chaînes de valeur.",
    ],
    highlights: ['75 % de la population active', '26 % du PIB', '2,5 M d’exploitations', 'Plus de 2 M de ménages riziculteurs'],
  },
];

export const blogPosts: BlogPost[] = [...facebookNews, ...resourcePosts];