import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  BarChart3,
  Clock3,
  Database,
  Download,
  Eye,
  EyeOff,
  FileText,
  Handshake,
  Image as ImageIcon,
  Inbox,
  LockKeyhole,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useBlogAdmin } from '../context/BlogAdminContext';
import { useTheme } from '../context/ThemeContext';
import type { BlogPost } from '../data/blogPosts';
import type { InquiryStatus } from '../data/adminTypes';
import type { SiteSettings } from '../data/siteContent';

type AdminTab = 'dashboard' | 'articles' | 'inquiries' | 'settings' | 'backup';

type DraftPost = BlogPost & {
  bodyText: string;
  tagsText: string;
  imageAlt: string;
};

const visualOptions: Array<{ value: NonNullable<BlogPost['visual']>; label: string }> = [
  { value: 'territory', label: 'Territoire' },
  { value: 'reforestation', label: 'Reboisement' },
  { value: 'partnership', label: 'Partenariat' },
  { value: 'producers', label: 'Producteurs' },
  { value: 'women', label: 'Femmes' },
  { value: 'mobilization', label: 'Mobilisation' },
  { value: 'network', label: 'Réseau' },
  { value: 'training', label: 'Formation' },
  { value: 'digital', label: 'Digitalisation' },
  { value: 'legal', label: 'Juridique et foncier' },
  { value: 'sectors', label: 'Filières' },
  { value: 'statistics', label: 'Statistiques' },
];

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function createDraft(post?: BlogPost): DraftPost {
  if (post) {
    return {
      ...post,
      bodyText: post.paragraphs.join('\n\n'),
      tagsText: post.highlights.join(', '),
      imageAlt: post.images?.[0]?.alt ?? post.title,
    };
  }

  return {
    id: Date.now(),
    slug: '',
    title: '',
    excerpt: '',
    category: 'Actualité',
    readTime: '3 min',
    sourceLabel: 'FEDEM Madagascar',
    paragraphs: [],
    highlights: [],
    kind: 'news',
    published: true,
    visual: 'territory',
    images: [],
    imagePosition: 'center',
    bodyText: '',
    tagsText: '',
    imageAlt: '',
  };
}

export default function AdminDashboard() {
  const {
    posts,
    isAuthenticated,
    isAdminOpen,
    isConfigured,
    isLoading,
    canDelete,
    userEmail,
    storageError,
    apiUnavailable,
    metrics,
    inquiries,
    siteSettings,
    closeAdmin,
    login,
    logout,
    savePost,
    deletePost,
    resetPosts,
    uploadImage,
    refreshAdminData,
    updateInquiry,
    saveSiteSettings,
    exportDatabase,
  } = useBlogAdmin();
  const { isDark } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftPost>(createDraft());
  const [notice, setNotice] = useState('');
  const [imageError, setImageError] = useState('');
  const [processingImage, setProcessingImage] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [inquiryFilter, setInquiryFilter] = useState<'all' | InquiryStatus>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatus>('new');
  const [replyText, setReplyText] = useState('');
  const [inquiryNotice, setInquiryNotice] = useState('');
  const [savingInquiry, setSavingInquiry] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<SiteSettings>(siteSettings);
  const [settingsNotice, setSettingsNotice] = useState('');

  useEffect(() => {
    if (!isAdminOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAdmin();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isAdminOpen, closeAdmin]);

  useEffect(() => {
    if (!isAdminOpen || !isAuthenticated || editingId !== null || posts.length === 0) return;
    setEditingId(posts[0].id);
    setDraft(createDraft(posts[0]));
  }, [isAdminOpen, isAuthenticated, editingId, posts]);

  useEffect(() => {
    setSettingsDraft(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    if (isAdminOpen && isAuthenticated) void refreshAdminData();
  }, [isAdminOpen, isAuthenticated, refreshAdminData]);

  const selectedPostExists = useMemo(
    () => editingId !== null && posts.some((post) => post.id === editingId),
    [editingId, posts],
  );

  if (!isAdminOpen) return null;

  const panel = isDark ? 'bg-[#111714] text-white' : 'bg-white text-gray-950';
  const muted = isDark ? 'text-white/45' : 'text-gray-500';
  const border = isDark ? 'border-white/10' : 'border-gray-200';
  const field = `w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors ${
    isDark
      ? 'border-white/10 bg-white/[0.05] text-white placeholder:text-white/25 focus:border-fedem-500/60'
      : 'border-gray-200 bg-gray-50 text-gray-950 placeholder:text-gray-350 focus:border-fedem-500 focus:bg-white'
  }`;

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');
    const result = await login(username, password, authMode);
    if (!result.success) {
      setLoginError(result.message ?? 'Connexion refusée.');
      return;
    }
    setLoginError('');
    setPassword('');
  };

  const filteredInquiries = inquiries.filter((inquiry) => inquiryFilter === 'all' || inquiry.status === inquiryFilter);
  const selectedInquiry = inquiries.find((inquiry) => inquiry.id === selectedInquiryId) ?? null;

  const openInquiry = (id: string) => {
    const inquiry = inquiries.find((item) => item.id === id);
    if (!inquiry) return;
    setSelectedInquiryId(id);
    setInquiryStatus(inquiry.status);
    setReplyText(inquiry.responseText);
    setInquiryNotice('');
  };

  const saveInquiry = async (sendReply: boolean) => {
    if (!selectedInquiry) return;
    setSavingInquiry(true);
    setInquiryNotice('');
    try {
      const sent = await updateInquiry(selectedInquiry.id, inquiryStatus, replyText, sendReply);
      setInquiryNotice(sendReply ? (sent ? 'Réponse envoyée et demande mise à jour.' : 'Demande mise à jour. Configurez Resend pour envoyer automatiquement l’e-mail.') : 'Demande mise à jour.');
    } catch (error) {
      setInquiryNotice(error instanceof Error ? error.message : 'Mise à jour impossible.');
    } finally {
      setSavingInquiry(false);
    }
  };

  const saveSettings = async () => {
    setSettingsNotice('');
    try {
      await saveSiteSettings(settingsDraft);
      setSettingsNotice('Partenaires et statistiques enregistrés.');
    } catch (error) {
      setSettingsNotice(error instanceof Error ? error.message : 'Enregistrement impossible.');
    }
  };

  const selectPost = (post: BlogPost) => {
    setEditingId(post.id);
    setDraft(createDraft(post));
    setNotice('');
    setImageError('');
  };

  const createPost = () => {
    const nextDraft = createDraft();
    setEditingId(nextDraft.id);
    setDraft(nextDraft);
    setNotice('Nouvel article en préparation.');
    setImageError('');
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingImage(true);
    setImageError('');
    try {
      const image = await uploadImage(file, draft.id, draft.imageAlt || draft.title);
      setDraft((current) => ({
        ...current,
        image: undefined,
        images: [{ ...image, alt: current.imageAlt || current.title || image.alt }],
      }));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Impossible de traiter l'image.");
    } finally {
      setProcessingImage(false);
      event.target.value = '';
    }
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.excerpt.trim()) {
      setNotice('Le titre et le résumé sont obligatoires.');
      return;
    }

    const paragraphs = draft.bodyText
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    const highlights = draft.tagsText
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const primaryImage = draft.images?.[0];
    const { bodyText: _bodyText, tagsText: _tagsText, imageAlt: _imageAlt, ...postFields } = draft;
    const sourceUrl = /^https?:\/\//i.test(draft.sourceUrl?.trim() ?? '')
      ? draft.sourceUrl?.trim()
      : undefined;

    try {
      await savePost({
        ...postFields,
        slug: draft.slug.trim() || slugify(draft.title),
        paragraphs,
        highlights,
        sourceUrl,
        images: primaryImage
          ? [{ ...primaryImage, alt: draft.imageAlt.trim() || draft.title }]
          : [],
      });
      setNotice(draft.published === false ? 'Brouillon enregistré dans Postgres.' : 'Article enregistré et publié.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Impossible d'enregistrer l'article.");
    }
  };

  const handleDelete = async () => {
    if (!selectedPostExists) return;
    if (!window.confirm('Supprimer définitivement cet article ?')) return;

    try {
      await deletePost(draft.id);
      const nextPost = posts.find((post) => post.id !== draft.id);
      if (nextPost) {
        setEditingId(nextPost.id);
        setDraft(createDraft(nextPost));
      } else {
        createPost();
      }
      setNotice('Article supprimé de Postgres.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Impossible de supprimer l'article.");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md"
      >
        {!isAuthenticated ? (
          <div className="flex min-h-full items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`relative w-full max-w-md rounded-[2rem] border p-7 shadow-2xl sm:p-9 ${panel} ${border}`}
            >
              <button type="button" onClick={closeAdmin} className={`absolute right-5 top-5 rounded-full p-2 ${muted}`} aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-fedem-600 text-white shadow-lg shadow-fedem-600/20">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-2xl font-bold">Administration du blog</h2>
              <p className={`mt-2 text-sm leading-relaxed ${muted}`}>Connectez-vous pour publier et gérer les actualités FEDEM.</p>
              {!isConfigured ? (
                <div className="mt-7 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-4 text-sm leading-relaxed text-amber-600">
                  Le CMS Vercel n’est pas configuré pour ce déploiement.
                </div>
              ) : (
              <form onSubmit={handleLogin} className="mt-7 space-y-4">
                <div className={`grid grid-cols-2 rounded-xl p-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <button type="button" onClick={() => setAuthMode('password')} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${authMode === 'password' ? 'bg-fedem-600 text-white shadow-sm' : muted}`}>
                    Mot de passe
                  </button>
                  <button type="button" onClick={() => setAuthMode('pin')} className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${authMode === 'pin' ? 'bg-fedem-600 text-white shadow-sm' : muted}`}>
                    Code PIN
                  </button>
                </div>
                <div>
                  <label className={`mb-2 block text-xs font-semibold ${muted}`}>Adresse e-mail administrateur</label>
                  <input type="email" value={username} onChange={(event) => setUsername(event.target.value)} className={field} autoComplete="username" required />
                </div>
                <div>
                  <label className={`mb-2 block text-xs font-semibold ${muted}`}>{authMode === 'pin' ? 'Code PIN administrateur' : 'Mot de passe'}</label>
                  <input
                    type="password"
                    inputMode={authMode === 'pin' ? 'numeric' : undefined}
                    pattern={authMode === 'pin' ? '[0-9]{4,8}' : undefined}
                    minLength={authMode === 'pin' ? 4 : 8}
                    maxLength={authMode === 'pin' ? 8 : 256}
                    value={password}
                    onChange={(event) => setPassword(authMode === 'pin' ? event.target.value.replace(/\D/g, '') : event.target.value)}
                    className={field}
                    autoComplete="current-password"
                    required
                  />
                </div>
                {(loginError || apiUnavailable) && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-500">
                    <p className="font-semibold">{apiUnavailable ? 'Backend Vercel indisponible dans cet aperçu' : 'Connexion impossible'}</p>
                    <p className="mt-1">{loginError || 'Les routes API sécurisées ne sont pas exécutées par Arena.'}</p>
                    {apiUnavailable && (
                      <div className="mt-3 rounded-lg bg-white/50 px-3 py-2 text-xs text-red-700">
                        <p>Test local : <code>npx vercel dev</code></p>
                        <p className="mt-1">Test production : déployez le dépôt sur Vercel.</p>
                      </div>
                    )}
                  </div>
                )}
                <button type="submit" disabled={isLoading || apiUnavailable} className="w-full rounded-xl bg-fedem-600 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-fedem-500 disabled:cursor-not-allowed disabled:opacity-50">
                  {isLoading ? 'Vérification…' : 'Se connecter'}
                </button>
              </form>
              )}
              <p className={`mt-5 text-xs leading-relaxed ${muted}`}>Session privée sur cet appareil. Déconnectez-vous après chaque utilisation.</p>
            </motion.div>
          </div>
        ) : (
          <div className={`flex h-full flex-col ${panel}`}>
            <header className={`flex shrink-0 items-center justify-between gap-4 border-b px-4 py-3 sm:px-6 ${border}`}>
              <div>
                <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>FEDEM CMS</p>
                <h2 className="text-lg font-bold">Gestion des actualités</h2>
                <p className={`text-[11px] ${muted}`}>{userEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={logout} className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-sm sm:flex ${border} ${muted}`}>
                  <LogOut className="h-4 w-4" /> Déconnexion
                </button>
                <button type="button" onClick={closeAdmin} className={`rounded-xl border p-2.5 ${border}`} aria-label="Fermer l'administration">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </header>

            <nav className={`flex shrink-0 gap-1 overflow-x-auto border-b px-3 py-2 sm:px-6 ${border}`} aria-label="Sections du back-office">
              {[
                { id: 'dashboard' as const, label: 'Tableau de bord', icon: BarChart3 },
                { id: 'articles' as const, label: 'Articles', icon: FileText },
                { id: 'inquiries' as const, label: 'Demandes', icon: Inbox },
                { id: 'settings' as const, label: 'Partenaires & chiffres', icon: Handshake },
                { id: 'backup' as const, label: 'Sauvegarde', icon: Database },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-fedem-600 text-white'
                      : isDark ? 'text-white/45 hover:bg-white/5 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
                  }`}
                >
                  <tab.icon className="h-4 w-4" /> {tab.label}
                </button>
              ))}
            </nav>

            {activeTab === 'dashboard' && (
              <main className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
                <div className="mx-auto max-w-6xl">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div><p className={`text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>Vue d’ensemble</p><h3 className="mt-2 text-3xl font-bold">Tableau de bord</h3></div>
                    <button type="button" onClick={() => void refreshAdminData()} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm ${border}`}><RotateCcw className="h-4 w-4" /> Actualiser</button>
                  </div>
                  <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { label: 'Membres', value: metrics.memberCount, icon: Users, color: 'text-blue-500 bg-blue-500/10' },
                      { label: 'Demandes d’adhésion', value: metrics.membershipRequests, icon: Inbox, color: 'text-violet-500 bg-violet-500/10' },
                      { label: 'Articles publiés', value: metrics.publishedArticles, icon: FileText, color: 'text-fedem-600 bg-fedem-500/10' },
                      { label: 'Messages en attente', value: metrics.pendingMessages, icon: MessageSquare, color: 'text-amber-500 bg-amber-500/10' },
                    ].map((metric) => (
                      <div key={metric.label} className={`rounded-2xl border p-5 ${border} ${isDark ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                        <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${metric.color}`}><metric.icon className="h-5 w-5" /></span>
                        <strong className="mt-5 block text-3xl font-bold">{metric.value.toLocaleString('fr-FR')}</strong>
                        <span className={`mt-1 block text-sm ${muted}`}>{metric.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-6 rounded-3xl border p-6 ${border}`}>
                    <div className="flex items-center justify-between"><div><h4 className="font-bold">Dernières demandes</h4><p className={`mt-1 text-xs ${muted}`}>{metrics.totalInquiries} demande(s) reçue(s) au total</p></div><button type="button" onClick={() => setActiveTab('inquiries')} className="text-sm font-semibold text-fedem-600">Tout afficher</button></div>
                    <div className="mt-5 divide-y divide-gray-200/50">
                      {inquiries.slice(0, 5).map((inquiry) => (
                        <button key={inquiry.id} type="button" onClick={() => { openInquiry(inquiry.id); setActiveTab('inquiries'); }} className="flex w-full items-center gap-4 py-4 text-left">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${inquiry.type === 'membership' ? 'bg-violet-500/10 text-violet-500' : 'bg-blue-500/10 text-blue-500'}`}>{inquiry.type === 'membership' ? <Users className="h-4 w-4" /> : <Mail className="h-4 w-4" />}</span>
                          <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{inquiry.name}</strong><span className={`block truncate text-xs ${muted}`}>{inquiry.subject}</span></span>
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${inquiry.status === 'new' ? 'bg-red-500/10 text-red-500' : inquiry.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500' : 'bg-fedem-500/10 text-fedem-600'}`}>{inquiry.status === 'new' ? 'Nouveau' : inquiry.status === 'in_progress' ? 'En cours' : 'Traité'}</span>
                        </button>
                      ))}
                      {inquiries.length === 0 && <p className={`py-8 text-center text-sm ${muted}`}>Aucune demande reçue.</p>}
                    </div>
                  </div>
                </div>
              </main>
            )}

            {activeTab === 'articles' && (
            <div className="grid min-h-0 flex-1 lg:grid-cols-[320px_1fr]">
              <aside className={`max-h-[36vh] overflow-y-auto border-b p-4 lg:max-h-none lg:border-b-0 lg:border-r ${border}`}>
                <button type="button" onClick={createPost} className="flex w-full items-center justify-center gap-2 rounded-xl bg-fedem-600 px-4 py-3 text-sm font-semibold text-white hover:bg-fedem-500">
                  <Plus className="h-4 w-4" /> Nouvel article
                </button>
                <div className="mt-4 space-y-2">
                  {posts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => selectPost(post)}
                      className={`w-full rounded-xl border p-3 text-left transition-colors ${
                        editingId === post.id
                          ? isDark ? 'border-fedem-500/40 bg-fedem-500/10' : 'border-fedem-300 bg-fedem-50'
                          : isDark ? 'border-white/[0.07] hover:bg-white/[0.04]' : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <span className="line-clamp-2 text-sm font-semibold leading-snug">{post.title}</span>
                      <span className={`mt-2 flex items-center gap-1.5 text-[11px] ${post.published === false ? 'text-amber-500' : 'text-fedem-600'}`}>
                        {post.published === false ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        {post.published === false ? 'Brouillon' : 'Publié'}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              <main className="min-h-0 overflow-y-auto">
                <form onSubmit={handleSave} className="mx-auto max-w-5xl p-5 pb-28 sm:p-8 sm:pb-28">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${muted}`}>{selectedPostExists ? 'Modifier un article' : 'Nouvel article'}</p>
                      <h3 className="mt-2 text-2xl font-bold">Contenu de l’actualité</h3>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={draft.published !== false}
                        onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
                        className="h-4 w-4 accent-fedem-600"
                      />
                      <span className="text-sm font-semibold">Publié sur le site</span>
                    </label>
                  </div>

                  {(notice || storageError) && (
                    <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${storageError ? 'border-red-500/20 bg-red-500/10 text-red-500' : 'border-fedem-500/20 bg-fedem-500/10 text-fedem-600'}`}>
                      {storageError || notice}
                    </div>
                  )}

                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Titre *</label>
                      <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={field} required />
                    </div>
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Catégorie</label>
                      <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={field} />
                    </div>
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Date affichée</label>
                      <input value={draft.date ?? ''} onChange={(event) => setDraft({ ...draft, date: event.target.value })} className={field} placeholder="Ex. 17 mars 2025" />
                    </div>
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Type</label>
                      <select value={draft.kind ?? 'news'} onChange={(event) => setDraft({ ...draft, kind: event.target.value as BlogPost['kind'] })} className={field}>
                        <option value="news">Actualité</option>
                        <option value="resource">Dossier institutionnel</option>
                      </select>
                    </div>
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Temps de lecture</label>
                      <input value={draft.readTime} onChange={(event) => setDraft({ ...draft, readTime: event.target.value })} className={field} placeholder="Ex. 4 min" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Résumé *</label>
                      <textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} rows={3} className={`${field} resize-y`} required />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Contenu de l’article</label>
                      <textarea
                        value={draft.bodyText}
                        onChange={(event) => setDraft({ ...draft, bodyText: event.target.value })}
                        rows={10}
                        className={`${field} resize-y leading-relaxed`}
                        placeholder="Séparez les paragraphes par une ligne vide."
                      />
                      <p className={`mt-2 text-[11px] ${muted}`}>Insérez une ligne vide entre chaque paragraphe.</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Mots-clés</label>
                      <input value={draft.tagsText} onChange={(event) => setDraft({ ...draft, tagsText: event.target.value })} className={field} placeholder="FEDEM, Anjozorobe, Partenariat" />
                    </div>
                  </div>

                  <div className={`my-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                  <div>
                    <h4 className="text-lg font-bold">Image de couverture</h4>
                    <p className={`mt-1 text-sm ${muted}`}>Les images sont compressées puis envoyées dans Vercel Blob.</p>
                    <div className="mt-5 grid gap-5 md:grid-cols-[1fr_0.9fr]">
                      <div className={`relative flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border ${border} ${isDark ? 'bg-white/[0.03]' : 'bg-gray-50'}`}>
                        {draft.images?.[0]?.src || draft.image ? (
                          <img src={draft.images?.[0]?.src ?? draft.image} alt={draft.imageAlt || draft.title} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: draft.imagePosition ?? 'center' }} />
                        ) : (
                          <div className={`text-center ${muted}`}>
                            <ImageIcon className="mx-auto h-9 w-9" />
                            <span className="mt-2 block text-xs">Aucune image</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${border} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <Upload className="h-4 w-4" /> {processingImage ? 'Optimisation…' : 'Téléverser une image'}
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} disabled={processingImage} className="sr-only" />
                        </label>
                        <div>
                          <label className={`mb-2 block text-xs font-semibold ${muted}`}>Ou URL directe de l’image</label>
                          <input
                            value={draft.images?.[0]?.src ?? draft.image ?? ''}
                            onChange={(event) => setDraft({
                              ...draft,
                              image: undefined,
                              images: event.target.value ? [{ src: event.target.value, alt: draft.imageAlt || draft.title }] : [],
                            })}
                            className={field}
                            placeholder="https://.../image.jpg"
                          />
                        </div>
                        <div>
                          <label className={`mb-2 block text-xs font-semibold ${muted}`}>Description de l’image</label>
                          <input value={draft.imageAlt} onChange={(event) => setDraft({ ...draft, imageAlt: event.target.value })} className={field} />
                        </div>
                        <div>
                          <label className={`mb-2 block text-xs font-semibold ${muted}`}>Cadrage</label>
                          <select value={draft.imagePosition ?? 'center'} onChange={(event) => setDraft({ ...draft, imagePosition: event.target.value })} className={field}>
                            <option value="center">Centre</option>
                            <option value="center top">Haut</option>
                            <option value="center 35%">Haut-centre</option>
                            <option value="center bottom">Bas</option>
                            <option value="left center">Gauche</option>
                            <option value="right center">Droite</option>
                          </select>
                        </div>
                        <div>
                          <label className={`mb-2 block text-xs font-semibold ${muted}`}>Illustration de secours</label>
                          <select value={draft.visual ?? 'territory'} onChange={(event) => setDraft({ ...draft, visual: event.target.value as BlogPost['visual'] })} className={field}>
                            {visualOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                          </select>
                        </div>
                        {imageError && <p className="text-xs font-medium text-red-500">{imageError}</p>}
                      </div>
                    </div>
                  </div>

                  <div className={`my-8 h-px ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Libellé de la source</label>
                      <input value={draft.sourceLabel} onChange={(event) => setDraft({ ...draft, sourceLabel: event.target.value })} className={field} />
                    </div>
                    <div>
                      <label className={`mb-2 block text-xs font-semibold ${muted}`}>Lien de la source</label>
                      <input value={draft.sourceUrl ?? ''} onChange={(event) => setDraft({ ...draft, sourceUrl: event.target.value })} className={field} placeholder="https://..." />
                    </div>
                  </div>

                  <div className={`fixed inset-x-0 bottom-0 z-10 flex items-center justify-between gap-3 border-t px-4 py-3 backdrop-blur-xl lg:left-[320px] ${isDark ? 'border-white/10 bg-[#111714]/90' : 'border-gray-200 bg-white/90'}`}>
                    <div className="flex gap-2">
                      {selectedPostExists && canDelete && (
                        <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/10">
                          <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Supprimer</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm('Restaurer tous les articles d’origine ?')) {
                            try {
                              await resetPosts();
                              setEditingId(null);
                              setNotice('Contenus d’origine restaurés sur le serveur.');
                            } catch (error) {
                              setNotice(error instanceof Error ? error.message : 'Restauration impossible.');
                            }
                          }
                        }}
                        className={`hidden items-center gap-2 rounded-xl border px-4 py-2.5 text-sm sm:inline-flex ${border} ${muted} ${canDelete ? '' : 'pointer-events-none opacity-40'}`}
                      >
                        <RotateCcw className="h-4 w-4" /> Restaurer
                      </button>
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-fedem-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-fedem-500">
                      <Save className="h-4 w-4" /> Enregistrer
                    </button>
                  </div>
                </form>
              </main>
            </div>
            )}

            {activeTab === 'inquiries' && (
              <main className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[380px_1fr]">
                <aside className={`overflow-y-auto border-b p-4 lg:border-b-0 lg:border-r ${border}`}>
                  <div className="flex gap-2 overflow-x-auto pb-3">
                    {(['all', 'new', 'in_progress', 'processed'] as const).map((status) => (
                      <button key={status} type="button" onClick={() => setInquiryFilter(status)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${inquiryFilter === status ? 'bg-fedem-600 text-white' : isDark ? 'bg-white/5 text-white/45' : 'bg-gray-100 text-gray-500'}`}>
                        {status === 'all' ? 'Tous' : status === 'new' ? 'Nouveau' : status === 'in_progress' ? 'En cours' : 'Traité'}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {filteredInquiries.map((inquiry) => (
                      <button key={inquiry.id} type="button" onClick={() => openInquiry(inquiry.id)} className={`w-full rounded-2xl border p-4 text-left ${selectedInquiryId === inquiry.id ? 'border-fedem-500 bg-fedem-500/10' : border}`}>
                        <div className="flex items-center justify-between gap-3"><span className="text-[10px] font-semibold uppercase tracking-wider text-fedem-600">{inquiry.type === 'membership' ? 'Adhésion' : 'Message'}</span><span className={`h-2 w-2 rounded-full ${inquiry.status === 'new' ? 'bg-red-500' : inquiry.status === 'in_progress' ? 'bg-amber-500' : 'bg-fedem-500'}`} /></div>
                        <strong className="mt-2 block truncate text-sm">{inquiry.name}</strong><span className={`mt-1 block truncate text-xs ${muted}`}>{inquiry.subject}</span><span className={`mt-3 flex items-center gap-1 text-[10px] ${muted}`}><Clock3 className="h-3 w-3" /> {new Date(inquiry.createdAt).toLocaleDateString('fr-FR')}</span>
                      </button>
                    ))}
                    {filteredInquiries.length === 0 && <p className={`py-10 text-center text-sm ${muted}`}>Aucun élément dans ce filtre.</p>}
                  </div>
                </aside>
                <section className="min-h-0 overflow-y-auto p-5 sm:p-8">
                  {selectedInquiry ? (
                    <div className="mx-auto max-w-3xl">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fedem-600">{selectedInquiry.type === 'membership' ? 'Demande d’adhésion' : 'Message utilisateur'}</span>
                      <h3 className="mt-3 text-2xl font-bold">{selectedInquiry.subject}</h3>
                      <div className={`mt-5 grid gap-3 rounded-2xl border p-5 text-sm sm:grid-cols-2 ${border}`}><p><span className={muted}>Nom</span><strong className="mt-1 block">{selectedInquiry.name}</strong></p><p><span className={muted}>E-mail</span><a href={`mailto:${selectedInquiry.email}`} className="mt-1 block font-semibold text-fedem-600">{selectedInquiry.email}</a></p></div>
                      <div className={`mt-4 whitespace-pre-wrap rounded-2xl border p-5 text-sm leading-relaxed ${border}`}>{selectedInquiry.message}</div>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label className={`mb-2 block text-xs font-semibold ${muted}`}>Statut</label><select value={inquiryStatus} onChange={(event) => setInquiryStatus(event.target.value as InquiryStatus)} className={field}><option value="new">Nouveau</option><option value="in_progress">En cours</option><option value="processed">Traité</option></select></div><div><label className={`mb-2 block text-xs font-semibold ${muted}`}>Date</label><div className={`${field} opacity-70`}>{new Date(selectedInquiry.createdAt).toLocaleString('fr-FR')}</div></div></div>
                      <div className="mt-4"><label className={`mb-2 block text-xs font-semibold ${muted}`}>Réponse / note interne</label><textarea value={replyText} onChange={(event) => setReplyText(event.target.value)} rows={7} className={`${field} resize-y`} placeholder="Rédigez la réponse ou ajoutez une note de suivi..." /></div>
                      {inquiryNotice && <p className="mt-4 rounded-xl bg-fedem-500/10 px-4 py-3 text-sm text-fedem-700">{inquiryNotice}</p>}
                      <div className="mt-5 flex flex-wrap gap-3"><button type="button" disabled={savingInquiry} onClick={() => void saveInquiry(false)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${border}`}><Save className="h-4 w-4" /> Enregistrer</button><button type="button" disabled={savingInquiry || !replyText.trim()} onClick={() => void saveInquiry(true)} className="inline-flex items-center gap-2 rounded-xl bg-fedem-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"><Send className="h-4 w-4" /> Envoyer la réponse</button><a href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(`Réponse FEDEM : ${selectedInquiry.subject}`)}&body=${encodeURIComponent(replyText)}`} className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${muted}`}><Mail className="h-4 w-4" /> Ouvrir l’e-mail</a></div>
                    </div>
                  ) : <div className={`flex h-full items-center justify-center text-sm ${muted}`}>Sélectionnez une demande ou un message.</div>}
                </section>
              </main>
            )}

            {activeTab === 'settings' && (
              <main className="min-h-0 flex-1 overflow-y-auto p-5 pb-24 sm:p-8">
                <div className="mx-auto max-w-5xl">
                  <div className="flex items-center justify-between gap-4"><div><p className={`text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>Contenu public</p><h3 className="mt-2 text-3xl font-bold">Partenaires & chiffres clés</h3></div><button type="button" onClick={() => void saveSettings()} className="inline-flex items-center gap-2 rounded-xl bg-fedem-600 px-4 py-3 text-sm font-semibold text-white"><Save className="h-4 w-4" /> Enregistrer</button></div>
                  {settingsNotice && <p className="mt-5 rounded-xl bg-fedem-500/10 px-4 py-3 text-sm text-fedem-700">{settingsNotice}</p>}
                  <div className={`mt-7 rounded-3xl border p-5 sm:p-7 ${border}`}><label className="text-sm font-semibold">Nombre de membres</label><input type="number" min="0" value={settingsDraft.memberCount} onChange={(event) => setSettingsDraft({ ...settingsDraft, memberCount: Number(event.target.value) })} className={`${field} mt-3 max-w-xs`} /></div>
                  <div className={`mt-5 rounded-3xl border p-5 sm:p-7 ${border}`}><div className="flex items-center justify-between"><h4 className="font-bold">Statistiques affichées</h4><button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, stats: [...settingsDraft.stats, { id: `stat-${Date.now()}`, value: 0, prefix: '', suffix: '', label: 'Nouvelle statistique', description: '' }] })} className="text-sm font-semibold text-fedem-600">+ Ajouter</button></div><div className="mt-5 space-y-4">{settingsDraft.stats.map((stat, index) => <div key={stat.id} className={`grid gap-3 rounded-2xl border p-4 md:grid-cols-[100px_80px_80px_1fr_1.4fr_auto] ${border}`}><input type="number" step="any" value={stat.value} onChange={(event) => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value: Number(event.target.value) } : item) })} className={field} /><input value={stat.prefix} onChange={(event) => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.map((item, itemIndex) => itemIndex === index ? { ...item, prefix: event.target.value } : item) })} className={field} placeholder="Préfixe" /><input value={stat.suffix} onChange={(event) => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.map((item, itemIndex) => itemIndex === index ? { ...item, suffix: event.target.value } : item) })} className={field} placeholder="Suffixe" /><input value={stat.label} onChange={(event) => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} className={field} placeholder="Libellé" /><input value={stat.description} onChange={(event) => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} className={field} placeholder="Description" /><button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, stats: settingsDraft.stats.filter((_, itemIndex) => itemIndex !== index) })} className="p-2 text-red-500"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>
                  <div className={`mt-5 rounded-3xl border p-5 sm:p-7 ${border}`}><div className="flex items-center justify-between"><h4 className="font-bold">Partenaires</h4><button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, partners: [...settingsDraft.partners, { id: `partner-${Date.now()}`, name: 'Nouveau partenaire', image: '', url: 'https://', active: true }] })} className="text-sm font-semibold text-fedem-600">+ Ajouter</button></div><div className="mt-5 space-y-4">{settingsDraft.partners.map((partner, index) => <div key={partner.id} className={`grid gap-3 rounded-2xl border p-4 md:grid-cols-[1fr_1.3fr_1.3fr_auto_auto] ${border}`}><input value={partner.name} onChange={(event) => setSettingsDraft({ ...settingsDraft, partners: settingsDraft.partners.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) })} className={field} placeholder="Nom" /><input value={partner.image} onChange={(event) => setSettingsDraft({ ...settingsDraft, partners: settingsDraft.partners.map((item, itemIndex) => itemIndex === index ? { ...item, image: event.target.value } : item) })} className={field} placeholder="URL logo HTTPS" /><input value={partner.url} onChange={(event) => setSettingsDraft({ ...settingsDraft, partners: settingsDraft.partners.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item) })} className={field} placeholder="Site HTTPS" /><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={partner.active} onChange={(event) => setSettingsDraft({ ...settingsDraft, partners: settingsDraft.partners.map((item, itemIndex) => itemIndex === index ? { ...item, active: event.target.checked } : item) })} className="accent-fedem-600" /> Actif</label><button type="button" onClick={() => setSettingsDraft({ ...settingsDraft, partners: settingsDraft.partners.filter((_, itemIndex) => itemIndex !== index) })} className="p-2 text-red-500"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>
                </div>
              </main>
            )}

            {activeTab === 'backup' && (
              <main className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8"><div className="mx-auto max-w-3xl"><p className={`text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>Archivage</p><h3 className="mt-2 text-3xl font-bold">Sauvegarde & export</h3><p className={`mt-3 leading-relaxed ${muted}`}>Téléchargez une copie des articles, demandes, paramètres et comptes sans inclure les mots de passe.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><button type="button" onClick={() => void exportDatabase('json')} className={`rounded-3xl border p-6 text-left transition-colors ${border} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}><Database className="h-8 w-8 text-fedem-600" /><strong className="mt-5 block text-lg">Exporter en JSON</strong><span className={`mt-2 block text-sm ${muted}`}>Sauvegarde complète et structurée.</span><Download className="mt-5 h-5 w-5" /></button><button type="button" onClick={() => void exportDatabase('csv')} className={`rounded-3xl border p-6 text-left transition-colors ${border} ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}><FileText className="h-8 w-8 text-blue-500" /><strong className="mt-5 block text-lg">Exporter en CSV</strong><span className={`mt-2 block text-sm ${muted}`}>Archive lisible dans Excel ou LibreOffice.</span><Download className="mt-5 h-5 w-5" /></button></div></div></main>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}