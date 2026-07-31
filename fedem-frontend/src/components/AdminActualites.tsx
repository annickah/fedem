import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────
interface Actualite {
  id: number;
  titre: string;
  contenu: string;
  datePublication: string;
  tempsLecture?: number;
  image?: string;
  categorie?: string;
}

interface FormData {
  id?: number;
  titre: string;
  contenu: string;
  datePublication: string;
  tempsLecture: number;
  image: string;
  categorie: string;
}

// ─── Constantes ──────────────────────────────────────────
const API_URL = 'http://localhost:8000/api/actualites';

const EMPTY_FORM: FormData = {
  titre: '',
  contenu: '',
  datePublication: new Date().toISOString().split('T')[0],
  tempsLecture: 0,
  image: '',
  categorie: '',
};

// ─── Helper : calcule temps de lecture ───────────────────
function calculerTempsLecture(texte: string): number {
  if (!texte) return 0;
  const mots = texte.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(mots / 200)); // 200 mots/min
}

// ─── Composant principal ─────────────────────────────────
export default function AdminActualites() {
  const [articles, setArticles] = useState<Actualite[]>([]);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Charger la liste au montage
  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : data['hydra:member'] || []);
    } catch (err: any) {
      setError('Impossible de charger les articles : ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Soumettre le formulaire (créer ou modifier)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      ...form,
      tempsLecture: calculerTempsLecture(form.contenu),
    };

    try {
      const url = form.id ? `${API_URL}/${form.id}` : API_URL;
      const method = form.id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }

      setSuccess(form.id ? 'Article modifié !' : 'Article créé !');
      setForm(EMPTY_FORM);
      await fetchArticles();
    } catch (err: any) {
      setError('Erreur : ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Supprimer
  async function handleDelete(id: number) {
    if (!confirm('Supprimer cet article ?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSuccess('Article supprimé !');
      await fetchArticles();
    } catch (err: any) {
      setError('Erreur suppression : ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Pré-remplir le formulaire pour édition
  function handleEdit(article: Actualite) {
    setForm({
      id: article.id,
      titre: article.titre || '',
      contenu: article.contenu || '',
      datePublication: article.datePublication
        ? article.datePublication.split('T')[0]
        : new Date().toISOString().split('T')[0],
      tempsLecture: article.tempsLecture || 0,
      image: article.image || '',
      categorie: article.categorie || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setForm(EMPTY_FORM);
  }

  // ─── Rendu ───────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Gestion des Actualités</h1>

      {/* Messages */}
      {error && (
        <div style={styles.alertError}>
          <strong>Erreur</strong>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div style={styles.alertSuccess}>
          <strong>Succès</strong>
          <p>{success}</p>
        </div>
      )}

      {/* ─── Formulaire ─── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          {form.id ? 'Modifier un article' : 'Nouvel article'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Titre</label>
              <input
                type="text"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                style={styles.input}
                placeholder="Titre de l'article"
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date de publication</label>
              <input
                type="date"
                value={form.datePublication}
                onChange={(e) =>
                  setForm({ ...form, datePublication: e.target.value })
                }
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Catégorie</label>
              <input
                type="text"
                value={form.categorie}
                onChange={(e) =>
                  setForm({ ...form, categorie: e.target.value })
                }
                style={styles.input}
                placeholder="Ex: Sport, Politique..."
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Image (URL)</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                style={styles.input}
                placeholder="https://..."
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Contenu</label>
            <textarea
              value={form.contenu}
              onChange={(e) =>
                setForm({ ...form, contenu: e.target.value })
              }
              style={styles.textarea}
              placeholder="Rédigez votre article ici..."
              rows={6}
              required
            />
            <div style={styles.metaLine}>
              <span>{form.contenu.length} caractères</span>
              <span style={styles.tempsLectureBadge}>
                ⏱ Temps de lecture : {calculerTempsLecture(form.contenu)} min
              </span>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.btnDisabled : styles.btnPrimary}
            >
              {loading
                ? 'Chargement...'
                : form.id
                ? '💾 Enregistrer les modifications'
                : '➕ Créer l\'article'}
            </button>
            {form.id && (
              <button
                type="button"
                onClick={handleCancel}
                style={styles.btnSecondary}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ─── Liste des articles ─── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Liste des articles ({articles.length})
        </h2>

        {loading && articles.length === 0 && (
          <p style={styles.empty}>Chargement…</p>
        )}
        {!loading && articles.length === 0 && (
          <p style={styles.empty}>Aucun article pour l'instant.</p>
        )}

        <div style={styles.list}>
          {articles.map((article) => (
            <div key={article.id} style={styles.item}>
              <div style={styles.itemHeader}>
                <div>
                  <h3 style={styles.itemTitle}>{article.titre}</h3>
                  <span style={styles.itemMeta}>
                    {article.datePublication?.split('T')[0]} •{' '}
                    {article.categorie || 'Sans catégorie'}
                  </span>
                </div>
                <div style={styles.itemActions}>
                  <button
                    onClick={() => handleEdit(article)}
                    style={styles.btnEdit}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    style={styles.btnDelete}
                  >
                    🗑 Supprimer
                  </button>
                </div>
              </div>
              <p style={styles.itemExcerpt}>
                {article.contenu?.substring(0, 120)}…
              </p>
              <div style={styles.itemFooter}>
                <span style={styles.tempsLectureBadge}>
                  ⏱ Temps de lecture : {article.tempsLecture || 1} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Styles inline (zéro dépendance CSS) ───────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#1f2937',
    lineHeight: 1.5,
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '24px',
    color: '#111827',
  },
  card: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#374151',
  },
  alertError: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#991b1b',
  },
  alertSuccess: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
    color: '#166534',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  },
  formGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    marginBottom: '6px',
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  metaLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
    fontSize: '13px',
    color: '#6b7280',
  },
  tempsLectureBadge: {
    background: '#eff6ff',
    color: '#1e40af',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  btnDisabled: {
    background: '#93c5fd',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'not-allowed',
  },
  btnSecondary: {
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  item: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    background: '#fafafa',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: 0,
    color: '#111827',
  },
  itemMeta: {
    fontSize: '13px',
    color: '#6b7280',
  },
  itemActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  btnEdit: {
    background: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  btnDelete: {
    background: '#fef2f2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  itemExcerpt: {
    fontSize: '14px',
    color: '#4b5563',
    margin: '8px 0',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '8px',
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    padding: '24px',
  },
};
