import React from 'react';
import { motion } from 'framer-motion';
import {
  Leaf,
  MapPin,
  Mail,
  Phone,
  Camera,
  Share2,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Music2,
} from 'lucide-react';

/* ─── Data ─── */
const quickLinks = [
  { label: 'Inicio', href: '#' },
  { label: 'Historia', href: '#history' },
  { label: 'Atracciones', href: '#attractions' },
  { label: 'Eventos', href: '#events' },
  { label: 'Contacto', href: '#contact' },
];

const contactItems = [
  {
    icon: Phone,
    label: 'WhatsApp',
    value: '+57 314 550 4897',
    href: 'https://wa.me/573145504897?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Igle%20Parque.',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'Igleparque@gmail.com',
    href: 'mailto:Igleparque@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Ubicación',
    value: 'Anolaima, Cundinamarca',
    href: 'https://maps.google.com/?q=Anolaima,Cundinamarca,Colombia',
  },
];

const socialLinks = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/573145504897?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Igle%20Parque.',
    hoverColor: 'hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/40',
  },
  {
    icon: Camera,
    label: 'Instagram',
    href: 'https://www.instagram.com/igleparque?igsh=b3F0Ymtkd3J2eDZz&utm_source=qr',
    hoverColor: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/40',
  },
  {
    icon: Share2,
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18cBkLnzoM/?mibextid=wwXIfr',
    hoverColor: 'hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/40',
  },
  {
    icon: Music2,
    label: 'TikTok',
    href: 'https://www.tiktok.com/@igleparque?_r=1&_t=ZS-95yI8OFTC3M',
    hoverColor: 'hover:bg-neutral-800/20 hover:text-white hover:border-white/40',
  },
];

/* ─── Animation variants ─── */
const colVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: 'easeOut' },
  }),
};

/* ─── Footer Component ─── */
const Footer = () => (
  <footer
    id="contact"
    className="bg-green-deep text-beige-warm relative overflow-hidden"
  >
    {/* Subtle radial glow top-center */}
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent" />
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />

    <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-10">

      {/* ── 4-Column Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-white/8">

        {/* Col 1 — Brand */}
        <motion.div
          custom={0}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gold-accent/15 rounded-full">
              <Leaf className="w-5 h-5 text-gold-accent" />
            </div>
            <span className="text-2xl font-playfair font-bold tracking-tight">
              Igle Parque
            </span>
          </div>

          {/* Tagline */}
          <p className="text-beige-warm/50 text-sm leading-relaxed max-w-[220px] font-inter">
            Un santuario donde la fe, la paz y la naturaleza se encuentran para renovar el alma.
          </p>

          {/* Decorative sparks */}
          <div className="flex items-center gap-2 text-gold-accent/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.35em] uppercase">
              Anolaima, Colombia
            </span>
          </div>
        </motion.div>

        {/* Col 2 — Quick Links */}
        <motion.div
          custom={1}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h4 className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">
            Enlaces rápidos
          </h4>
          <ul className="space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="group flex items-center gap-2 text-sm text-beige-warm/55 hover:text-beige-warm transition-colors duration-300"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-gold-accent/40 group-hover:text-gold-accent group-hover:translate-x-0.5 transition-all duration-300" />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Col 3 — Contact */}
        <motion.div
          custom={2}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h4 className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">
            Contacto
          </h4>
          <ul className="space-y-4">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm text-beige-warm/55 hover:text-beige-warm transition-colors duration-300"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 group-hover:bg-gold-accent/15 transition-colors duration-300">
                      <Icon className="w-3.5 h-3.5 text-gold-accent/70 group-hover:text-gold-accent transition-colors duration-300" />
                    </div>
                    <div className="leading-snug">
                      <span className="block text-[10px] text-beige-warm/30 uppercase tracking-widest mb-0.5">
                        {item.label}
                      </span>
                      {item.value}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Col 4 — Social */}
        <motion.div
          custom={3}
          variants={colVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >
          <h4 className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">
            Síguenos
          </h4>
          <p className="text-sm text-beige-warm/45 leading-relaxed">
            Comparte tu experiencia espiritual y mantente al día con nuestros eventos. Déjanos tu mensaje y te responderemos pronto.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`p-2.5 rounded-xl border border-white/10 text-beige-warm/50 transition-all duration-300 ${s.hoverColor}`}
                >
                  <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" strokeWidth={1.8} />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Bottom Bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <p className="text-[11px] text-beige-warm/25 tracking-widest uppercase">
          © {new Date().getFullYear()} Igle Parque. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-1.5 text-gold-accent/40">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold-accent/40" />
          <Leaf className="w-3 h-3" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold-accent/40" />
        </div>
        <p className="text-[11px] text-beige-warm/20 tracking-wide">
          Anolaima, Cundinamarca, Colombia
        </p>
      </motion.div>

    </div>
  </footer>
);

export default Footer;
