import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Calendar, ArrowUpRight, Clock, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { BG_LEAVES } from '../lib/constants';

// URL de base de l'API — adapte si besoin (variable d'env, etc.)
const API_URL = 'http://localhost:8000/api/actualites';

// Image de secours si l'actualité n'a pas d'image renseignée
const FALLBACK_IMAGE =
  'https://images.pexels.com/photos/19239387/pexels-photo-19239387.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  resume: string | null;
  categorie: string | null;
  tempsLecture: string | null;
  image: string | null;
  createdAt: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();

  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchActualites() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const data = await response.json();

        if (!cancelled) {
          setActualites(data.actualites ?? []);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des actualités:', err);
        if (!cancelled) {
          setError("Impossible de charger les actualités pour le moment.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchActualites();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="blog" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      {/* Blurred leaf bg */}
      <div className="absolute inset-0">
        <img src={BG_LEAVES.blog} alt="" className="w-full h-full object-cover blur-[10px] scale-110 opacity-40" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/88' : 'bg-white/92'}`} />
      </div>

      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-fedem-600/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>
            Blog & Actualités
          </span>
          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Dernières{' '}
            <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">nouvelles</span>
          </h2>
          <p className={`mt-6 max-w-2xl mx-auto text-lg ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Actualités, projets et initiatives de la FEDEM pour le développement de l'entreprenariat.
          </p>
        </motion.div>

        {loading && (
          <p className={`text-center ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Chargement des actualités...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {!loading && !error && actualites.length === 0 && (
          <p className={`text-center ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Aucune actualité publiée pour le moment.
          </p>
        )}

        {!loading && !error && actualites.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Featured */}
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="group lg:row-span-2 relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0">
                <img
                  src={actualites[0].image || FALLBACK_IMAGE}
                  alt={actualites[0].titre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-end p-8 min-h-[500px]">
                {actualites[0].categorie && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fedem-600/80 text-xs font-medium text-white w-fit mb-4">
                    <Tag className="w-3 h-3" />{actualites[0].categorie}
                  </span>
                )}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-fedem-300 transition-colors">
                  {actualites[0].titre}
                </h3>
                <p className="text-white/50 mb-6 line-clamp-3">
                  {actualites[0].resume || actualites[0].contenu}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />{formatDate(actualites[0].createdAt)}
                    </span>
                    {actualites[0].tempsLecture && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />{actualites[0].tempsLecture}
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center group-hover:bg-fedem-600/40 transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Other posts */}
            {actualites.slice(1).map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                className={`group rounded-2xl overflow-hidden flex flex-col sm:flex-row cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]'
                    : 'bg-white/60 border-gray-200/60 hover:bg-white/90 hover:shadow-lg'
                }`}
              >
                <div className="sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                  <img
                    src={post.image || FALLBACK_IMAGE}
                    alt={post.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    {post.categorie && (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isDark ? 'text-fedem-400 bg-fedem-600/10' : 'text-fedem-700 bg-fedem-50'}`}>
                        {post.categorie}
                      </span>
                    )}
                    {post.tempsLecture && (
                      <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />{post.tempsLecture}
                      </span>
                    )}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${isDark ? 'text-white group-hover:text-fedem-300' : 'text-gray-900 group-hover:text-fedem-700'}`}>
                    {post.titre}
                  </h3>
                  <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-white/35' : 'text-gray-500'}`}>
                    {post.resume || post.contenu}
                  </p>
                  <span className={`text-xs flex items-center gap-1.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                    <Calendar className="w-3.5 h-3.5" />{formatDate(post.createdAt)}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
