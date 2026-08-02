import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BG_LEAVES } from '../lib/constants';
import OrganicMedia from './OrganicMedia';
import BrandLogo from './BrandLogo';

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background leaf image – blurred */}
      <div className="absolute inset-0">
        <img
          src={BG_LEAVES.hero}
          alt=""
          className="w-full h-full object-cover scale-110 blur-[2px]"
        />
        <div className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-b from-black/85 via-black/75 to-black/95'
            : 'bg-gradient-to-b from-white/85 via-white/70 to-white/95'
        }`} />
      </div>

      {/* Blurred color blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-fedem-500/20 blur-[140px] animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-fedem-600/15 blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-fedem-400/10 blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute top-32 right-[15%] w-20 h-20 border rounded-2xl rotate-12 hidden lg:block ${isDark ? 'border-fedem-500/20' : 'border-fedem-600/15'}`}
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute bottom-40 left-[10%] w-16 h-16 border rounded-full hidden lg:block ${isDark ? 'border-fedem-400/15' : 'border-fedem-600/10'}`}
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-[8%] w-3 h-3 bg-fedem-500/40 rounded-full hidden lg:block"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            {/* Brand signal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-7 flex items-center gap-5"
            >
              <span className="flex h-24 w-28 shrink-0 items-center justify-center sm:h-28 sm:w-32">
                <BrandLogo priority variant="mark" className="h-full w-full drop-shadow-lg" />
              </span>
              <span className={`text-5xl font-black tracking-[-0.06em] sm:text-6xl xl:text-7xl ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                FEDEM
                <span className={`block font-serif text-xl font-medium italic tracking-normal sm:text-2xl ${
                  isDark ? 'text-fedem-400' : 'text-fedem-700'
                }`}>
                  Madagascar
                </span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight mb-8"
            >
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Mettre l'humain</span>
              <br />
              <span className="bg-gradient-to-r from-fedem-500 via-fedem-400 to-fedem-600 bg-clip-text text-transparent font-serif italic">
                au cœur
              </span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}> de l'activité</span>
              <br />
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Économique</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`max-w-lg text-lg leading-relaxed mb-10 ${isDark ? 'text-white/50' : 'text-gray-500'}`}
            >
              Oser construire une société plus juste, pour partager, défendre des valeurs
              et se former à son métier de dirigeants et d'entrepreneurs à Madagascar.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.a
                href="#apropos"
                className="group px-8 py-4 bg-fedem-600 hover:bg-fedem-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-fedem-600/25 hover:shadow-fedem-500/35 flex items-center gap-3"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Découvrir la FEDEM
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#services"
                className={`px-8 py-4 font-medium rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
                    : 'bg-black/5 border-black/10 text-gray-700 hover:bg-black/10 hover:text-gray-900'
                }`}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Nos Services
              </motion.a>
            </motion.div>

          </div>

          {/* Right: organic image composition */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative mt-2 lg:mt-0"
          >
            <OrganicMedia isDark={isDark} />
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${isDark ? 'from-black to-transparent' : 'from-white to-transparent'}`} />
    </section>
  );
}
