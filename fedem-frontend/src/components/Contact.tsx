import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { ArrowUpRight, Building, CheckCircle, Mail, MapPin, Navigation, Phone, Send } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CONTACT_INFO, SOCIAL_LINKS } from '../lib/constants';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const offices = [
  { city: 'Antananarivo', address: CONTACT_INFO.address, isMain: true },
  { city: 'Bongolava', address: 'Vahalava nd-RAKOTOMAHEFA\nAndranomadio Tsiroanomandidy', isMain: false },
  { city: 'Anjozorobe', address: 'Résidence RABARIHOELA\nCentre-Ville', isMain: false },
  { city: 'Antsirabe', address: 'Immeuble Assurance MAMA', isMain: false },
];

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [website, setWebsite] = useState('');

  const glass = isDark
    ? 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]'
    : 'bg-white/70 backdrop-blur-xl border border-gray-200/60 shadow-sm';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nom: form.name,
          email: form.email,
          sujet: form.subject,
          message: form.message,
        }),
      });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        if (response.status === 404) throw new Error('Le formulaire sera disponible après le déploiement Vercel.');
        throw new Error(payload.error || 'Envoi impossible.');
      }
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setWebsite('');
      window.setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Envoi impossible. Réessayez plus tard.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = `w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none ${
    isDark
      ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-fedem-500/50 focus:bg-white/[0.08]'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:border-fedem-500 focus:bg-white'
  }`;

  return (
    <section id="contact" ref={ref} className="relative py-28 lg:py-36 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-fedem-600/8 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className={`text-sm font-semibold tracking-[0.2em] uppercase ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`}>Contact</span>
          <h2 className={`mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Entrez en <span className="bg-gradient-to-r from-fedem-500 to-fedem-400 bg-clip-text text-transparent">contact</span>
          </h2>
          <p className={`mt-6 max-w-2xl mx-auto text-lg ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            Retrouvez nos bureaux ou écrivez-nous pour échanger sur votre projet entrepreneurial.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-5"
          >
            <div className={`${glass} rounded-2xl p-6 space-y-4`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <Building className={`w-5 h-5 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />Nos Bureaux
              </h3>
              {offices.map((o) => (
                <div key={o.city} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                  o.isMain
                    ? isDark ? 'bg-fedem-600/10 border border-fedem-600/20' : 'bg-fedem-50 border border-fedem-200'
                    : isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                }`}>
                  <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  <div>
                    <div className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {o.city}
                      {o.isMain && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${isDark ? 'bg-fedem-600/30 text-fedem-300' : 'bg-fedem-100 text-fedem-700'}`}>Siège</span>
                      )}
                    </div>
                    <div className={`text-xs mt-1 whitespace-pre-line leading-relaxed ${isDark ? 'text-white/35' : 'text-gray-400'}`}>{o.address}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${glass} rounded-2xl p-6 space-y-4`}>
              {[
                { icon: Mail, label: 'Email', value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                { icon: Phone, label: 'Téléphone', value: CONTACT_INFO.phone, href: CONTACT_INFO.phoneHref },
              ].map((c) => (
                <a key={c.label} href={c.href} className="group flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-fedem-600/15' : 'bg-fedem-50'}`}>
                    <c.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{c.label}</div>
                    <div className={`text-sm font-medium transition-colors ${isDark ? 'text-white group-hover:text-fedem-400' : 'text-gray-900 group-hover:text-fedem-600'}`}>{c.value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className={`${glass} rounded-2xl p-6`}>
              <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Suivez-nous</h4>
              <div className="flex gap-3">
                {[
                  {
                    icon: FacebookIcon,
                    label: 'Facebook',
                    href: SOCIAL_LINKS.facebook,
                  },
                ].map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith('http') ? '_blank' : undefined}
                    rel={s.href.startsWith('http') ? 'noreferrer' : undefined}
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isDark
                        ? 'bg-white/5 border border-white/[0.06] text-white/50 hover:text-fedem-400 hover:bg-fedem-600/10'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 hover:text-fedem-600 hover:bg-fedem-50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={s.label}
                  >
                    <s.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className={`${glass} rounded-3xl p-8 relative overflow-hidden`}>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fedem-500/10 rounded-full blur-[60px]" />

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-fedem-600/20' : 'bg-fedem-50'}`}>
                    <CheckCircle className={`w-10 h-10 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  </div>
                  <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message envoyé !</h3>
                  <p className={isDark ? 'text-white/40' : 'text-gray-500'}>Notre équipe vous répondra dans les plus brefs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Envoyez-nous un message</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Nom complet</label>
                      <input type="text" name="name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Votre nom" className={inputClass} />
                    </div>
                    <div>
                      <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Email</label>
                      <input type="email" name="email" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} required placeholder="votre@email.com" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Sujet</label>
                    <select name="subject" value={form.subject} onChange={(e) => setForm(p => ({ ...p, subject: e.target.value }))} required className={`${inputClass} cursor-pointer appearance-none`}>
                      <option value="" className={isDark ? 'bg-black' : 'bg-white'}>Sélectionnez un sujet</option>
                      {['Formation', 'Coaching', 'Partenariat', 'Adhésion', 'Autre'].map((o) => (
                        <option key={o} value={o.toLowerCase()} className={isDark ? 'bg-black' : 'bg-white'}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 font-medium ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Message</label>
                    <textarea name="message" value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} required rows={5} placeholder="Décrivez votre demande..." className={`${inputClass} resize-none`} />
                  </div>
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label>Site web<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
                  </div>
                  {submitError && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{submitError}</p>}
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 py-4 bg-fedem-600 hover:bg-fedem-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-fedem-600/25 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4" />{submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* Headquarters map */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.42 }}
          className={`mt-10 overflow-hidden rounded-[2rem] border ${
            isDark ? 'border-white/[0.08] bg-white/[0.035]' : 'border-gray-200/70 bg-white shadow-lg shadow-gray-200/40'
          }`}
        >
          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`}>
                Localisation du siège
              </span>
              <h3 className={`mt-4 text-2xl font-bold sm:text-3xl ${isDark ? 'text-white' : 'text-gray-950'}`}>
                FEDEM Madagascar à Ankazomanga
              </h3>
              <div className={`mt-6 flex items-start gap-3 text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
                <MapPin className={`mt-0.5 h-5 w-5 shrink-0 ${isDark ? 'text-fedem-400' : 'text-fedem-700'}`} />
                <address className="whitespace-pre-line not-italic">
                  {CONTACT_INFO.address}
                  {'\n'}
                  {CONTACT_INFO.city}
                </address>
              </div>
              <p className={`mt-5 text-xs leading-relaxed ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                Le repère cartographique indique Ankazomanga. Utilisez l’itinéraire pour rechercher directement l’adresse complète de l’Immeuble Héritage.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <a
                  href={CONTACT_INFO.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-fedem-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-fedem-500"
                >
                  <Navigation className="h-4 w-4" /> Obtenir l’itinéraire
                </a>
                <a
                  href={CONTACT_INFO.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                    isDark
                      ? 'border-white/10 text-white/65 hover:border-fedem-500/40 hover:text-fedem-300'
                      : 'border-gray-200 text-gray-600 hover:border-fedem-300 hover:text-fedem-700'
                  }`}
                >
                  Voir la carte <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className={`relative min-h-[360px] overflow-hidden lg:min-h-[480px] ${isDark ? 'bg-[#111714]' : 'bg-gray-100'}`}>
              <iframe
                src={CONTACT_INFO.mapEmbedUrl}
                title="Carte interactive du siège de la FEDEM Madagascar à Ankazomanga"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow-md backdrop-blur-md">
                Siège FEDEM, Ankazomanga
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
