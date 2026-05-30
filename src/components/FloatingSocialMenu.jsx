import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Inline SVG Icons ─── */
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.558.217.957.477 1.377.896.42.42.68.819.896 1.377.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.217.558-.477.957-.896 1.377-.42.42-.819.68-1.377.896-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.558-.217-.957-.477-1.377-.896-.42-.42-.68-.819-.896-1.377-.163-.422-.358-1.057-.412-2.227-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.217-.558.477-.957.896-1.377.42-.42.819-.68 1.377-.896.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.132 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126s1.384 1.078 2.126 1.384c.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.261 2.913-.558.788-.306 1.459-.717 2.126-1.384s1.078-1.384 1.384-2.126c.296-.765.499-1.636.558-2.913.058-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.261-2.148-.558-2.913-.306-.789-.717-1.459-1.384-2.126S20.65.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.387H7.078v-3.467h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.467h-2.796v8.387C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="12"></line>
  </svg>
);

/* ─── Social platform config ─── */
const SOCIALS = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    tooltip: 'Escríbenos',
    icon: WhatsAppIcon,
    href: 'https://wa.me/573145504897?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Igle%20Parque.',
    color: '#25D366',
    bg: 'bg-[#25D366]',
    glow: 'shadow-[0_8px_30px_rgba(37,211,102,0.45)]',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    tooltip: 'Instagram',
    icon: InstagramIcon,
    href: 'https://www.instagram.com/igleparque?igsh=b3F0Ymtkd3J2eDZz&utm_source=qr',
    color: '#E1306C',
    bg: 'bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737]',
    glow: 'shadow-[0_8px_30px_rgba(225,48,108,0.45)]',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    tooltip: 'Facebook',
    icon: FacebookIcon,
    href: 'https://www.facebook.com/share/18cBkLnzoM/?mibextid=wwXIfr',
    color: '#1877F2',
    bg: 'bg-[#1877F2]',
    glow: 'shadow-[0_8px_30px_rgba(24,119,242,0.45)]',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    tooltip: 'TikTok',
    icon: TikTokIcon,
    href: 'https://www.tiktok.com/@igleparque?_r=1&_t=ZS-95yI8OFTC3M',
    color: '#ffffff',
    bg: 'bg-[#111111]',
    glow: 'shadow-[0_8px_30px_rgba(0,0,0,0.45)]',
  },
];

/* ─── Framer Motion variants ─── */
const listVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 26 },
  },
  closed: {
    opacity: 0,
    y: 20,
    scale: 0.72,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
};

const iconVariants = {
  enter: { opacity: 0, scale: 0.4, rotate: -30 },
  center: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 420, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.4,
    rotate: 30,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const tooltipVariants = {
  hidden: { opacity: 0, x: 8, scale: 0.88 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.16, ease: 'easeOut' },
  },
};

/* ─── Individual social button ─── */
const SocialButton = ({ social }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = social.icon;

  return (
    <motion.div
      variants={itemVariants}
      className="relative flex items-center justify-end"
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            key="tooltip"
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute right-[54px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-green-deep/95 backdrop-blur-sm text-beige-warm text-[11px] font-semibold shadow-xl pointer-events-none select-none"
          >
            {social.tooltip}
            {/* Caret */}
            <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-green-deep/95" />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <a
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.label}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          flex items-center justify-center
          w-11 h-11 rounded-full
          ${social.bg} text-white
          shadow-lg hover:scale-110 active:scale-95
          transition-transform duration-200
          ring-2 ring-white/15
        `}
      >
        <Icon className="w-[19px] h-[19px]" />
      </a>
    </motion.div>
  );
};

/* ─── Main floating component ─── */
const FloatingSocialMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const intervalRef = useRef(null);

  /* Cycle icon every 2.5s — pause while menu is open */
  useEffect(() => {
    if (isOpen) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SOCIALS.length);
    }, 2500);
    return () => clearInterval(intervalRef.current);
  }, [isOpen]);

  const activeSocial = SOCIALS[activeIdx];

  return (
    <div
      className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3"
      aria-label="Menú de redes sociales"
    >
      {/* ── Expanded social buttons ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="social-list"
            variants={listVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="flex flex-col items-end gap-3"
          >
            {/* Reverse so WhatsApp is closest to the toggle */}
            {[...SOCIALS].reverse().map((social) => (
              <SocialButton key={social.id} social={social} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main toggle button ── */}
      <div className="relative">
        {/* Outer pulse ring — only when closed */}
        {!isOpen && (
          <motion.span
            key={`pulse-${activeIdx}`}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ backgroundColor: activeSocial.color }}
            initial={{ opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.8, ease: 'easeOut', repeat: Infinity }}
          />
        )}

        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Cerrar redes sociales' : 'Abrir redes sociales'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          className={`
            relative z-10
            flex items-center justify-center
            w-[56px] h-[56px] rounded-full
            text-white cursor-pointer
            ring-[3px] ring-white/25
            transition-all duration-500
            overflow-hidden
            ${isOpen
              ? 'bg-green-deep shadow-[0_8px_30px_rgba(27,48,34,0.5)]'
              : `${activeSocial.bg} ${activeSocial.glow}`
            }
          `}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              /* Close icon */
              <motion.div
                key="close"
                variants={iconVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <CloseIcon className="w-5 h-5" />
              </motion.div>
            ) : (
              /* Cycling social icon */
              <motion.div
                key={activeSocial.id}
                variants={iconVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                <activeSocial.icon className="w-[22px] h-[22px]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingSocialMenu;
