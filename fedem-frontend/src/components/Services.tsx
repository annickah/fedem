import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import {
  GraduationCap, HandHeart, FileText, Monitor, Mountain, Dog,
  Wheat, Building2, MapPin, Scale, ArrowLeftRight, Palmtree, ArrowRight,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BG_LEAVES } from '../lib/constants';

const services = [
  { icon: GraduationCap, title: 'Formations', desc: "Centre de formation professionnelle d'entreprenariat agricole." },
  { icon: HandHeart, title: 'Coaching', desc: "Accompagnement et coaching d'entrepreneurs ruraux." },
  { icon: FileText, title: 'Business Plan', desc: "Montage de dossier technique et de financement pour l'entreprenariat rural." },
  { icon: Monitor, title: 'Digitalisation', desc: "Processus de digitalisation de gestion d'entreprises." },
  { icon: Mountain, title: 'Exploitation Minière', desc: "Accompagnement dans les activités d'exploitation minière responsable." },
  { icon: Dog, title: 'Conduite de Chenils', desc: 'Sécurisation cynophile des sites et conduite de chenils.' },
  { icon: Wheat, title: 'Agriculture Grande Échelle', desc: 'Riz, agrumes, aviculture et filières porteuses.' },
  { icon: Building2, title: 'Mise en place de CGA', desc: 'Centre de Gestion Agréé pour les entrepreneurs.' },
  { icon: MapPin, title: 'Aménagement', desc: "Aménagement et paysage, planification territoriale." },
  { icon: Scale, title: 'Approche Juridique', desc: "Approche juridique sur l'accès au foncier." },
  { icon: ArrowLeftRight, title: "Plateforme d'Échanges", desc: "Plateforme entre paysans et agrégateurs de services." },
  { icon: Palmtree, title: 'Écotourisme', desc: "Écotourisme responsable et valorisation du patrimoine." },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();

  return (
    <section id="services" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      {/* Blurred leaf bg */}
      <div className="absolute inset-0">
        <img src={BG_LEAVES.services} alt="" className="w-full h-full object-cover blur-[8px] scale-110" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/90' : 'bg-white/92'}`} />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-fedem-600/8 blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-fedem-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>
            Nos services
          </span>
          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ce que nous{' '}
            <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">proposons</span>
          </h2>
          <p className={`mt-6 max-w-2xl mx-auto text-lg ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Un accompagnement complet pour les entrepreneurs et dirigeants agricoles de Madagascar.
          </p>
        </motion.div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-y ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.05 + i * 0.05 }}
              className={`group relative px-5 py-9 transition-colors duration-300 ${
                isDark ? 'hover:bg-white/[0.035]' : 'hover:bg-white/50'
              }`}
            >
              <div className={`absolute right-5 top-5 text-[11px] font-semibold ${
                isDark ? 'text-white/20' : 'text-gray-300'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center bg-gradient-to-br from-fedem-400 to-fedem-700 shadow-lg shadow-fedem-600/15 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
                  ['shape-leaf', 'shape-pebble', 'shape-petal', 'shape-soft-square'][i % 4]
                }`}
              >
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`mb-2 text-base font-bold transition-colors ${
                isDark ? 'text-white group-hover:text-fedem-300' : 'text-gray-900 group-hover:text-fedem-700'
              }`}>
                {s.title}
              </h3>
              <div className="flex items-end justify-between gap-4">
                <p className={`text-sm leading-relaxed ${isDark ? 'text-white/35' : 'text-gray-500'}`}>{s.desc}</p>
                <ArrowRight className={`h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                  isDark ? 'text-fedem-400' : 'text-fedem-600'
                }`} aria-hidden="true" />
              </div>
              {(i + 1) % 4 !== 0 && (
                <div className={`absolute right-0 top-8 hidden h-[calc(100%-4rem)] w-px xl:block ${
                  isDark ? 'bg-white/[0.07]' : 'bg-gray-200'
                }`} />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className={`rounded-3xl p-10 max-w-3xl mx-auto relative overflow-hidden backdrop-blur-xl border ${
            isDark ? 'bg-fedem-600/8 border-fedem-500/15' : 'bg-fedem-50/80 border-fedem-200/60'
          }`}>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-fedem-500/15 rounded-full blur-[60px]" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-fedem-600/10 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Besoin d'un accompagnement personnalisé ?
              </h3>
              <p className={`mb-6 max-w-lg mx-auto ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                Notre équipe est à votre disposition pour tous vos projets d'entreprenariat.
              </p>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-fedem-600 hover:bg-fedem-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-fedem-600/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Contactez-nous
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
