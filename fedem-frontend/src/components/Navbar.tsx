import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Leaf, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#apropos', label: 'À propos' },
  { href: '#services', label: 'Services' },
  { href: '#blog', label: 'Blog' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? isDark
            ? 'bg-black/70 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30'
            : 'bg-white/70 backdrop-blur-2xl border-b border-black/5 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a href="#accueil" className="flex items-center gap-3 group" whileHover={{ scale: 1.02 }}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fedem-500 to-fedem-700 flex items-center justify-center shadow-lg shadow-fedem-500/25">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-fedem-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>FEDEM</span>
              <span className={`hidden sm:block text-[10px] tracking-[0.2em] uppercase ${isDark ? 'text-white/40' : 'text-gray-400'}`}>Madagascar</span>
            </div>
          </motion.a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 group ${
                  isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-fedem-500 rounded-full transition-all duration-300 group-hover:w-6" />
              </motion.a>
            ))}

            {/* Theme Toggle */}
            <motion.button
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
              onClick={toggleTheme}
              className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-white/60' : 'bg-gray-100 text-gray-600'}`}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-900'}`}
              whileTap={{ scale: 0.9 }}
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:hidden border-t ${
              isDark ? 'bg-black/90 backdrop-blur-2xl border-white/5' : 'bg-white/95 backdrop-blur-2xl border-gray-100'
            }`}
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`block px-4 py-3 rounded-xl transition-colors font-medium ${
                    isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="block mt-4 px-4 py-3 bg-fedem-600 text-white text-center rounded-xl font-semibold"
              >
                Nous contacter
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
