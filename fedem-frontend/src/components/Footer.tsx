import { ArrowUp, ArrowUpRight, LockKeyhole, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO, USEFUL_LINKS } from '../lib/constants';
import BrandLogo from './BrandLogo';
import { useBlogAdmin } from '../context/BlogAdminContext';

export default function Footer() {
  const { isDark } = useTheme();
  const { openAdmin } = useBlogAdmin();

  return (
    <footer className={`relative border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-fedem-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <a href="#accueil" className={`mb-6 inline-flex rounded-2xl p-3 ${isDark ? 'bg-white/[0.96]' : 'bg-transparent'}`} aria-label="FEDEM Madagascar - Accueil">
              <BrandLogo className="h-36 w-36" />
            </a>
            <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
              Fédération des Dirigeants et Entrepreneurs de Madagascar. Mettre l'humain au cœur de l'activité économique.
            </p>
            <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
              Agrément n° 1997/21-MID/SG/<br />PREF.POLI.ANT/ASS du 24/11/2021
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
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

          {/* Useful links */}
          <div className="lg:col-span-4">
            <h4 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Liens utiles</h4>
            <ul className="space-y-3">
              {USEFUL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex items-start gap-2 text-sm leading-relaxed transition-colors ${
                      isDark ? 'text-white/35 hover:text-fedem-400' : 'text-gray-400 hover:text-fedem-600'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className={`text-sm transition-colors ${isDark ? 'text-white/35 hover:text-fedem-400' : 'text-gray-400 hover:text-fedem-600'}`}>
                  Nous contacter
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className={`text-sm font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
            <ul className="space-y-5">
              <li>
                <a href={CONTACT_INFO.phoneHref} className={`group flex items-start gap-3 text-sm transition-colors ${isDark ? 'text-white/40 hover:text-fedem-400' : 'text-gray-500 hover:text-fedem-600'}`}>
                  <Phone className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  <span><strong className={`mb-1 block text-xs ${isDark ? 'text-white/70' : 'text-gray-700'}`}>Téléphone</strong>{CONTACT_INFO.phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className={`group flex items-start gap-3 text-sm transition-colors ${isDark ? 'text-white/40 hover:text-fedem-400' : 'text-gray-500 hover:text-fedem-600'}`}>
                  <Mail className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  <span><strong className={`mb-1 block text-xs ${isDark ? 'text-white/70' : 'text-gray-700'}`}>E-mail</strong>{CONTACT_INFO.email}</span>
                </a>
              </li>
              <li className={`flex items-start gap-3 text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                <MapPin className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                <address className="not-italic">
                  <strong className={`mb-1 block text-xs ${isDark ? 'text-white/70' : 'text-gray-700'}`}>Adresse</strong>
                  3ème étage, Immeuble Héritage<br />
                  Lot IVX 72 Bis F Ankazomanga<br />
                  Antananarivo, Madagascar
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <p className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
            © {new Date().getFullYear()} FEDEM Madagascar. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openAdmin}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors ${
                isDark ? 'text-white/25 hover:bg-white/5 hover:text-fedem-400' : 'text-gray-300 hover:bg-gray-50 hover:text-fedem-700'
              }`}
            >
              <LockKeyhole className="h-3.5 w-3.5" /> Administration
            </button>
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
      </div>
    </footer>
  );
}
