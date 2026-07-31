import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { PARTNER_LOGOS } from '../lib/constants';

export default function Partners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const { isDark } = useTheme();

  // Duplicate logos for infinite marquee
  const logos = [...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS];

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-white'}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>
            Partenaires
          </span>
          <h2 className={`mt-3 text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ils nous font <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">confiance</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r ${isDark ? 'from-black to-transparent' : 'from-white to-transparent'}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l ${isDark ? 'from-black to-transparent' : 'from-white to-transparent'}`} />

        <div className="flex animate-marquee w-max">
          {logos.map((logo, i) => (
            <div
              key={`${logo.name}-${i}`}
              className={`flex-shrink-0 mx-8 flex items-center justify-center w-48 h-24 rounded-2xl px-6 transition-all duration-300 ${
                isDark
                  ? 'bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08]'
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
              }`}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className={`max-h-12 max-w-[140px] object-contain ${isDark ? 'brightness-0 invert opacity-50 hover:opacity-80' : 'opacity-60 hover:opacity-100'} transition-all duration-300`}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
