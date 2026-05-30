import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Globe, X, Compass, ArrowRight, ZoomIn } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

const API_URL = 'http://localhost:3000/api/turismo/publico';

// Utility helper to safely parse redes_sociales column in any format
const parseRedes = (redes) => {
  if (!redes) return [];
  if (Array.isArray(redes)) {
    return redes.map(r => typeof r === 'string' ? r.trim() : r).filter(Boolean);
  }
  if (typeof redes === 'string') {
    try {
      const parsed = JSON.parse(redes);
      if (Array.isArray(parsed)) {
        return parsed.map(r => typeof r === 'string' ? r.trim() : r).filter(Boolean);
      }
    } catch (e) {
      // Comma-separated fallback
      return redes.split(',').map(r => r.trim()).filter(Boolean);
    }
  }
  return [];
};

/* ─── Lightbox / Fullscreen Viewer ─── */
const FullscreenLightbox = ({ src, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 select-none"
    onClick={onClose}
  >
    <button
      onClick={onClose}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10000] p-3 rounded-full bg-[#F6EED6]/90 border border-green-deep/20 text-green-deep hover:bg-gold-accent hover:text-green-deep shadow-lg transition-all duration-300"
    >
      <X className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
    {type === 'video' ? (
      <video
        src={src}
        className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl bg-black"
        controls
        autoPlay
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <motion.img
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        src={src}
        alt="Fullscreen media"
        className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
        onClick={(e) => e.stopPropagation()}
      />
    )}
  </motion.div>
);

const RecommendationsSection = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lightboxItem, setLightboxItem] = useState(null);

  const loadItems = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al conectar con la base de datos de turismo');
      const json = await response.json();
      if (json.success && json.data) {
        // Solo destinos con visibilidad ACTIVO (en minúscula o mayúscula)
        const activeDestinations = json.data.filter(item => {
          return !item.visibilidad || item.visibilidad.toUpperCase() === 'ACTIVO';
        });
        setItems(activeDestinations);
      }
    } catch (err) {
      console.error('Error cargando destinos turísticos en el Home:', err);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[#F6EED6] relative overflow-hidden" id="turismo">
      {/* Decorative details */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-80 h-80 bg-gold-accent/5 rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-green-deep/5 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 text-gold-accent">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">Destinos Locales</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-green-deep leading-tight">
            Sitios Recomendados y Turismo
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent mx-auto my-3" />
          <p className="text-sm lg:text-base text-green-deep/70 font-inter mt-4 leading-relaxed max-w-xl mx-auto">
            Explora de manera segura la cultura, paisajes y gastronomía de Anolaima con nuestras recomendaciones premium.
          </p>
        </div>

        {/* Card Swiper/Carousel */}
        <div className="relative max-w-[1400px] mx-auto">
          {/* Swiper Pagination Styles */}
          <style>{`
            .recommendations-coverflow .swiper-pagination {
              bottom: 0 !important;
            }
            .recommendations-coverflow .swiper-pagination-bullet {
              background: rgba(0, 77, 38, 0.25) !important;
              opacity: 1 !important;
              width: 8px !important;
              height: 8px !important;
              transition: all 0.3s ease !important;
            }
            .recommendations-coverflow .swiper-pagination-bullet-active {
              background: #D4AF37 !important;
              width: 26px !important;
              border-radius: 999px !important;
            }
          `}</style>

          <Swiper
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            loop={items.length > 3}
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
            className="recommendations-coverflow !pb-14"
          >
            {items.map((destino, index) => {
              const mediaList = destino.contenido_media || [];
              const hasMedia = mediaList.length > 0;
              const primaryMedia = hasMedia ? mediaList[0] : null;
              const isVideo = primaryMedia ? primaryMedia.match(/\.(mp4|mov)$/i) : false;

              // Descripción corta truncada
              const shortDescription = destino.descripcion_principal
                ? (destino.descripcion_principal.length > 120
                  ? destino.descripcion_principal.substring(0, 120) + '...'
                  : destino.descripcion_principal)
                : '';

              return (
                <SwiperSlide
                  key={destino.id || index}
                  className="!w-[82vw] sm:!w-80 md:!w-[340px] lg:!w-[360px]"
                >
                  <motion.div
                    key={destino.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white/40 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm border border-green-deep/10 flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full"
                  >
                    {/* Media Container - Opens Fullscreen Lightbox on click/tap */}
                    <div
                      onClick={() => {
                        if (hasMedia) {
                          setLightboxItem({
                            src: `http://localhost:3000${primaryMedia}`,
                            type: isVideo ? 'video' : 'image'
                          });
                        }
                      }}
                      className="h-52 bg-[#F6EED6]/50 relative overflow-hidden flex-shrink-0 cursor-pointer group/media select-none touch-action-manipulation rounded-2xl m-4 mb-0"
                    >
                      {hasMedia ? (
                        isVideo ? (
                          <video
                            src={`http://localhost:3000${primaryMedia}`}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-105 active:scale-105"
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={`http://localhost:3000${primaryMedia}`}
                            alt={destino.nombre}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/media:scale-105 active:scale-105"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-green-deep/15">
                          <Compass className="w-12 h-12" />
                        </div>
                      )}

                      {/* Elegant Centered Magnifying Glass Lupa (Appears ONLY on hover/active/press) */}
                      {hasMedia && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/media:opacity-100 group-active/media:opacity-100 transition-opacity duration-300 z-10">
                          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 group-hover/media:scale-110 transition-transform duration-300">
                            <ZoomIn className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}

                      {/* Category Tag */}
                      {destino.categoria && (
                        <span className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-gold-accent/10 border border-gold-accent/20 backdrop-blur-sm text-gold-accent z-10 shadow-sm">
                          {destino.categoria}
                        </span>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6 sm:p-7 flex flex-col flex-1 space-y-4 text-green-deep">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-playfair font-bold text-green-deep leading-tight group-hover:text-gold-accent transition-colors duration-300 text-left">
                          {destino.nombre}
                        </h3>
                        <p className="text-xs sm:text-sm text-green-deep/65 leading-relaxed font-inter text-left">
                          {shortDescription}
                        </p>
                      </div>

                      {/* Action Buttons Together */}
                      <div className="flex gap-3 pt-3 border-t border-green-deep/10">
                        {destino.maps ? (
                          <a
                            href={destino.maps}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-green-deep text-beige-warm rounded-full font-bold text-[9px] uppercase tracking-widest transition-all duration-300 hover:bg-gold-accent hover:text-green-deep shadow hover:shadow-md text-center"
                          >
                            <MapPin className="w-3.5 h-3.5" /> Cómo llegar
                          </a>
                        ) : (
                          <div className="flex-1 px-4 py-3 bg-green-deep/5 border border-green-deep/10 text-green-deep/40 rounded-full font-bold text-[9px] uppercase tracking-widest text-center cursor-not-allowed">
                            Sin mapa
                          </div>
                        )}

                        <button
                          onClick={() => setSelected(destino)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-gold-accent text-green-deep rounded-full font-bold text-[9px] uppercase tracking-widest transition-all duration-300 hover:bg-gold-accent/80 shadow hover:shadow-md text-center"
                        >
                          Ver más <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      {/* ─── Detail Modal (Ver más) ─── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelected(null)}
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-3xl bg-[#F6EED6] border border-green-deep/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col text-green-deep"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-[#F6EED6]/90 backdrop-blur-sm border border-green-deep/10 text-green-deep hover:bg-gold-accent/20 hover:scale-105 shadow-md transition-all z-20"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content Container */}
              <div className="overflow-y-auto custom-scrollbar flex-1">
                {/* Image Gallery */}
                {selected.contenido_media && selected.contenido_media.length > 0 && (
                  <div className="bg-black relative">
                    {/* Solo un archivo principal */}
                    {selected.contenido_media.length === 1 ? (
                      <div className="h-64 sm:h-96 w-full relative">
                        <div
                          onClick={() => {
                            const path = selected.contenido_media[0];
                            setLightboxItem({
                              src: `http://localhost:3000${path}`,
                              type: path.match(/\.(mp4|mov)$/i) ? 'video' : 'image'
                            });
                          }}
                          className="w-full h-full relative cursor-pointer group/media overflow-hidden select-none touch-action-manipulation"
                        >
                          {selected.contenido_media[0].match(/\.(mp4|mov)$/i) ? (
                            <video
                              src={`http://localhost:3000${selected.contenido_media[0]}`}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/media:scale-105 active:scale-105"
                              muted
                              playsInline
                            />
                          ) : (
                            <img
                              src={`http://localhost:3000${selected.contenido_media[0]}`}
                              alt={selected.nombre}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/media:scale-105 active:scale-105"
                            />
                          )}
                          {/* Lupa Overlay inside Modal */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/media:opacity-100 group-active/media:opacity-100 transition-opacity duration-300 z-10">
                            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 group-hover/media:scale-110 transition-transform duration-300">
                              <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Galería Simple para múltiples archivos */
                      <div className="flex overflow-x-auto snap-x snap-mandatory h-64 sm:h-96 w-full scrollbar-hide bg-black">
                        {selected.contenido_media.map((path, idx) => {
                          const isVid = path.match(/\.(mp4|mov)$/i);
                          return (
                            <div key={idx} className="snap-start flex-shrink-0 w-full h-full relative">
                              <div
                                onClick={() => {
                                  setLightboxItem({
                                    src: `http://localhost:3000${path}`,
                                    type: isVid ? 'video' : 'image'
                                  });
                                }}
                                className="w-full h-full relative cursor-pointer group/media overflow-hidden select-none touch-action-manipulation"
                              >
                                {isVid ? (
                                  <video
                                    src={`http://localhost:3000${path}`}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/media:scale-105 active:scale-105"
                                    muted
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={`http://localhost:3000${path}`}
                                    alt={`${selected.nombre} gallery ${idx}`}
                                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/media:scale-105 active:scale-105"
                                  />
                                )}
                                {/* Lupa Overlay inside Modal carousel */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover/media:opacity-100 group-active/media:opacity-100 transition-opacity duration-300 z-10">
                                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/20 group-hover/media:scale-110 transition-transform duration-300">
                                    <ZoomIn className="w-5 h-5 text-white" />
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-20">
                                {idx + 1} / {selected.contenido_media.length}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Content body */}
                <div className="p-8 sm:p-10 space-y-6">
                  {/* Title & Category */}
                  <div className="space-y-2">
                    {selected.categoria && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gold-accent">
                        {selected.categoria}
                      </span>
                    )}
                    <h3 className="text-3xl font-playfair font-bold text-green-deep leading-tight">
                      {selected.nombre}
                    </h3>
                    <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent my-3" />
                  </div>

                  {/* Description */}
                  {selected.descripcion_principal && (
                    <p className="text-sm sm:text-base text-green-deep/75 leading-relaxed font-inter whitespace-pre-line">
                      {selected.descripcion_principal}
                    </p>
                  )}

                  {/* Details Card Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-green-deep/10">
                    {/* Teléfono - Solo si existe */}
                    {selected.telefono && (
                      <div className="space-y-1">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-gold-warm">
                          Contacto Telefónico
                        </span>
                        <a
                          href={`tel:${selected.telefono.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 text-sm text-green-deep hover:text-gold-accent font-medium font-inter transition-colors font-semibold"
                        >
                          <Phone className="w-4 h-4 text-gold-accent" /> {selected.telefono}
                        </a>
                      </div>
                    )}

                    {/* Redes Sociales - Solo si existen */}
                    {selected.redes_sociales && parseRedes(selected.redes_sociales).length > 0 && (
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-gold-warm">
                          Redes del Destino
                        </span>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {parseRedes(selected.redes_sociales).map((link, idx) => {
                            let label = 'Ver red social';
                            if (link.includes('instagram.com')) label = 'Instagram';
                            else if (link.includes('facebook.com')) label = 'Facebook';
                            else if (link.includes('tiktok.com')) label = 'TikTok';
                            else if (link.includes('twitter.com') || link.includes('x.com')) label = 'Twitter';
                            else if (link.includes('youtube.com')) label = 'YouTube';

                            return (
                              <a
                                key={idx}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-green-deep hover:text-gold-accent font-medium font-inter transition-colors font-semibold"
                              >
                                <Globe className="w-4 h-4 text-gold-accent" /> {label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cómo llegar Button - Solo si existe link de Maps */}
                  {selected.maps && (
                    <div className="pt-6">
                      <a
                        href={selected.maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-deep text-beige-warm rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gold-accent hover:text-green-deep transition-all duration-300 shadow hover:shadow-lg text-center"
                      >
                        <MapPin className="w-4 h-4" /> Cómo llegar
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Fullscreen Lightbox Viewer ─── */}
      <AnimatePresence>
        {lightboxItem && (
          <FullscreenLightbox
            src={lightboxItem.src}
            type={lightboxItem.type}
            onClose={() => setLightboxItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecommendationsSection;
