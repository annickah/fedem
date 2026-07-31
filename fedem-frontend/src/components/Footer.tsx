import { Leaf, ArrowUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`relative border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-fedem-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fedem-500 to-fedem-700 flex items-center justify-center shadow-lg shadow-fedem-500/20">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>FEDEM</span>
                <span className={`block text-[10px] tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Madagascar</span>
              </div>
            </div>
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Fédération des Dirigeants et Entrepreneurs de Madagascar. Mettre l'humain au cœur de l'activité économique.
            </p>
            <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
              Agrément n° 1997/21-MID/SG/<br />PREF.POLI.ANT/ASS du 24/11/2021
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', href: '#accueil' },
                { label: 'À propos', href: '#apropos' },
                { label: 'Services', href: '#services' },
                { label: 'Blog', href: '#blog' },
                { label: 'Contact', href: '#contact' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={`text-sm transition-colors ${isDark ? 'text-white/30 hover:text-fedem-400' : 'text-gray-400 hover:text-fedem-600'}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Services</h4>
            <ul className="space-y-3">
              {['Formation', 'Coaching', 'Business Plan', 'Digitalisation', 'Agrobusiness', 'Écotourisme'].map((s) => (
                <li key={s}>
                  <a href="#services" className={`text-sm transition-colors ${isDark ? 'text-white/30 hover:text-fedem-400' : 'text-gray-400 hover:text-fedem-600'}`}>{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
            <ul className="space-y-4">
              <li className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                <span className={`block text-xs font-medium mb-1 ${isDark ? 'text-fedem-400/80' : 'text-fedem-600'}`}>Siège social</span>
                3ème étage, Immeuble Héritage<br />Lot IVX 72 BIS F Ankazomanga<br />Antananarivo, Madagascar
              </li>
              <li className={`text-sm ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                <span className={`block text-xs font-medium mb-1 ${isDark ? 'text-fedem-400/80' : 'text-fedem-600'}`}>Email</span>
                contact@fedem.mg
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
            © {new Date().getFullYear()} FEDEM Madagascar. Tous droits réservés.
          </p>
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              isDark
                ? 'bg-white/5 border border-white/[0.06] text-white/40 hover:text-fedem-400 hover:bg-fedem-600/10'
                : 'bg-gray-50 border border-gray-100 text-gray-400 hover:text-fedem-600 hover:bg-fedem-50'
            }`}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Retour en haut"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
