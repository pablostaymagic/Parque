import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  MapPin,
  Play,
  ZoomIn,
  Share2,
  Camera,
  MessageCircle,
  Music2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

/* ─── CONSTANTS ─── */
const BRAND = {
  TRIGO: '#F6EED6',
  VERDE: '#004d26',
  DORADO: '#D4AF37'
};

const MOCK_STATIONS = [
  {
    id: 'm1',
    nombre_estacion: 'Santuario de la Paz',
    description: 'Un espacio sagrado diseñado para la introspección y el encuentro espiritual. Rodeado de naturaleza virgen y sonidos relajantes.',
    order: 1,
    media: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070', type: 'image' }],
    subestaciones: [
      {
        nombre: 'El Jardín de la Fe',
        description: 'Camina entre flores exóticas mientras meditas en las promesas de esperanza. Un rincón lleno de luz y color.',
        media: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=2071', type: 'image' }]
      },
      {
        nombre: 'Cascada del Espíritu',
        description: 'El sonido del agua cayendo limpia el alma y renueva las fuerzas. Siente la energía de la vida fluyendo.',
        media: [{ url: 'https://images.unsplash.com/photo-1433086566211-168393527b1f?auto=format&fit=crop&q=80&w=2070', type: 'image' }]
      }
    ]
  },
  {
    id: 'm2',
    nombre_estacion: 'Sendero del Renacer',
    description: 'Un recorrido ascendente que simboliza el crecimiento espiritual. Cada paso te acerca más a una vista panorámica celestial.',
    order: 2,
    media: [{ url: 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80&w=2070', type: 'image' }],
    subestaciones: [
      {
        nombre: 'Paso de la Reflexión',
        description: 'Un puente colgante donde el tiempo parece detenerse. Ideal para soltar las cargas y mirar hacia adelante.',
        media: [{ url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&q=80&w=2070', type: 'image' }]
      }
    ]
  },
  {
    id: 'm3',
    nombre_estacion: 'Cúpula de la Sabiduría',
    description: 'Una estructura arquitectónica única que integra la luz natural con el silencio absoluto. El corazón intelectual y espiritual del parque.',
    order: 3,
    media: [{ url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=2070', type: 'image' }],
    subestaciones: []
  }
];

/* ─── HELPERS ─── */
const toMediaObj = (p) => {
  if (!p) return null;
  if (typeof p === 'object' && p.url) return p;
  const url = typeof p === 'string' && p.startsWith('http') ? p : `http://localhost:3000${p}`;
  return { id: p, url, type: typeof p === 'string' && p.match(/\.(mp4|mov|webm)$/i) ? 'video' : 'image' };
};

/* ─── COMPONENTS ─── */

const FullscreenViewer = ({ item, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Keyboard close
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Full reset whenever the item changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, [item?.url]);

  if (!item) return null;

  const isImage = item.type !== 'video';

  const toggleZoom = () => {
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const zoomIn = () => setScale((s) => Math.min(+(s + 0.5).toFixed(1), 4));
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(+(s - 0.5).toFixed(1), 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  /* ── Mouse drag handlers ── */
  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  /* ── Touch drag handlers ── */
  const handleTouchStart = (e) => {
    if (scale <= 1) return;
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
  };
  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1) return;
    const t = e.touches[0];
    setPosition({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };
  const handleTouchEnd = () => setIsDragging(false);

  /* ── Cursor state ── */
  const cursor = scale === 1 ? 'zoom-in' : isDragging ? 'grabbing' : 'grab';

  return (
    <AnimatePresence>
      <motion.div
        key="fsviewer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[500] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden"
        onClick={onClose}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[510] p-3 rounded-full bg-[#F6EED6]/90 border border-green-deep/20 text-green-deep hover:bg-gold-accent hover:text-green-deep shadow-lg transition-all duration-300"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* ── Media content ── */}
        <motion.div
          key={item.url}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
          className="relative flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {isImage ? (
            <img
              src={item.url} alt=""
              className="w-auto h-auto max-w-[95vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl select-none transition-transform duration-200"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                cursor,
              }}
              draggable={false}
              onClick={scale > 1 ? undefined : toggleZoom}
              onDoubleClick={toggleZoom}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          ) : (
            <video
              src={item.url} controls autoPlay playsInline
              className="w-auto h-auto max-w-[95vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl bg-black"
            />
          )}
        </motion.div>

        {/* ── Zoom controls — images only ── */}
        {isImage && (
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[510] flex items-center gap-2 bg-black/50 border border-white/10 backdrop-blur-md rounded-full px-4 py-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-[54px] text-center text-white/80 text-xs font-bold tracking-wider">{Math.round(scale * 100)}%</div>
            <button onClick={zoomIn} disabled={scale >= 4}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center text-white font-bold text-xl leading-none"
            >+</button>
          </div>
        )}

        {/* ── Hint ── */}
        {isImage && scale === 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase pointer-events-none hidden sm:block">
            Clic para ampliar · arrastra para explorar
          </div>
        )}
        {isImage && scale > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-bold tracking-[0.25em] uppercase pointer-events-none hidden sm:block">
            Arrastra para explorar · doble clic para reducir
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const CardMedia = ({ item, onClick }) => {
  if (!item) return (
    <div
      className="relative w-full h-52 bg-white/40 flex items-center justify-center cursor-zoom-in group/media overflow-hidden"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      <Sparkles className="text-gold-accent/40 w-8 h-8" />
    </div>
  );
  return (
    <div
      className="relative w-full h-52 group/media cursor-zoom-in overflow-hidden bg-white/40"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
    >
      {item.type === 'video' ? (
        <video src={item.url} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" muted playsInline />
      ) : (
        <img src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
      )}
      <div className="absolute inset-0 bg-gold-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-green-deep/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        {item.type === 'video' ? <Play className="w-4 h-4 fill-gold-accent text-gold-accent" /> : <ZoomIn className="w-4 h-4 text-gold-accent" />}
      </div>
    </div>
  );
};

const ExperienceModal = ({ station, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [fsItem, setFsItem] = useState(null);

  useEffect(() => {
    setActiveSlide(0);
    setActiveMediaIndex(0);
  }, [station?.id]);

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [activeSlide]);

  if (!station) return null;

  const subStations = Array.isArray(station.subestaciones) ? station.subestaciones : [];

  const orderedSubStations = [...subStations].sort((a, b) => {
    const orderA = a.orden || a.order || 0;
    const orderB = b.orden || b.order || 0;
    return orderA - orderB;
  });

  const getSubStationMedia = (sub) => {
    const raw =
      sub?.media ||
      sub?.multimedia ||
      sub?.contenido_multimedia ||
      sub?.contenidoMultimedia ||
      sub?.imagen ||
      sub?.imagen_url ||
      sub?.video_url ||
      [];

    const list = Array.isArray(raw) ? raw : [raw];
    return list.map(toMediaObj).filter(Boolean);
  };

  const slides = [
    {
      type: 'station',
      label: station.order || station.orden
        ? `ESTACIÓN ${station.order || station.orden}`
        : 'ESTACIÓN PRINCIPAL',
      title: station.nombre_estacion || 'Estación',
      description: station.description || station.descripcion_principal || 'Sin descripción disponible.',
      media: Array.isArray(station.media) ? station.media.map(toMediaObj).filter(Boolean) : [],
    },
    ...orderedSubStations.map((sub, index) => ({
      type: 'substation',
      label: `SUBESTACIÓN ${sub.orden || sub.order || index + 1}`,
      title:
        sub.nombre ||
        sub.nombre_subestacion ||
        sub.titulo ||
        `Subestación ${index + 1}`,
      description:
        sub.description ||
        sub.descripcion ||
        sub.descripcion_subestacion ||
        sub.contenido ||
        'Sin descripción disponible.',
      media: getSubStationMedia(sub),
    }))
  ];

  const activeItem = slides[activeSlide];
  const activeMediaList = activeItem?.media || [];
  const activeMedia = activeMediaList[activeMediaIndex] || null;

  /* ── Slide (recorrido) navigation ── */
  const goPrevSlide = () => setActiveSlide((i) => Math.max(i - 1, 0));
  const goNextSlide = () => setActiveSlide((i) => Math.min(i + 1, slides.length - 1));

  /* ── Media navigation ── */
  const goPrevMedia = () => setActiveMediaIndex((i) => Math.max(i - 1, 0));
  const goNextMedia = () => setActiveMediaIndex((i) => Math.min(i + 1, activeMediaList.length - 1));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm overflow-y-auto font-inter flex items-center justify-center p-4 sm:p-6 md:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-[#F6EED6] border border-green-deep/10 rounded-3xl shadow-2xl flex flex-col my-auto text-green-deep"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[320] p-2.5 sm:p-3 rounded-full bg-[#F6EED6]/80 backdrop-blur-sm border border-green-deep/10 text-green-deep/70 hover:bg-gold-accent/15 hover:text-green-deep shadow-md hover:scale-105 transition-all">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* ═══════ Media Header ═══════ */}
          <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative overflow-hidden shrink-0 rounded-t-3xl bg-black">
            {activeMedia ? (
              activeMedia.type === 'video' ? (
                <video
                  src={activeMedia.url} controls playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <img
                  src={activeMedia.url} alt=""
                  className="w-full h-full object-cover cursor-zoom-in hover:scale-105 transition-transform duration-700"
                  onClick={() => setFsItem(activeMedia)}
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-green-deep/30 bg-[#F6EED6]/20">
                <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 stroke-[1]" />
                <span className="text-xs font-black uppercase tracking-[0.2em] mt-4 text-green-deep/30">Sin contenido multimedia</span>
              </div>
            )}

            {/* ── Ampliar button (always visible when media exists) ── */}
            {activeMedia && (
              <button
                type="button"
                onClick={() => setFsItem(activeMedia)}
                className="absolute top-4 right-4 z-[310] flex items-center gap-1.5 bg-[#F6EED6]/85 backdrop-blur-sm border border-green-deep/10 text-green-deep rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-gold-accent/20 hover:border-gold-accent/30 transition-all duration-300"
              >
                <ZoomIn className="w-3 h-3" /> Ampliar
              </button>
            )}

            {/* ── Media navigation arrows (over image) ── */}
            {activeMediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goPrevMedia}
                  disabled={activeMediaIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[310] p-2 rounded-full bg-[#F6EED6]/85 backdrop-blur-sm border border-green-deep/10 text-green-deep hover:bg-gold-accent/20 hover:border-gold-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={goNextMedia}
                  disabled={activeMediaIndex === activeMediaList.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[310] p-2 rounded-full bg-[#F6EED6]/85 backdrop-blur-sm border border-green-deep/10 text-green-deep hover:bg-gold-accent/20 hover:border-gold-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* ── Media counter badge ── */}
            {activeMediaList.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[310] bg-green-deep/70 text-beige-warm text-[10px] font-bold tracking-[0.25em] uppercase px-4 py-2 rounded-full backdrop-blur-sm">
                Multimedia {activeMediaIndex + 1} de {activeMediaList.length}
              </div>
            )}
          </div>

          {/* ═══════ Content Body ═══════ */}
          <div className="p-6 sm:p-10 md:p-12 flex flex-col gap-6 bg-transparent rounded-b-3xl">

            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-gold-accent uppercase tracking-[0.35em]">
                  {activeItem.label}
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-green-deep leading-tight">
                {activeItem.title}
              </h3>
              <div className="h-px w-12 bg-gold-accent/50 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-green-deep/70 text-sm sm:text-base font-inter leading-relaxed whitespace-pre-line">
              {activeItem.description}
            </p>

            {/* ── Slide (recorrido) navigation — only if multiple slides ── */}
            {slides.length > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-green-deep/10">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goPrevSlide}
                    disabled={activeSlide === 0}
                    className="p-2 rounded-full bg-white/50 border border-green-deep/10 text-green-deep hover:bg-gold-accent/15 hover:border-gold-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextSlide}
                    disabled={activeSlide === slides.length - 1}
                    className="p-2 rounded-full bg-white/50 border border-green-deep/10 text-green-deep hover:bg-gold-accent/15 hover:border-gold-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Recorrido dots */}
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveSlide(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide ? 'bg-gold-accent w-8' : 'bg-green-deep/20 w-2'
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Redes del destino (Centered) */}
            <div className="pt-6 border-t border-green-deep/10 flex flex-col items-center justify-center gap-4">
              <h4 className="text-[10px] font-bold text-gold-accent uppercase tracking-[0.35em]">REDES DEL DESTINO</h4>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { icon: Camera, href: 'https://www.instagram.com/igleparque' },
                  { icon: Music2, href: 'https://www.tiktok.com/@igleparque' },
                  { icon: Share2, href: 'https://www.facebook.com/share/18cBkLnzoM/' },
                  { icon: MessageCircle, href: 'https://wa.me/573145504897' }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/40 text-green-deep border border-green-deep/10 hover:bg-gold-accent/15 hover:text-green-deep hover:border-gold-accent/30 transition-all duration-300 shadow-sm">
                    <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </motion.div>

        {fsItem && <FullscreenViewer item={fsItem} onClose={() => setFsItem(null)} />}
      </motion.div>
    </AnimatePresence>
  );
};

const AttractionsSection = () => {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fsItem, setFsItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Todas');



  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/estaciones');
        const json = await res.json();
        console.log('Backend response (json):', json);

        if (json && json.success) {
          const rawData = Array.isArray(json.data) ? json.data : [];
          console.log('Raw data from backend:', rawData);

          const formatted = rawData
            .filter(s => s.visibilidad && s.visibilidad.toUpperCase() === 'ACTIVO')
            .map(s => ({
              ...s,
              order: s.orden || 0,
              nombre_estacion: s.nombre_estacion || 'Estación sin nombre',
              description: s.descripcion_principal || 'Sin descripción',
              media: Array.isArray(s.media) ? s.media.map(toMediaObj).filter(Boolean) : [],
              subestaciones: Array.isArray(s.subestaciones) ? s.subestaciones : (typeof s.subestaciones === 'string' ? JSON.parse(s.subestaciones) : [])
            }));

          console.log('Formatted stations:', formatted);
          setStations(formatted.sort((a, b) => a.order - b.order));
        } else {
          console.warn('Backend returned success: false or invalid structure', json);
        }
      } catch (e) {
        console.error('CRITICAL: Backend connection failed:', e);
      }
    };
    fetchStations();
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'Todas') return stations;
    const [start, end] = activeFilter.split('-').map(Number);
    return stations.filter(s => s.order >= start && s.order <= end);
  }, [stations, activeFilter]);





  return (
    <section id="attractions" className="py-24 bg-[#F6EED6] relative overflow-hidden">
      {/* Cinematic & Spiritual Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold-accent">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">Recorrido Espiritual</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold tracking-tight text-green-deep leading-tight">
            Nuestras Estaciones
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent mx-auto my-3" />
          <p className="font-inter text-base md:text-lg text-green-deep/70 leading-relaxed">Descubre los puntos clave de nuestro recorrido bíblico y natural.</p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap justify-center gap-2 p-2 rounded-[999px] bg-white/30 border border-green-deep/10 backdrop-blur-sm shadow-sm">
            {['Todas', '1-5', '6-10', '11-15', '16-21'].map(f => (
              <button
                key={f} onClick={() => { setActiveFilter(f); }}
                className={`px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-inter font-bold uppercase tracking-[0.18em] transition-all duration-300 border inline-flex items-center gap-2 ${activeFilter === f ? 'bg-green-deep text-beige-warm border-green-deep shadow-md ring-1 ring-gold-accent/20' : 'bg-[#F6EED6]/70 text-green-deep border-green-deep/10 shadow-sm hover:bg-white/50 hover:border-gold-accent/30 hover:shadow-md'}`}
              >
                {activeFilter === f && <span className="w-1.5 h-1.5 rounded-full bg-gold-accent" />}
                {f === 'Todas' ? 'Todas' : `Estaciones ${f}`}
              </button>
            ))}
          </div>
        </div>

        {/* Grid / Carousel */}
        <div className="relative max-w-[1400px] mx-auto">
          {/* Swiper Pagination Styles */}
          <style>{`
            .attractions-coverflow .swiper-pagination {
              bottom: 0 !important;
            }
            .attractions-coverflow .swiper-pagination-bullet {
              background: rgba(0, 77, 38, 0.25) !important;
              opacity: 1 !important;
              width: 8px !important;
              height: 8px !important;
              transition: all 0.3s ease !important;
            }
            .attractions-coverflow .swiper-pagination-bullet-active {
              background: #D4AF37 !important;
              width: 26px !important;
              border-radius: 999px !important;
            }
          `}</style>

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={filtered.length > 3}
            slidesPerView="auto"
            spaceBetween={24}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 160,
              modifier: 2.2,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="attractions-coverflow !pb-14"
          >
            {Array.isArray(filtered) && filtered.map((s) => (
              <SwiperSlide
                key={s.id}
                className="!w-[82vw] sm:!w-80 md:!w-[340px] lg:!w-[360px]"
              >
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#F6EED6]/95 border border-green-deep/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full relative"
                >
                  <div className="relative">
                    <CardMedia
                      item={s.media?.[0]}
                      onClick={() => { if (s.media?.[0]) setFsItem(s.media[0]); }}
                    />
                    {s.order !== undefined && (
                      <span className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[#F6EED6]/95 border border-gold-accent/30 text-green-deep text-xs font-inter font-bold shadow-md backdrop-blur-sm z-10">
                        #{s.order}
                      </span>
                    )}
                    <span className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full border text-[10px] font-inter font-black uppercase tracking-[0.18em] backdrop-blur-sm bg-emerald-500 text-white border-emerald-300 shadow-md">
                      ACTIVO
                    </span>
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col flex-1 space-y-4 justify-between bg-transparent">
                    <div className="flex flex-col flex-1 space-y-2">
                      <h3 className="font-playfair text-[1.25rem] font-bold text-green-deep leading-tight group-hover:text-gold-accent transition-colors duration-300 text-left">{s.nombre_estacion}</h3>
                      <p className="font-inter text-xs sm:text-sm font-semibold text-green-deep/70 leading-relaxed max-h-[60px] overflow-hidden text-ellipsis line-clamp-2 text-left" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{s.description}</p>
                    </div>

                    <button
                      onClick={() => setSelected(s)}
                      className="inline-flex items-center mt-2 font-inter font-semibold text-[11px] text-[#D4AF37] hover:text-[#D4AF37]/80 hover:translate-x-1 transition-all duration-200 self-start uppercase tracking-wider"
                    >
                      VER MÁS →
                    </button>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selected && <ExperienceModal station={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
      {fsItem && <FullscreenViewer item={fsItem} onClose={() => setFsItem(null)} />}
    </section>
  );
};

export default AttractionsSection;
