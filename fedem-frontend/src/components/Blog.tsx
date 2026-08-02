import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Calendar,
  Clock,
  Handshake,
  Heart,
  GraduationCap,
  Megaphone,
  Monitor,
  Network,
  Scale,
  Sprout,
  Tag,
  TrendingUp,
  Users,
  Wheat,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useBlogAdmin } from '../context/BlogAdminContext';
import { BG_LEAVES } from '../lib/constants';
import type { BlogPost } from '../data/blogPosts';

const visualStyles: Record<NonNullable<BlogPost['visual']>, { icon: LucideIcon; label: string; gradient: string }> = {
  reforestation: { icon: Sprout, label: 'Reboisement', gradient: 'from-emerald-950 via-emerald-800 to-lime-600' },
  partnership: { icon: Handshake, label: 'Convention universitaire', gradient: 'from-slate-950 via-indigo-900 to-violet-600' },
  territory: { icon: Building2, label: 'Anjozorobe', gradient: 'from-amber-950 via-orange-800 to-amber-500' },
  producers: { icon: Users, label: 'Communautés rurales', gradient: 'from-teal-950 via-teal-800 to-cyan-600' },
  women: { icon: Heart, label: '8 mars 2025', gradient: 'from-rose-950 via-fuchsia-800 to-rose-500' },
  mobilization: { icon: Megaphone, label: 'Vehivavy FEDEM', gradient: 'from-violet-950 via-purple-800 to-pink-500' },
  network: { icon: Network, label: "Organisation de l'action locale", gradient: 'from-cyan-950 via-sky-800 to-blue-600' },
  training: { icon: GraduationCap, label: 'Formation et recherche-action', gradient: 'from-indigo-950 via-indigo-800 to-blue-500' },
  digital: { icon: Monitor, label: 'Gestion et digitalisation', gradient: 'from-slate-950 via-slate-800 to-cyan-600' },
  legal: { icon: Scale, label: 'Foncier et aménagement', gradient: 'from-stone-950 via-amber-900 to-orange-600' },
  sectors: { icon: Wheat, label: 'Filières et activités', gradient: 'from-green-950 via-green-800 to-yellow-500' },
  social: { icon: Megaphone, label: 'Canal Facebook officiel', gradient: 'from-blue-950 via-blue-800 to-blue-500' },
  statistics: { icon: TrendingUp, label: 'Données du secteur agricole', gradient: 'from-emerald-950 via-teal-800 to-sky-600' },
};

function PostVisual({ post, className = '' }: { post: BlogPost; className?: string }) {
  const image = post.images?.[0] ?? (post.image ? { src: post.image, alt: post.title } : undefined);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [image?.src]);

  if (image && !imageFailed) {
    return (
      <img
        src={image.src}
        alt={image.alt}
        className={`h-full w-full object-cover ${className}`}
        style={{ objectPosition: post.imagePosition ?? 'center' }}
        onError={() => setImageFailed(true)}
      />
    );
  }

  const visual = visualStyles[post.visual ?? 'territory'];
  const Icon = visual.icon;

  return (
    <div className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br ${visual.gradient} ${className}`} role="img" aria-label={`Illustration : ${post.title}`}>
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/15" />
      <div className="absolute -bottom-24 -left-14 h-64 w-64 rounded-full bg-white/5" />
      <div className="absolute left-[15%] top-[18%] h-2 w-2 rounded-full bg-white/35" />
      <div className="relative flex flex-col items-center px-7 text-center text-white">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20 backdrop-blur-md">
          <Icon className="h-9 w-9" strokeWidth={1.6} />
        </span>
        <span className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Actualité FEDEM</span>
        <span className="mt-2 max-w-xs text-2xl font-semibold leading-tight">{visual.label}</span>
      </div>
    </div>
  );
}

function GalleryImage({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure>
      <img
        src={src}
        alt={alt}
        className="aspect-[4/3] w-full rounded-2xl object-cover"
        loading="lazy"
        onError={() => setFailed(true)}
      />
      {caption && <figcaption className="mt-2 px-1 text-xs leading-relaxed text-gray-500">{caption}</figcaption>}
    </figure>
  );
}

export default function Blog() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();
  const { publishedPosts } = useBlogAdmin();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPost(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selectedPost]);

  const newsPosts = publishedPosts.filter((post) => post.kind === 'news');
  const resourcePosts = publishedPosts.filter((post) => post.kind !== 'news');
  const featuredPost = newsPosts[0] ?? resourcePosts[0];

  if (!featuredPost) return null;

  return (
    <section id="blog" ref={ref} className="relative overflow-hidden py-28 lg:py-36">
      <div className="absolute inset-0">
        <img src={BG_LEAVES.blog} alt="" className="h-full w-full scale-110 object-cover opacity-40 blur-[10px]" />
        <div className={`absolute inset-0 ${isDark ? 'bg-black/90' : 'bg-white/94'}`} />
      </div>
      <div className="pointer-events-none absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-fedem-600/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-3xl"
        >
          <span className={`text-sm font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>Ressources FEDEM</span>
          <h2 className={`mt-4 text-3xl font-bold sm:text-4xl lg:text-5xl ${isDark ? 'text-white' : 'text-gray-950'}`}>
            Comprendre nos actions et <span className="bg-gradient-to-r from-fedem-600 to-fedem-400 bg-clip-text text-transparent">suivre nos actualités</span>
          </h2>
          <p className={`mt-6 text-lg leading-relaxed ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
            Des actualités construites à partir des archives photographiques communiquées par la FEDEM et des informations institutionnelles publiées sur fedem.mg.
          </p>
        </motion.header>

        <motion.article
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mb-8 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10"
        >
          <button type="button" onClick={() => setSelectedPost(featuredPost)} className="group relative grid min-h-[520px] w-full text-left lg:grid-cols-[1.2fr_0.8fr]" aria-label={`Lire : ${featuredPost.title}`}>
            <div className="absolute inset-0 lg:relative">
              <PostVisual post={featuredPost} className="transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
            </div>
            <div className="relative z-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/55 to-transparent p-7 lg:justify-center lg:bg-[#073f32] lg:p-12">
              <span className="mb-5 inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-fedem-300"><Tag className="h-3.5 w-3.5" /> {featuredPost.category}</span>
              <h3 className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl">{featuredPost.title}</h3>
              <p className="mt-5 max-w-xl leading-relaxed text-white/60">{featuredPost.excerpt}</p>
              <div className="mt-8 flex items-center justify-between gap-5">
                <span className="flex items-center gap-2 text-sm text-white/45"><Clock className="h-4 w-4" /> {featuredPost.readTime}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all group-hover:translate-x-1 group-hover:bg-fedem-500"><ArrowUpRight className="h-4 w-4" /></span>
              </div>
            </div>
          </button>
        </motion.article>

        {newsPosts.length > 0 && (
        <div className="mb-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsPosts.slice(1).map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 26 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.12 + index * 0.05 }}
              className={`overflow-hidden rounded-3xl border transition-all duration-300 ${isDark ? 'border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07]' : 'border-gray-200/70 bg-white/75 shadow-sm hover:-translate-y-1 hover:shadow-xl'}`}
            >
              <button type="button" onClick={() => setSelectedPost(post)} className="group flex h-full w-full flex-col text-left" aria-label={`Lire : ${post.title}`}>
                <div className="relative h-52 w-full overflow-hidden">
                  <PostVisual post={post} className="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`text-xl font-bold leading-snug transition-colors ${isDark ? 'text-white group-hover:text-fedem-300' : 'text-gray-950 group-hover:text-fedem-700'}`}>{post.title}</h3>
                  <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{post.excerpt}</p>
                  <div className={`mt-6 flex items-center justify-between border-t pt-4 text-xs ${isDark ? 'border-white/[0.07] text-white/30' : 'border-gray-100 text-gray-400'}`}>
                    <span className="flex items-center gap-1.5">
                      {post.date ? <Calendar className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                      {post.date ?? post.sourceLabel}
                    </span>
                    <span className="flex items-center gap-1.5">{post.readTime} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
        )}

        {resourcePosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mb-9 max-w-2xl"
        >
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>Dossiers institutionnels</span>
          <h3 className={`mt-3 text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-950'}`}>Approfondir le modèle et les services FEDEM</h3>
        </motion.div>
        )}

        {resourcePosts.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {resourcePosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 26 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.04 }}
              className={`overflow-hidden rounded-3xl border transition-all duration-300 ${isDark ? 'border-white/[0.07] bg-white/[0.04] hover:bg-white/[0.07]' : 'border-gray-200/70 bg-white/75 shadow-sm hover:-translate-y-1 hover:shadow-xl'}`}
            >
              <button type="button" onClick={() => setSelectedPost(post)} className="group flex h-full w-full flex-col text-left" aria-label={`Lire : ${post.title}`}>
                <div className="relative h-48 w-full overflow-hidden">
                  <PostVisual post={post} className="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className={`text-xl font-bold leading-snug transition-colors ${isDark ? 'text-white group-hover:text-fedem-300' : 'text-gray-950 group-hover:text-fedem-700'}`}>{post.title}</h3>
                  <p className={`mt-3 line-clamp-3 text-sm leading-relaxed ${isDark ? 'text-white/40' : 'text-gray-500'}`}>{post.excerpt}</p>
                  <div className={`mt-6 flex items-center justify-between border-t pt-4 text-xs ${isDark ? 'border-white/[0.07] text-white/30' : 'border-gray-100 text-gray-400'}`}>
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {post.sourceLabel}</span>
                    <span className="flex items-center gap-1.5">{post.readTime} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                  </div>
                </div>
              </button>
            </motion.article>
          ))}
        </div>
        )}

      </div>

      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.currentTarget === event.target) setSelectedPost(null);
            }}
          >
            <motion.article
              role="dialog"
              aria-modal="true"
              aria-labelledby="blog-dialog-title"
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className={`relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-[2rem] shadow-2xl sm:rounded-[2rem] ${isDark ? 'bg-[#111714] text-white' : 'bg-white text-gray-950'}`}
            >
              <button type="button" onClick={() => setSelectedPost(null)} className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-md transition-transform hover:scale-105" aria-label="Fermer l'article">
                <X className="h-5 w-5" />
              </button>
              <div className="relative h-64 sm:h-80">
                <PostVisual post={selectedPost} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <span className="absolute bottom-6 left-6 rounded-full bg-fedem-600/85 px-3 py-1 text-xs font-semibold text-white">{selectedPost.category}</span>
              </div>
              <div className="p-6 sm:p-10">
                <h2 id="blog-dialog-title" className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{selectedPost.title}</h2>
                <p className={`mt-5 text-lg leading-relaxed ${isDark ? 'text-white/55' : 'text-gray-600'}`}>{selectedPost.excerpt}</p>
                <div className={`my-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                <div className={`space-y-5 leading-relaxed ${isDark ? 'text-white/65' : 'text-gray-600'}`}>
                  {selectedPost.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {selectedPost.images && selectedPost.images.length > 1 && (
                  <div className="mt-9 grid gap-4 sm:grid-cols-2">
                    {selectedPost.images.slice(1).map((image) => (
                      <GalleryImage
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        caption={image.caption}
                      />
                    ))}
                  </div>
                )}
                <div className="mt-8 flex flex-wrap gap-2">
                  {selectedPost.highlights.map((highlight) => (
                    <span key={highlight} className={`rounded-full px-3 py-1.5 text-xs font-medium ${isDark ? 'bg-fedem-500/10 text-fedem-300' : 'bg-fedem-50 text-fedem-800'}`}>{highlight}</span>
                  ))}
                </div>
                <div className={`mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                  <span className={`flex flex-wrap items-center gap-4 text-sm ${isDark ? 'text-white/35' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {selectedPost.readTime}</span>
                    {selectedPost.date && <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {selectedPost.date}</span>}
                  </span>
                  {selectedPost.sourceUrl ? (
                    <a href={selectedPost.sourceUrl} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 text-sm font-semibold ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>
                      Consulter la source : {selectedPost.sourceLabel} <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className={`text-sm font-semibold ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>{selectedPost.sourceLabel}</span>
                  )}
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}