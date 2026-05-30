import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, ChevronLeft, ChevronRight, X, ExternalLink, ZoomIn, Play, Film } from 'lucide-react';

/* ─── Fullscreen Viewer ─── */
const FullscreenViewer = ({ src, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10000] p-3 rounded-full bg-[#F6EED6]/90 border border-green-deep/20 text-green-deep hover:bg-gold-accent hover:text-green-deep shadow-lg transition-all duration-300"
    >
      <X className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
    {type === 'video' ? (
      <video src={src} className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl bg-black" controls autoPlay onClick={(e) => e.stopPropagation()} />
    ) : (
      <motion.img
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        src={src}
        alt="Full view"
        className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      />
    )}
  </motion.div>
);

/* ─── Premium Media Slider ─── */
const MediaSlider = ({ mediaPaths, onZoom }) => {
  const [current, setCurrent] = useState(0);
  if (!mediaPaths || mediaPaths.length === 0) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrent(prev => (prev === 0 ? mediaPaths.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrent(prev => (prev === mediaPaths.length - 1 ? 0 : prev + 1));
  };

  const path = mediaPaths[current];
  const isVideo = path.match(/\.(mp4|mov)$/i);
  const src = `http://localhost:3000${path}`;

  return (
    <div className="w-full h-full relative group overflow-hidden">
      {/* Slide media */}
      <div className="w-full h-full cursor-pointer" onClick={() => onZoom(src, isVideo ? 'video' : 'image')}>
        {isVideo ? (
          <div className="w-full h-full bg-black flex items-center justify-center relative">
            <video src={src} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>
            </div>
          </div>
        ) : (
          <img src={src} alt="Scenic slide" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
      </div>

      {/* Navigation Arrows */}
      {mediaPaths.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {mediaPaths.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

/* ─── Detail Modal ─── */
const DetailModal = ({ item, onClose }) => {
  const [zoomItem, setZoomItem] = useState(null);
  if (!item) return null;

  const mediaList = item.contenido_media || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl bg-[#F6EED6] border border-green-deep/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar text-green-deep"
        >
          {/* Header Media Slider */}
          <div className="h-64 sm:h-80 overflow-hidden relative bg-black">
            {mediaList.length > 0 ? (
              <MediaSlider mediaPaths={mediaList} onZoom={(src, type) => setZoomItem({ src, type })} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-green-deep/20 bg-[#F6EED6]/20">
                <MapPin className="w-16 h-16 mb-2" />
                <span className="text-xs uppercase tracking-widest font-bold">Sin Multimedia</span>
              </div>
            )}
            
            {item.categoria && (
              <span className="absolute top-6 left-6 text-[9px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-full bg-gold-accent/25 backdrop-blur-md text-gold-accent border border-gold-accent/20 shadow-sm z-10">
                {item.categoria}
              </span>
            )}
          </div>

          <button onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-[#F6EED6]/90 backdrop-blur-sm border border-green-deep/10 text-green-deep hover:bg-gold-accent/20 hover:scale-105 shadow-md transition-all z-20">
            <X className="w-5 h-5" />
          </button>

          <div className="p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <h3 className="text-3xl font-playfair font-bold text-green-deep leading-tight">{item.nombre}</h3>
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent my-3" />
            </div>
            
            <p className="text-base text-green-deep/70 leading-relaxed font-inter whitespace-pre-line">
              {item.descripcion_principal}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {item.maps && (
                <a href={item.maps} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-deep text-beige-warm rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold-accent hover:text-green-deep transition-all duration-300 shadow-lg shadow-green-deep/10">
                  <MapPin className="w-4 h-4" /> Cómo llegar
                </a>
              )}
              {item.telefono && (
                <a href={`tel:${item.telefono.replace(/\s/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gold-accent text-green-deep rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold-accent/80 transition-all duration-300 shadow-lg shadow-gold-accent/10">
                  <Phone className="w-4 h-4" /> Llamar ahora
                </a>
              )}
            </div>

            <button 
              onClick={onClose}
              className="w-full py-4 bg-transparent border border-green-deep/20 text-green-deep rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-green-deep hover:text-beige-warm transition-all duration-300 mt-4"
            >
              Cerrar
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {zoomItem && <FullscreenViewer src={zoomItem.src} type={zoomItem.type} onClose={() => setZoomItem(null)} />}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
};

/* ─── Card ─── */
const TourismCard = ({ item, onDetail }) => {
  const mediaList = item.contenido_media || [];
  const hasMedia = mediaList.length > 0;
  const primaryPath = hasMedia ? mediaList[0] : null;
  const isVideo = primaryPath ? primaryPath.match(/\.(mp4|mov)$/i) : false;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="flex-shrink-0 w-full sm:w-80 bg-white/40 backdrop-blur-sm rounded-3xl shadow-sm border border-green-deep/10 overflow-hidden flex flex-col snap-start transition-all duration-300 hover:shadow-xl hover:shadow-green-deep/5"
    >
      {/* Media Wrapper */}
      <div 
        className="h-52 bg-[#F6EED6]/50 relative overflow-hidden flex-shrink-0 cursor-pointer group/img rounded-2xl m-4 mb-0"
        onClick={() => onDetail(item)}
      >
        {hasMedia ? (
          isVideo ? (
            <div className="w-full h-full bg-black relative">
              <video src={`http://localhost:3000${primaryPath}`} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" muted playsInline />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-10 h-10 text-white fill-white opacity-85" />
              </div>
            </div>
          ) : (
            <img 
              src={`http://localhost:3000${primaryPath}`} 
              alt={item.nombre} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-green-deep/15">
            <MapPin className="w-10 h-10" />
          </div>
        )}

        {item.categoria && (
          <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-gold-accent/10 border border-gold-accent/20 backdrop-blur-sm text-gold-accent z-10 shadow-sm">
            {item.categoria}
          </span>
        )}

        {mediaList.length > 1 && (
          <span className="absolute bottom-4 right-4 text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 text-white backdrop-blur-sm z-10 shadow flex items-center gap-1">
            <Film className="w-3 h-3" /> +{mediaList.length - 1} Media
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-90 group-hover/img:scale-100 transition-transform">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <span className="text-[10px] text-white font-bold uppercase tracking-[0.2em]">Explorar detalles</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 space-y-4 text-green-deep">
        <h4 className="text-lg font-playfair font-bold text-green-deep leading-tight group-hover:text-gold-accent transition-colors duration-300">{item.nombre}</h4>
        <p className="text-xs sm:text-sm text-green-deep/65 leading-relaxed line-clamp-2 flex-1 font-inter">{item.descripcion_principal}</p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          {item.maps && (
            <a href={item.maps} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-deep text-beige-warm rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-gold-accent hover:text-green-deep transition-all duration-300 shadow-sm">
              <MapPin className="w-3 h-3" /> Ubicación
            </a>
          )}
          {item.telefono && (
            <a href={`tel:${item.telefono.replace(/\s/g, '')}`}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gold-accent text-green-deep rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-gold-accent/80 transition-all duration-300 shadow-sm">
              <Phone className="w-3 h-3" /> Llamar
            </a>
          )}
        </div>
        <button onClick={() => onDetail(item)}
          className="w-full py-2.5 bg-transparent border border-green-deep/20 text-green-deep rounded-full font-bold text-[9px] uppercase tracking-widest hover:bg-green-deep hover:text-beige-warm transition-all duration-300">
          Ver experiencia completa
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Main Section ─── */
const TourismSection = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const scrollRef = useRef(null);

  const loadItems = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/turismo/publico');
      if (!response.ok) throw new Error('Error al conectar con la base de datos de turismo');
      const json = await response.json();
      if (json.success && json.data) {
        setItems(json.data);
      }
    } catch (err) {
      console.error('Error cargando destinos desde la DB:', err);
    }
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('storage', loadItems);
    return () => window.removeEventListener('storage', loadItems);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#F6EED6] relative overflow-hidden" id="turismo">
      {/* Decorative Blur elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-gold-accent/5 rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-green-deep/5 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-accent">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">
                Descubre los alrededores
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-green-deep leading-tight">
              Qué hacer en <span className="text-gold-accent">Anolaima</span>
            </h2>
            <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent my-3" />
            <p className="text-sm lg:text-base text-green-deep/70 font-inter mt-4 max-w-2xl leading-relaxed">
              Descubre experiencias, lugares y actividades recomendadas cerca de Igle Parque.
            </p>
          </div>

          <div className="flex gap-3 self-end sm:self-auto">
            <button onClick={() => scroll(-1)}
              className="w-11 h-11 rounded-full bg-white/40 border border-green-deep/10 flex items-center justify-center text-green-deep hover:bg-gold-accent/15 hover:border-gold-accent/30 hover:scale-105 shadow-sm transition-all duration-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll(1)}
              className="w-11 h-11 rounded-full bg-green-deep flex items-center justify-center text-beige-warm hover:bg-gold-accent hover:text-green-deep hover:scale-105 shadow-sm transition-all duration-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="grid grid-cols-1 sm:flex sm:overflow-x-auto sm:snap-x sm:snap-mandatory gap-6 sm:gap-5 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, i) => (
            <motion.div key={item.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="w-full sm:w-auto"
            >
              <TourismCard item={item} onDetail={setSelected} />
            </motion.div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gold-accent/10 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400 max-w-2xl mx-auto italic leading-relaxed">
            Igle Parque solo recomienda lugares para fomentar el turismo local y no se hace responsable por servicios externos.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
};

export default TourismSection;
