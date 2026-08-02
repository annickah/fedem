import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { upload } from '@vercel/blob/client';
import { blogPosts as defaultBlogPosts, type BlogPost } from '../data/blogPosts';
import type { DashboardMetrics, Inquiry, InquiryStatus } from '../data/adminTypes';
import { defaultSiteSettings, type SiteSettings } from '../data/siteContent';
import {
  PREVIEW_SESSION_KEY,
  isStaticPreviewEnvironment,
  loadPreviewInquiries,
  loadPreviewPosts,
  loadPreviewSettings,
  previewAdmin,
  savePreviewInquiries,
  savePreviewPosts,
  savePreviewSettings,
  verifyPreviewPassword,
} from '../lib/previewCms';
import { optimizeImage } from '../utils/image';

interface LoginResult {
  success: boolean;
  message?: string;
}

interface SessionUser {
  email: string;
  role: 'admin' | 'editor';
}

interface BlogAdminContextType {
  posts: BlogPost[];
  publishedPosts: BlogPost[];
  isAuthenticated: boolean;
  isAdminOpen: boolean;
  isConfigured: boolean;
  isLoading: boolean;
  canDelete: boolean;
  userEmail: string;
  storageError: string;
  apiUnavailable: boolean;
  backendMode: 'server' | 'preview';
  metrics: DashboardMetrics;
  inquiries: Inquiry[];
  siteSettings: SiteSettings;
  openAdmin: () => void;
  closeAdmin: () => void;
  login: (email: string, credential: string, mode: 'password' | 'pin') => Promise<LoginResult>;
  logout: () => Promise<void>;
  savePost: (post: BlogPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  resetPosts: () => Promise<void>;
  uploadImage: (file: File, postId: string, alt: string) => Promise<{ src: string; alt: string }>;
  refreshAdminData: () => Promise<void>;
  updateInquiry: (id: string, status: InquiryStatus, responseText: string, sendReply: boolean) => Promise<boolean>;
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  exportDatabase: (format: 'json' | 'csv') => Promise<void>;
}

const BlogAdminContext = createContext<BlogAdminContextType | undefined>(undefined);
const initialPosts = defaultBlogPosts.map((post) => ({ ...post, published: post.published ?? true }));
const emptyMetrics: DashboardMetrics = {
  memberCount: defaultSiteSettings.memberCount,
  membershipRequests: 0,
  publishedArticles: initialPosts.filter((post) => post.published !== false).length,
  pendingMessages: 0,
  totalInquiries: 0,
};

function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => {
    const aTime = Date.parse(a.updatedAt ?? a.createdAt ?? '') || a.id;
    const bTime = Date.parse(b.updatedAt ?? b.createdAt ?? '') || b.id;
    return bTime - aTime;
  });
}

type ActualiteApi = {
  id: string;
  titre: string;
  contenu: string;
  resume: string | null;
  categorie: string | null;
  tempsLecture: string | null;
  image: string | null;
  statut: string;
  createdAt: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function actualiteToBlogPost(a: ActualiteApi): BlogPost {
  return {
    id: a.id,
    slug: slugify(a.titre) || `actualite-${a.id}`,
    title: a.titre,
    excerpt: a.resume ?? a.contenu.slice(0, 160),
    category: a.categorie ?? 'Actualité',
    readTime: a.tempsLecture ?? '3 min',
    image: a.image ?? undefined,
    sourceLabel: 'FEDEM',
    paragraphs: a.contenu.split(/\n{2,}/).filter(Boolean),
    highlights: [],
    published: a.statut === 'publie',
    createdAt: a.createdAt,
  };
}
function blogPostToActualitePayload(post: BlogPost) {
  return {
    titre: post.title,
    contenu: post.paragraphs.join('\n\n'),
    resume: post.excerpt,
    categorie: post.category,
    tempsLecture: post.readTime,
    image: post.image ?? null,
  };
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) {
    if (response.status === 404 && url.startsWith('/api/')) {
      throw new Error('VERCEL_API_UNAVAILABLE');
    }
    throw new Error(payload.error || `Erreur serveur (${response.status}).`);
  }
  return payload;
}

function connectionMessage(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message === 'VERCEL_API_UNAVAILABLE') {
    return "L’administration sécurisée nécessite les fonctions Vercel. Cette prévisualisation Arena n’exécute pas le dossier /api. Déployez le projet sur Vercel ou utilisez la commande `vercel dev` pour vous connecter.";
  }
  if (/failed to fetch|network/i.test(message)) {
    return 'Le serveur Vercel CMS est indisponible dans cette prévisualisation. Testez le site après déploiement Vercel ou avec `vercel dev`.';
  }
  return message || 'Connexion au CMS impossible.';
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Impossible d'encoder l'image."));
    reader.readAsDataURL(blob);
  });
}

export function BlogAdminProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [storageError, setStorageError] = useState('');
  const [apiUnavailable, setApiUnavailable] = useState(false);
  const [backendMode, setBackendMode] = useState<'server' | 'preview'>('server');
  const [metrics, setMetrics] = useState<DashboardMetrics>(emptyMetrics);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const authenticatedRef = useRef(false);
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('fedem_admin_key'));
  const apiKeyRef = useRef<string | null>(apiKey);

  useEffect(() => {
    apiKeyRef.current = apiKey;
  }, [apiKey]);

  const activatePreviewMode = useCallback(() => {
    if (!isStaticPreviewEnvironment()) return false;
    const previewPosts = loadPreviewPosts(initialPosts);
    const previewInquiries = loadPreviewInquiries();
    const previewSettings = loadPreviewSettings();
    const savedSession = sessionStorage.getItem(PREVIEW_SESSION_KEY);
    let previewAuthenticated = false;
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession) as { expiresAt?: number };
        previewAuthenticated = Number(session.expiresAt) > Date.now();
      } catch {
        sessionStorage.removeItem(PREVIEW_SESSION_KEY);
      }
    }
    setBackendMode('preview');
    setApiUnavailable(false);
    setStorageError('');
    setPosts(sortPosts(previewPosts));
    setInquiries(previewInquiries);
    setSiteSettings(previewSettings);
    setMetrics({
      memberCount: previewSettings.memberCount,
      membershipRequests: previewInquiries.filter((item) => item.type === 'membership').length,
      publishedArticles: previewPosts.filter((post) => post.published !== false).length,
      pendingMessages: previewInquiries.filter((item) => item.type === 'message' && item.status !== 'processed').length,
      totalInquiries: previewInquiries.length,
    });
    setIsAuthenticated(previewAuthenticated);
    authenticatedRef.current = previewAuthenticated;
    setUser(previewAuthenticated ? { email: previewAdmin.email, role: 'admin' } : null);
    setIsLoading(false);
    return true;
  }, []);

  useEffect(() => {
    authenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

 const loadPosts = useCallback(async (all = authenticatedRef.current) => {
    try {
      const endpoint = all ? '/api/admin/actualites' : '/api/actualites';
      const result = await apiRequest<{ actualites: ActualiteApi[] }>(endpoint, {
        headers: all && apiKeyRef.current ? { 'X-API-KEY': apiKeyRef.current } : {},
      });
      setApiUnavailable(false);
      setPosts(sortPosts(result.actualites.map(actualiteToBlogPost)));
      setStorageError('');
    } catch (error) {
      if (error instanceof Error && error.message === 'VERCEL_API_UNAVAILABLE') {
        if (activatePreviewMode()) return;
        setApiUnavailable(true);
      }
      setStorageError(connectionMessage(error));
      if (!all) setPosts(initialPosts);
    }
  }, [activatePreviewMode]);

  const refreshAdminData = useCallback(async () => {
    if (!authenticatedRef.current) return;
    if (backendMode === 'preview') {
      activatePreviewMode();
      return;
    }
    if (!apiKeyRef.current) return;

    const [dashboardResult, inquiriesResult, settingsResult] = await Promise.allSettled([
      apiRequest<{ metrics: DashboardMetrics }>('/api/admin/dashboard'),
      apiRequest<{ inquiries: Inquiry[] }>('/api/inquiries', {
        headers: { 'X-API-KEY': apiKeyRef.current },
      }),
      apiRequest<{ settings: SiteSettings }>('/api/site-settings'),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      setMetrics(dashboardResult.value.metrics);
    }
    if (inquiriesResult.status === 'fulfilled') {
      setInquiries(inquiriesResult.value.inquiries);
    }
    if (settingsResult.status === 'fulfilled') {
      setSiteSettings(settingsResult.value.settings);
    }
  }, [activatePreviewMode, backendMode]);

  useEffect(() => {
    let active = true;
    void (async () => {
      const storedKey = sessionStorage.getItem('fedem_admin_key');
      let authenticated = false;

      if (storedKey) {
        try {
          await apiRequest('/api/admin/actualites', { headers: { 'X-API-KEY': storedKey } });
          authenticated = true;
        } catch {
          sessionStorage.removeItem('fedem_admin_key');
          setApiKey(null);
        }
      }

      const postResult = await apiRequest<{ actualites: ActualiteApi[] }>('/api/actualites').catch(() => null);
      if (!active) return;

      setIsAuthenticated(authenticated);
      setUser(authenticated ? { email: 'admin@fedem.mg', role: 'admin' } : null);
      authenticatedRef.current = authenticated;
      setPosts(sortPosts(postResult ? postResult.actualites.map(actualiteToBlogPost) : initialPosts));
      setIsLoading(false);

      if (authenticated) {
        void loadPosts(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [activatePreviewMode, loadPosts, refreshAdminData]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (backendMode === 'preview') return;
      if (!document.hidden) void loadPosts(authenticatedRef.current);
      if (!document.hidden && authenticatedRef.current) void refreshAdminData();
    }, 30_000);
    return () => window.clearInterval(interval);
  }, [backendMode, loadPosts, refreshAdminData]);

  const login = useCallback(async (email: string, credential: string, mode: 'password' | 'pin'): Promise<LoginResult> => {
    setIsLoading(true);
    if (backendMode === 'preview') {
      const validCredential = mode === 'password' && verifyPreviewPassword(credential);
      if (email.trim().toLowerCase() !== previewAdmin.email || !validCredential) {
        setIsLoading(false);
        return { success: false, message: 'Adresse e-mail ou mot de passe incorrect. Le mode aperçu local utilise uniquement le mot de passe administrateur.' };
      }
      const expiresAt = Date.now() + previewAdmin.sessionHours * 60 * 60 * 1000;
      sessionStorage.setItem(PREVIEW_SESSION_KEY, JSON.stringify({ expiresAt }));
      setIsAuthenticated(true);
      authenticatedRef.current = true;
      setUser({ email: previewAdmin.email, role: 'admin' });
      setIsLoading(false);
      activatePreviewMode();
      return { success: true };
    }
    console.log('DEBUG credential:', JSON.stringify(credential));
    try {
      await apiRequest('/api/admin/actualites', { headers: { 'X-API-KEY': credential } });
      sessionStorage.setItem('fedem_admin_key', credential);
      setApiKey(credential);
      setUser({ email, role: 'admin' });
      setIsAuthenticated(true);
      authenticatedRef.current = true;
      await loadPosts(true);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Clé API incorrecte.' };
    } finally {
      setIsLoading(false);
    }
  }, [activatePreviewMode, backendMode, loadPosts, refreshAdminData]);

  const logout = useCallback(async () => {
    if (backendMode === 'preview') {
      sessionStorage.removeItem(PREVIEW_SESSION_KEY);
      setUser(null);
      setIsAuthenticated(false);
      authenticatedRef.current = false;
      setIsAdminOpen(false);
      return;
    }
    sessionStorage.removeItem('fedem_admin_key');
    setApiKey(null);
    setUser(null);
    setIsAuthenticated(false);
    authenticatedRef.current = false;
    setIsAdminOpen(false);
    await loadPosts(false);
  }, [backendMode, loadPosts]);

const savePost = useCallback(async (post: BlogPost) => {
    if (backendMode === 'preview') {
      const now = new Date().toISOString();
      const normalized = { ...post, createdAt: post.createdAt ?? now, updatedAt: now };
      const next = sortPosts([normalized, ...posts.filter((item) => item.id !== normalized.id)]);
      setPosts(next);
      savePreviewPosts(next);
      activatePreviewMode();
      return;
    }
    if (!apiKeyRef.current) throw new Error('Session administrateur requise.');
    const headers = { 'X-API-KEY': apiKeyRef.current };
    const exists = posts.some((item) => item.id === post.id);
    const payload = blogPostToActualitePayload(post);
    const result = await apiRequest<{ actualite: ActualiteApi }>(
      exists ? `/api/actualites/${post.id}` : '/api/actualites',
      { method: exists ? 'PUT' : 'POST', headers, body: JSON.stringify(payload) },
    );
    let saved = actualiteToBlogPost(result.actualite);
    if (post.published) {
      await apiRequest(`/api/actualites/${saved.id}/publier`, { method: 'POST', headers });
      saved = { ...saved, published: true };
    }
    setPosts((current) => sortPosts([saved, ...current.filter((item) => item.id !== saved.id)]));
    setStorageError('');
  }, [activatePreviewMode, backendMode, posts]);

  const deletePost = useCallback(async (id: string) => {
    if (backendMode === 'preview') {
      const next = posts.filter((post) => post.id !== id);
      setPosts(next);
      savePreviewPosts(next);
      activatePreviewMode();
      return;
    }
    if (!apiKeyRef.current) throw new Error('Session administrateur requise.');
    await apiRequest(`/api/actualites/${id}`, {
      method: 'DELETE',
      headers: { 'X-API-KEY': apiKeyRef.current },
    });
    setPosts((current) => current.filter((post) => post.id !== id));
  }, [activatePreviewMode, backendMode, posts]);

const resetPosts = useCallback(async () => {
    if (backendMode === 'preview') {
      setPosts(initialPosts);
      savePreviewPosts(initialPosts);
      activatePreviewMode();
      return;
    }
    throw new Error("Réinitialisation non disponible : cette fonctionnalité n'existe pas encore côté serveur.");
  }, [backendMode]);

  const uploadImage = useCallback(async (file: File, postId: string, alt: string) => {
    if (!isAuthenticated) throw new Error('Session administrateur requise.');
    const optimized = await optimizeImage(file, 1800, 0.84);
    if (backendMode === 'preview') {
      if (optimized.size > 1_500_000) throw new Error("L'image est trop lourde pour le mode aperçu local.");
      return { src: await blobToDataUrl(optimized), alt: alt || file.name.replace(/\.[^.]+$/, '') };
    }
    const uploadFile = new File([optimized], `${file.name.replace(/\.[^.]+$/, '') || 'image'}.webp`, {
      type: 'image/webp',
    });
    const blob = await upload(`blog/${postId}/${uploadFile.name}`, uploadFile, {
      access: 'public',
      handleUploadUrl: '/api/blob/upload',
      clientPayload: JSON.stringify({ postId }),
    });
    return { src: blob.url, alt: alt || file.name.replace(/\.[^.]+$/, '') };
  }, [backendMode, isAuthenticated]);

  const updateInquiry = useCallback(async (
    id: string,
    status: InquiryStatus,
    responseText: string,
    sendReply: boolean,
  ) => {
    if (backendMode === 'preview') {
      const next = inquiries.map((inquiry) => inquiry.id === id ? {
        ...inquiry,
        status,
        responseText,
        responseSent: false,
        updatedAt: new Date().toISOString(),
      } : inquiry);
      setInquiries(next);
      savePreviewInquiries(next);
      activatePreviewMode();
      return false;
    }
    if (!apiKeyRef.current) throw new Error('Session administrateur requise.');
    const result = await apiRequest<{ success: boolean; responseSent: boolean }>(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'X-API-KEY': apiKeyRef.current },
      body: JSON.stringify({ status, responseText, sendReply }),
    });
    await refreshAdminData();
    return result.responseSent;
  }, [activatePreviewMode, backendMode, inquiries, refreshAdminData]);

  const saveSiteSettings = useCallback(async (settings: SiteSettings) => {
    if (backendMode === 'preview') {
      savePreviewSettings(settings);
      setSiteSettings(settings);
      activatePreviewMode();
      return;
    }
    const result = await apiRequest<{ settings: SiteSettings }>('/api/site-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    setSiteSettings(result.settings);
    await refreshAdminData();
  }, [activatePreviewMode, backendMode, refreshAdminData]);

  const exportDatabase = useCallback(async (format: 'json' | 'csv') => {
    if (backendMode === 'preview') {
      const data = { exportedAt: new Date().toISOString(), mode: 'preview', posts, inquiries, settings: siteSettings };
      let content: string;
      let type: string;
      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        type = 'application/json';
      } else {
        const rows = [
          ['type', 'id', 'titre_ou_nom', 'statut', 'contenu'],
          ...posts.map((post) => ['article', String(post.id), post.title, post.published === false ? 'brouillon' : 'publie', JSON.stringify(post)]),
          ...inquiries.map((item) => ['demande', item.id, item.name, item.status, JSON.stringify(item)]),
        ];
        content = `\uFEFF${rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n')}`;
        type = 'text/csv';
      }
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `fedem-apercu-${new Date().toISOString().slice(0, 10)}.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }
    const response = await fetch(`/api/admin/export?format=${format}`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('Export impossible.');
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `fedem-backup-${new Date().toISOString().slice(0, 10)}.${format}`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [backendMode, inquiries, posts, siteSettings]);

  const publishedPosts = useMemo(() => posts.filter((post) => post.published !== false), [posts]);
  const value = useMemo<BlogAdminContextType>(() => ({
    posts,
    publishedPosts,
    isAuthenticated,
    isAdminOpen,
    isConfigured: true,
    isLoading,
    canDelete: user?.role === 'admin',
    userEmail: user?.email ?? '',
    storageError,
    apiUnavailable,
    backendMode,
    metrics,
    inquiries,
    siteSettings,
    openAdmin: () => setIsAdminOpen(true),
    closeAdmin: () => setIsAdminOpen(false),
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
  }), [posts, publishedPosts, isAuthenticated, isAdminOpen, isLoading, user, storageError, apiUnavailable, backendMode, metrics, inquiries, siteSettings, login, logout, savePost, deletePost, resetPosts, uploadImage, refreshAdminData, updateInquiry, saveSiteSettings, exportDatabase]);

  return <BlogAdminContext.Provider value={value}>{children}</BlogAdminContext.Provider>;
}

export function useBlogAdmin() {
  const context = useContext(BlogAdminContext);
  if (!context) throw new Error('useBlogAdmin must be used within BlogAdminProvider');
  return context;
}