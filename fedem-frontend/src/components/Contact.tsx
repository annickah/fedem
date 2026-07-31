import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, Building } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const offices = [
  { city: 'Antananarivo', address: '3ème étage, Immeuble Héritage\nLot IVX 72 BIS F Ankazomanga', isMain: true },
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

  const glass = isDark
    ? 'bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]'
    : 'bg-white/70 backdrop-blur-xl border border-gray-200/60 shadow-sm';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Formulaire envoyé");
    console.log(form);

    try {
        const response = await fetch("http://localhost:8000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nom: form.name,
                email: form.email,
                sujet: form.subject,
                message: form.message
            })
        });

        const data = await response.json();

        console.log(data);

        setSubmitted(true);

        setTimeout(() => setSubmitted(false), 4000);

        setForm({
            name: '',
            email: '',
            subject: '',
            message: ''
        });

    } catch (error) {
        console.error("Erreur envoi contact :", error);
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
            Connecting communities and businesses through sustainable technology.
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
                { icon: Mail, label: 'Email', value: 'contact@fedem.mg' },
                { icon: Phone, label: 'Téléphone', value: '+261 34 00 000 00' },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-fedem-600/15' : 'bg-fedem-50'}`}>
                    <c.icon className={`w-5 h-5 ${isDark ? 'text-fedem-400' : 'text-fedem-600'}`} />
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{c.label}</div>
                    <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`${glass} rounded-2xl p-6`}>
              <h4 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Suivez-nous</h4>
              <div className="flex gap-3">
                {[{ icon: FacebookIcon, label: 'Facebook' }, { icon: LinkedinIcon, label: 'LinkedIn' }].map((s) => (
                  <motion.a
                    key={s.label}
                    href="#"
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
                  <motion.button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-fedem-600 hover:bg-fedem-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-fedem-600/25 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Send className="w-4 h-4" />Envoyer le message
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
