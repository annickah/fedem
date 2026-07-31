import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Target, Eye, Heart, Users, Sprout, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BG_LEAVES } from '../lib/constants';
import OrganicMedia from './OrganicMedia';

const values = [
  {
    icon: Target,
    title: 'Notre Mission',
    description:
      "Promouvoir l'agrobusiness au profit des entrepreneurs agricoles ruraux à travers l'approche chaîne de valeur des filières porteuses.",
  },
  {
    icon: Eye,
    title: 'Notre Vision',
    description:
      "Un modèle d'entreprenariat rural performant, participatif et inclusif, impliquant tous les acteurs de l'agrobusiness à Madagascar.",
  },
  {
    icon: Heart,
    title: 'Nos Valeurs',
    description:
      "Mettre l'humain au cœur de l'activité économique. Oser construire une société plus juste, partager et défendre des valeurs communes.",
  },
];

const teamMembers = [
  { name: 'Tantely RAHOELIARIVAHY', role: 'Présidente', expertise: 'Expert-Comptable, Formatrice' },
  { name: 'Afick GASSARD', role: 'Vice-Président', expertise: 'Juriste, Écotourisme' },
  { name: 'Jacques RAKOTOSON', role: 'Vice-Président', expertise: 'Ingénieur Agronome, Coach' },
  { name: 'Olivia RAJERISON', role: 'Secrétaire Général', expertise: 'Avocate, Réformes' },
  { name: 'Mahefarivo M. ANDRIANALISOA', role: 'Trésorier', expertise: 'Exploitant Agricole & Minier' },
  { name: 'Andry Avo RAJAONSON', role: 'Trésorier Adjoint', expertise: "Plateforme d'échanges" },
  { name: 'Luc S. RASAMOELINA', role: 'Conseiller', expertise: 'Systèmes Informatiques' },
  { name: 'Heritina G. RAJAONARIVELO', role: 'Conseiller', expertise: 'Agricole, Minier, Juriste' },
  { name: 'Fara RAHOELIARIVAHY', role: 'Conseiller', expertise: 'Architecte, Ville Rurale' },
  { name: 'Bernard RAVELOSAONA', role: 'Secrétaire Exécutif', expertise: 'Anthropologie, Communication' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();

  const glass = isDark
    ? 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]'
    : 'bg-white/60 backdrop-blur-xl border border-gray-200/60 shadow-sm';
  const glassHover = isDark ? 'hover:bg-white/[0.08]' : 'hover:bg-white/80 hover:shadow-md';

  return (
    <section id="apropos" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      {/* Blurred leaf background */}
      <div className="absolute inset-0">
        <img src={BG_LEAVES.about} alt="" className="w-full h-full object-cover blur-[6px] scale-105" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/88' : 'bg-white/90'}`} />
      </div>

      {/* Blurred blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-fedem-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-fedem-500/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>
            À propos
          </span>
          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Qui sommes-
            <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">nous</span> ?
          </h2>
          <p className={`mt-6 max-w-2xl mx-auto text-lg ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Association indépendante à but non lucratif, la FEDEM rassemble une équipe
            multidisciplinaire au service de l'entreprenariat à Madagascar.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-5 mb-24">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
              className="group relative"
            >
              <div className={`${glass} ${glassHover} rounded-3xl p-8 h-full transition-all duration-500 relative overflow-hidden`}>
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-fedem-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                    isDark ? 'bg-fedem-600/15' : 'bg-fedem-50 border border-fedem-200/50'
                  }`}>
                    <item.icon className={`w-7 h-7 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={`leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two columns: Images + Text */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <OrganicMedia variant="story" isDark={isDark} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h3 className={`text-2xl sm:text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Pour un modèle d'entreprenariat rural{' '}
              <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">performant</span>
            </h3>
            <p className={`leading-relaxed mb-5 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              La FEDEM propose un modèle économique social et solidaire, participatif et inclusif,
              impliquant tous les acteurs et parties prenantes de la promotion de l'agri et
              agrobusiness à Madagascar.
            </p>
            <p className={`leading-relaxed mb-4 ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
              Nos sites pilotes sélectionnés :
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Analamanga', 'Bongolava', 'Anjozorobe', 'Vakinankaratra'].map((site) => (
                <span key={site} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  isDark ? 'bg-fedem-600/10 text-fedem-300 border border-fedem-500/20' : 'bg-fedem-50 text-fedem-700 border border-fedem-200'
                }`}>
                  <MapPin className="h-3.5 w-3.5" /> {site}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, label: 'Équipe multidisciplinaire' },
                { icon: Sprout, label: 'Agrobusiness durable' },
              ].map((item) => (
                <div key={item.label} className={`${glass} rounded-xl p-4 flex items-center gap-3`}>
                  <item.icon className={`w-5 h-5 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Statut juridique */}
            <div className={`mt-6 p-4 rounded-xl text-xs leading-relaxed ${isDark ? 'bg-white/[0.03] text-white/30 border border-white/5' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
              <strong className={isDark ? 'text-white/50' : 'text-gray-500'}>Statut juridique :</strong> Association à but non lucratif – Ordonnance n°60.133 du 3 octobre 1960.
              <br />Agrément n° 1997/21-MID/SG/PREF.POLI.ANT/ASS du 24 novembre 2021.
            </div>
          </motion.div>
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className={`text-2xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Les Membres{' '}
            <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">Fondateurs</span>
          </h3>
          <p className={`text-center mb-12 max-w-xl mx-auto ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
            Une équipe multidisciplinaire : expert-comptable, avocat, architecte, ingénieur agronome, anthropologue, économiste et formateur.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {teamMembers.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                className={`${glass} ${glassHover} rounded-2xl p-5 text-center group transition-all duration-300`}
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-fedem-500 to-fedem-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-fedem-500/15">
                  <span className="text-lg font-bold text-white">{m.name.charAt(0)}</span>
                </div>
                <h4 className={`text-sm font-semibold mb-1 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {m.name.split(' ').slice(0, 2).join(' ')}
                </h4>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>{m.role}</p>
                <p className={`text-[11px] ${isDark ? 'text-white/25' : 'text-gray-400'}`}>{m.expertise}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
