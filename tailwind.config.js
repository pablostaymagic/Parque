/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── VERDES (Fondos) ──────────────────────────────
        'green-forest': '#013220',   // Fondo principal de sección
        'green-deep':   '#004d26',   // Fondo de tarjetas y modales
        'green-nature': '#228B22',   // Verde natural / acento vivo
        'green-olive':  '#1A3328',   // Verde musgo elegante
        'green-moss':   '#1D352B',   // Verde envejecido

        // ── INTERACCIÓN ──────────────────────────────────
        'green-hover':   '#223D31',
        'green-active':  '#294437',

        // ── DORADOS (Acentos y botones) ──────────────────
        'gold-accent':   '#D4AF37',  // Acento principal – dorado fuerte
        'gold-warm':     '#C9B37A',  // Dorado cálido secundario
        'gold-premium':  '#C6A56A',  // Dorado cinematográfico
        'gold-linen':    '#D8C29A',  // Dorado lino

        // ── BEIGES (Textos secundarios) ───────────────────
        'beige-warm':    '#F5E8D0',  // Texto secundario / descripciones
        'beige-linen':   '#F4F0E6',  // Lino natural
        'beige-cream':   '#EFE7D7',  // Crema envejecido
        'beige-sand':    '#E8DFCF',  // Arena refinada

        // ── BLANCO DEFINIDO EXPLICITAMENTE ───────────────
        'white':         '#FFFFFF',

        // ── TEXTOS ────────────────────────────────────────
        'text-warm':  '#F7F3EB',     // Blanco cálido suave
        'text-muted': '#D7CFC0',     // Beige desaturado
        'text-faded': '#B7AE9F',     // Tono apagado

        // ── LEGACY (compatibilidad retroactiva) ───────────
        'green-nature-legacy': '#1A3328',
      },

      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        inter:    ['Inter', 'sans-serif'],
      },

      fontSize: {
        xs:   ['9px',  { lineHeight: '1.4' }],
        sm:   ['14px', { lineHeight: '1.5' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg:   ['18px', { lineHeight: '1.6' }],
        xl:   ['20px', { lineHeight: '1.5' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
        '3xl': ['30px', { lineHeight: '1.3' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
        '6xl': ['60px', { lineHeight: '1.05' }],
        '7xl': ['72px', { lineHeight: '1' }],
      },

      fontWeight: {
        light:  '300',
        normal: '400',
        medium: '500',
        bold:   '700',
        black:  '900',
      },

      boxShadow: {
        'premium': '0 20px 50px rgba(0, 0, 0, 0.3)',
        'soft':    '0 10px 30px rgba(1, 50, 32, 0.15)',
        'gold':    '0 0 20px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
};
