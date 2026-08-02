import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import BrandLogo from './BrandLogo';

const navLinks = [
  { href: '#accueil', id: 'accueil', label: 'Accueil', description: 'Vision et engagement' },
  { href: '#apropos', id: 'apropos', label: 'À propos', description: 'Mission, équipe et statut' },
  { href: '#services', id: 'services', label: 'Services', description: 'Accompagnement et expertises' },
  { href: '#blog', id: 'blog', label: 'Blog', description: 'Dossiers et actualités' },
  { href: '#contact', id: 'contact', label: 'Contact', description: 'Bureaux et prise de contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
      let current = navLinks[0].id;

      navLinks.forEach((link) => {
        const section = document.getElementById(link.id);
        if (section && section.offsetTop <= marker) current = link.id;
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        current = 'contact';
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [isOpen]);

  const navigateTo = (event: MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[number]) => {
    event.preventDefault();
    setActiveSection(link.id);
    setIsOpen(false);
    window.history.pushState(null, '', link.href);
    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      aria-label="Navigation principale"
      className={`fixed left-0 right-0 top-0 z-[70] isolate transition-all duration-500 ${
        scrolled
          ? isDark
            ? 'bg-black/70 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30'
            : 'bg-white/70 backdrop-blur-2xl border-b border-black/5 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <motion.a href="#accueil" onClick={(event) => navigateTo(event, navLinks[0])} className="group flex items-center gap-3" whileHover={{ scale: 1.02 }} aria-label="FEDEM Madagascar - Accueil">
            <span className="flex h-14 w-16 shrink-0 items-center justify-center">
              <BrandLogo priority variant="mark" className="h-full w-full drop-shadow-sm" />
            </span>
            <span className="hidden sm:block">
              <span className={`block text-xl font-black tracking-[-0.04em] ${isDark ? 'text-white' : 'text-[#074675]'}`}>FEDEM</span>
              <span className={`block text-[9px] font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white/45' : 'text-slate-400'}`}>Madagascar</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(event) => navigateTo(event, link)}
                aria-current={activeSection === link.id ? 'page' : undefined}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 group ${
                  activeSection === link.id
                    ? isDark ? 'text-white' : 'text-gray-950'
                    : isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
                <span className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-fedem-500 transition-all duration-300 group-hover:w-6 ${activeSection === link.id ? 'w-6' : 'w-0'}`} />
              </motion.a>
            ))}

            {/* Theme Toggle */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              className={`mx-2 p-2.5 rounded-xl transition-all duration-300 ${
                isDark ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Changer le thème"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            <motion.a
              href="#contact"
              onClick={(event) => navigateTo(event, navLinks[4])}
              className="ml-2 px-6 py-2.5 bg-fedem-600 hover:bg-fedem-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-fedem-600/25 hover:shadow-fedem-500/35"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nous contacter
            </motion.a>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <motion.button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}
              whileTap={{ scale: 0.9 }}
              aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className={`relative z-20 p-2 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}
              whileTap={{ scale: 0.9 }}
              aria-label={isOpen ? 'Fermer le menu des sections' : 'Afficher les sections'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute inset-x-0 top-full h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t shadow-2xl md:hidden ${
              isDark ? 'bg-black/95 backdrop-blur-2xl border-white/5' : 'bg-white/95 backdrop-blur-2xl border-gray-100'
            }`}
          >
            <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-6 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
              <p className={`mb-7 text-xs font-semibold uppercase tracking-[0.22em] ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>Navigation</p>
              <div className="space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => navigateTo(event, link)}
                  aria-current={activeSection === link.id ? 'page' : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`group flex items-center gap-4 border-b px-1 py-5 transition-colors ${
                    activeSection === link.id
                      ? isDark ? 'border-fedem-500/30 text-white' : 'border-fedem-200 text-gray-950'
                      : isDark ? 'border-white/[0.07] text-white/60 hover:text-white' : 'border-gray-100 text-gray-600 hover:text-gray-950'
                  }`}
                >
                  <span className={`text-xs font-bold ${activeSection === link.id ? 'text-fedem-500' : isDark ? 'text-white/20' : 'text-gray-300'}`}>0{i + 1}</span>
                  <span className="flex-1">
                    <span className="block text-2xl font-semibold">{link.label}</span>
                    <span className={`mt-1 block text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{link.description}</span>
                  </span>
                  <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${activeSection === link.id ? 'text-fedem-500' : 'opacity-30'}`} aria-hidden="true" />
                </motion.a>
              ))}
              </div>
              <p className={`mt-auto pt-10 text-xs leading-relaxed ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
                Fédération des Dirigeants et Entrepreneurs de Madagascar
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
