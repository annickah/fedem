import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useBlogAdmin } from '../context/BlogAdminContext';

function Counter({ end, suffix, prefix = '', inView }: { end: number; suffix: string; prefix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const inc = end / 120;
    const timer = setInterval(() => {
      start += inc;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [end, inView]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();
  const { siteSettings } = useBlogAdmin();

  return (
    <section ref={ref} className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-black via-fedem-950/30 to-black' : 'bg-gradient-to-b from-white via-fedem-50 to-white'}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-fedem-600/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>
            Données significatives
          </span>
          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Le secteur agricole en{' '}
            <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">chiffres</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {siteSettings.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`rounded-2xl p-6 text-center group transition-all duration-300 backdrop-blur-xl border ${
                isDark
                  ? 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]'
                  : 'bg-white/60 border-gray-200/60 hover:bg-white/90 hover:shadow-md'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent mb-2">
                <Counter end={s.value} suffix={s.suffix} prefix={s.prefix} inView={isInView} />
              </div>
              <div className={`text-sm font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.label}</div>
              <div className={`text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{s.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
