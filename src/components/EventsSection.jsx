import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Sparkles, X, ChevronRight,
  User, Phone, Globe, ZoomIn
} from 'lucide-react';

/* ─── Animation Variants ─── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

/* ─── Premium Fullscreen Viewer with Zoom & Pan ─── */
const FullscreenViewer = ({ src, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (scale === 1) {
      setScale(2);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const isVideo = src.match(/\.(mp4|mov)$/i);

  return (
    <motion.div
      className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-8 select-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* X Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[410] p-3 rounded-full bg-[#F6EED6]/90 text-green-deep border border-white/10 hover:bg-gold-accent hover:text-green-deep transition-all duration-300 shadow-lg"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {isVideo ? (
        <video
          src={src}
          className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl bg-black"
          controls
          autoPlay
          playsInline
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="relative max-w-[95vw] max-h-[88vh] flex items-center justify-center overflow-hidden">
          <motion.img
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            src={src}
            alt="Fullscreen media"
            style={{
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              cursor: scale === 1 ? 'zoom-in' : isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.25s ease-out'
            }}
            className="max-w-[95vw] max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      )}

      {/* Small floating tip only for images */}
      {!isVideo && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-widest text-[#F6EED6] px-5 py-2 rounded-full pointer-events-none uppercase">
          {scale === 1 ? 'Toca para ampliar · Arrastra' : 'Arrastra · Doble toque para reducir'}
        </div>
      )}
    </motion.div>
  );
};

const BTN_PRIMARY = 'bg-green-deep text-beige-warm rounded-full px-6 py-3 font-inter font-semibold shadow-sm hover:bg-gold-accent hover:text-green-deep transition-all duration-300 flex items-center justify-center active:scale-95';
const CARD_INPUT = 'w-full px-4 py-3 pl-10 rounded-xl bg-white/50 border border-green-deep/10 focus:border-gold-accent/60 outline-none text-green-deep text-sm transition-all font-inter placeholder-green-deep/40 caret-green-deep focus:bg-white/90 focus:shadow-sm';

/* ═══════════════════════════════════════════
   RESERVATION MODAL
   ═══════════════════════════════════════════ */
const ReservationModal = ({ event, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '', whatsapp: '', edad: '', genero: '', fecha: '', nacionalidad: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!event || !event.id) {
      alert("No se pudo identificar el evento asociado a la reserva.");
      return;
    }

    if (!formData.nombre || !formData.whatsapp || !formData.edad || !formData.genero || !formData.fecha) {
      alert("Faltan campos obligatorios para completar la reserva.");
      return;
    }

    const payload = {
      evento_id: event.id,
      nombre: formData.nombre,
      telefono: formData.whatsapp,
      genero: formData.genero,
      edad: Number(formData.edad),
      nacionalidad: formData.nacionalidad || null,
      fecha_visita: formData.fecha
    };

    console.log('Enviando reserva al backend:', payload);

    try {
      const response = await fetch('http://localhost:3000/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respuesta backend reserva:', result);

      if (result && result.success && result.reserva && result.reserva.id) {
        alert('¡Reserva confirmada con éxito! Nos pondremos en contacto contigo pronto.');
        onClose();
      } else {
        alert('Error al confirmar la reserva: El servidor no retornó un ID válido.');
      }
    } catch (error) {
      console.error('Error enviando reserva:', error);
      alert('Hubo un error al procesar tu reserva. Inténtalo de nuevo más tarde.');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
    >
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-[#F6EED6] rounded-3xl shadow-2xl overflow-hidden border border-green-deep/10"
        variants={popupVariants}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-green-deep/10 bg-white/40">
          <div>
            <h3 className="font-playfair font-bold text-2xl text-green-deep">Reservar Asistencia</h3>
            <p className="font-inter text-sm text-green-deep/70 mt-0.5">{event.title}</p>
          </div>
          <button onClick={onClose}
            className="bg-[#F6EED6]/80 border border-green-deep/10 text-green-deep/70 hover:bg-gold-accent/15 hover:text-green-deep p-2 rounded-full transition-all duration-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input required type="text" name="nombre" placeholder="Nombre completo"
                value={formData.nombre} onChange={handleInputChange} className={CARD_INPUT} />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input required type="tel" name="whatsapp" placeholder="WhatsApp"
                value={formData.whatsapp} onChange={handleInputChange} className={CARD_INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" name="edad" placeholder="Edad" value={formData.edad}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-green-deep/10 focus:border-gold-accent/60 outline-none text-green-deep text-sm font-inter placeholder-green-deep/40" />
              <select required name="genero" value={formData.genero} onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-green-deep/10 focus:border-gold-accent/60 outline-none text-green-deep text-sm font-inter appearance-none">
                <option value="" disabled className="text-green-deep/40">Género</option>
                <option value="masculino" className="text-green-deep">Masculino</option>
                <option value="femenino" className="text-green-deep">Femenino</option>
                <option value="otro" className="text-green-deep">Otro</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input required type="date" name="fecha" value={formData.fecha}
                onChange={handleInputChange} className={CARD_INPUT} />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input type="text" name="nacionalidad" placeholder="Nacionalidad (Opcional)"
                value={formData.nacionalidad} onChange={handleInputChange} className={CARD_INPUT} />
            </div>
          </div>
          <div className="pt-2">
            <button type="submit" className={`${BTN_PRIMARY} w-full`}>Confirmar Reserva</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   EVENT POPUP
   ═══════════════════════════════════════════ */
const EventPopup = ({ event, onClose, onReserve, onImageClick, timeLeft }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!event) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
        variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
      >
        <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl bg-[#F6EED6] shadow-2xl border border-green-deep/10 flex flex-col md:flex-row min-h-[500px] max-h-[90vh] overflow-y-auto"
          variants={popupVariants}
        >
          <button onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-[#F6EED6]/90 backdrop-blur-sm border border-green-deep/10 text-green-deep hover:bg-gold-accent/20 hover:scale-105 transition-all duration-300 shadow-md">
            <X className="w-5 h-5" />
          </button>

          {/* Flyer */}
          <div className="w-full md:w-[380px] lg:w-[420px] bg-green-deep/10 border-b md:border-b-0 md:border-r border-green-deep/10 relative overflow-hidden shrink-0 h-64 md:h-auto">
            {event.flyer?.src ? (
              <>
                <img src={event.flyer.src} alt={event.title}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                  onClick={() => onImageClick(event.flyer)} />
                <button
                  onClick={() => onImageClick(event.flyer)}
                  className="absolute top-4 right-4 bg-[#F6EED6]/85 border border-green-deep/10 text-green-deep rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-sm hover:bg-gold-accent/20 transition-all z-20 flex items-center gap-1"
                >
                  <ZoomIn className="w-3 h-3 text-green-deep" /> Ampliar
                </button>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-green-deep/30 font-inter text-sm">Sin flyer</div>
            )}
            <div className="absolute bottom-4 left-4 z-20 px-3 py-1 bg-gold-accent/10 border border-gold-accent/20 backdrop-blur-sm text-gold-accent rounded-full text-xs font-inter font-bold tracking-wide shadow-sm">
              Evento Activo
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col overflow-y-auto bg-transparent">
            <div className="space-y-6 flex-1 text-green-deep">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-gold-accent" />
                  <span className="font-inter text-xs font-bold text-gold-accent uppercase tracking-[0.35em]">Experiencia Exclusiva</span>
                </div>
                <h3 className="font-playfair font-bold text-3xl md:text-4xl text-green-deep leading-tight mb-3 group-hover:text-gold-accent transition-colors duration-300">{event.title}</h3>
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent my-3" />
                <p className="font-inter text-base text-green-deep/70 leading-relaxed">{event.shortDescription}</p>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Inicia', icon: Calendar, date: event.date, time: event.time },
                  { label: 'Finaliza', icon: Clock, date: event.endDate, time: event.endTime },
                ].map(({ label, icon: Icon, date, time }) => (
                  <div key={label} className="bg-white/40 p-4 rounded-2xl border border-green-deep/10 flex items-start gap-3 shadow-sm">
                    <div className="p-2 rounded-lg bg-gold-accent/10 border border-gold-accent/20 text-gold-accent shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-inter text-[9px] font-bold text-gold-accent uppercase tracking-widest mb-0.5">{label}</p>
                      <p className="font-inter text-sm font-bold text-green-deep">{date}</p>
                      <p className="font-inter text-xs text-green-deep/60">{time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Countdown */}
              <div>
                <p className="font-inter text-[10px] font-bold text-gold-accent uppercase tracking-[0.2em] mb-3">Finaliza en:</p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {['días', 'horas', 'min', 'seg'].map((unit, i) => (
                    <div key={unit} className="flex flex-col items-center gap-1 shrink-0">
                      <div className="w-14 h-14 bg-white/40 text-green-deep rounded-2xl flex items-center justify-center font-inter text-xl font-bold border border-green-deep/10 shadow-sm">
                        {timeLeft ? Object.values(timeLeft)[i] : '00'}
                      </div>
                      <span className="font-inter text-[9px] font-bold text-gold-accent uppercase tracking-wider">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 mt-auto">
              <button onClick={() => onReserve(event)} className={`${BTN_PRIMARY} w-full py-4 text-xs uppercase tracking-widest`}>Reservar Ahora</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════
   EVENT CARD
   ═══════════════════════════════════════════ */
const EventCard = ({ event, index, onReserve, onImageClick, timeLeft }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }} transition={{ delay: index * 0.1 }}
    className="bg-white/40 backdrop-blur-sm rounded-3xl border border-green-deep/10 overflow-hidden flex flex-col md:flex-row group hover:shadow-xl transition duration-300 max-w-4xl mx-auto w-full"
  >
    {/* Flyer — Left layout on desktop */}
    <div className="w-full md:w-[360px] lg:w-[420px] bg-green-deep/10 relative overflow-hidden shrink-0 h-64 sm:h-72 md:h-auto rounded-t-3xl md:rounded-t-none md:rounded-l-3xl">
      {event.flyer?.src ? (
        <>
          <img
            src={event.flyer.src} alt={event.title}
            className="w-full h-full object-cover transition-transform duration-750 group-hover:scale-105 cursor-pointer"
            onClick={() => onImageClick(event.flyer)}
          />
          <button
            onClick={() => onImageClick(event.flyer)}
            className="absolute top-4 right-4 bg-[#F6EED6]/85 border border-green-deep/10 text-green-deep rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest shadow-sm hover:bg-gold-accent/20 transition-all z-20 flex items-center gap-1"
          >
            <ZoomIn className="w-3 h-3 text-green-deep" /> Ampliar
          </button>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-green-deep/30 font-inter text-sm">
          Sin flyer
        </div>
      )}
      {/* Badge */}
      <div className="absolute top-3 left-3 px-3 py-1 bg-gold-accent/10 border border-gold-accent/20 backdrop-blur-sm text-gold-accent rounded-full text-xs font-inter font-bold tracking-wide shadow-sm">
        Destacado
      </div>
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-deep/30 to-transparent" />
    </div>

    {/* Content */}
    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-transparent text-green-deep">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-gold-accent" />
          <span className="font-inter text-xs font-bold text-gold-accent uppercase tracking-[0.35em]">Evento Activo</span>
        </div>

        <h3 className="font-playfair font-bold text-2xl md:text-3xl text-green-deep mb-2 leading-tight group-hover:text-gold-accent transition-colors duration-300">
          {event.title}
        </h3>
        <p className="font-inter text-sm text-green-deep/70 leading-relaxed line-clamp-3 mb-5">
          {event.shortDescription}
        </p>

        {/* Schedule */}
        <div className="grid grid-cols-2 gap-3 py-4 border-y border-green-deep/10 mb-5">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-gold-accent/10 border border-gold-accent/20 text-gold-accent shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-inter text-[9px] font-bold text-gold-accent uppercase tracking-widest mb-0.5">Inicia</p>
              <p className="font-inter text-xs font-bold text-green-deep">{event.date}</p>
              <p className="font-inter text-[10px] text-green-deep/60">{event.time}</p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-gold-accent/10 border border-gold-accent/20 text-gold-accent shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-inter text-[9px] font-bold text-gold-accent uppercase tracking-widest mb-0.5">Finaliza</p>
              <p className="font-inter text-xs font-bold text-green-deep">{event.endDate}</p>
              <p className="font-inter text-[10px] text-green-deep/60">{event.endTime}</p>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="space-y-2">
          <p className="font-inter text-[10px] font-bold text-gold-accent uppercase tracking-[0.2em] mb-1">Finaliza en:</p>
          <div className="flex items-center gap-2 flex-wrap">
            {['días', 'horas', 'min', 'seg'].map((unit, i) => (
              <div key={unit} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 bg-white/40 text-green-deep rounded-xl flex items-center justify-center font-inter text-sm font-bold border border-green-deep/10 shadow-sm">
                  {timeLeft ? Object.values(timeLeft)[i] : '00'}
                </div>
                <span className="font-inter text-[9px] font-bold text-gold-accent uppercase tracking-wider">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-5 mt-4">
        <button
          onClick={() => onReserve(event)}
          className="w-full bg-green-deep text-beige-warm rounded-full px-6 py-3.5 font-inter font-semibold shadow-md hover:bg-gold-accent hover:text-green-deep transition-all duration-300 active:scale-95 text-xs uppercase tracking-widest text-center"
        >
          Reservar Ahora
        </button>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════ */
const EventsSection = () => {
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [reservationEvent, setReservationEvent] = useState(null);
  const [mappedEvent, setMappedEvent] = useState(null);
  const [fullImageUrl, setFullImageUrl] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  const loadActiveEvent = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/eventos');
      if (!response.ok) { setMappedEvent(null); setIsExpired(true); return; }
      const result = await response.json();
      if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        const active = result.data[0];
        const endDateStr = active.fecha_fin ? active.fecha_fin.split('T')[0] : '';
        const endTimeStr = active.hora_fin || '00:00';
        if (endDateStr) {
          const targetDate = new Date(`${endDateStr}T${endTimeStr}`).getTime();
          if (new Date().getTime() >= targetDate) { setMappedEvent(null); setIsExpired(true); return; }
        }
        setIsExpired(false);
        setMappedEvent({
          id: active.id, title: active.titulo,
          date: active.fecha_inicio ? active.fecha_inicio.split('T')[0] : '',
          time: active.hora_inicio ? active.hora_inicio.substring(0, 5) : '',
          endDate: endDateStr, endTime: endTimeStr.substring(0, 5),
          flyer: { src: active.flyer_url ? `http://localhost:3000/${active.flyer_url}` : null },
          shortDescription: active.descripcion, featured: true,
        });
      } else { setMappedEvent(null); setIsExpired(true); }
    } catch (error) {
      console.error('Error fetching events:', error);
      setMappedEvent(null); setIsExpired(true);
    }
  }, []);

  useEffect(() => {
    loadActiveEvent();
    const handleUpdate = () => loadActiveEvent();
    window.addEventListener('eventoActivoActualizado', handleUpdate);
    const syncInterval = setInterval(() => loadActiveEvent(), 10000);
    return () => {
      window.removeEventListener('eventoActivoActualizado', handleUpdate);
      clearInterval(syncInterval);
    };
  }, [loadActiveEvent]);

  useEffect(() => {
    if (!mappedEvent?.endDate || !mappedEvent?.endTime) return;
    const targetDate = new Date(`${mappedEvent.endDate}T${mappedEvent.endTime}`).getTime();
    const interval = setInterval(() => {
      const distance = targetDate - new Date().getTime();
      if (distance <= 0) {
        clearInterval(interval); setIsExpired(true); setMostrarPopup(false);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [mappedEvent]);

  useEffect(() => {
    const yaMostrado = sessionStorage.getItem('evento_mostrado');
    if (mappedEvent && !isExpired && !yaMostrado) {
      const timer = setTimeout(() => {
        setMostrarPopup(true);
        sessionStorage.setItem('evento_mostrado', 'true');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [mappedEvent, isExpired]);

  const handleOpenReservation = (event) => {
    setMostrarPopup(false);
    setReservationEvent(event);
  };

  return (
    <section id="events" className="py-20 bg-[#F6EED6] relative overflow-hidden">
      {/* Decorative subtle light accents */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gold-accent/10 rounded-full blur-3xl opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold-accent">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-gold-accent">Próximos Encuentros</span>
          </div>
          <h2 className="font-playfair font-bold text-4xl md:text-5xl tracking-tight text-green-deep leading-tight">
            Eventos del Parque
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-gold-accent/40 to-transparent mx-auto my-3" />
          <p className="font-inter text-base md:text-lg text-green-deep/70 leading-relaxed">
            Experiencias únicas que renuevan tu fe y te conectan con la paz de la creación.
          </p>
        </div>

        {/* ── Featured Event or Empty State ── */}
        <AnimatePresence mode="wait">
          {mappedEvent && !isExpired ? (
            <motion.div
              key="event"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
            >
              <EventCard
                event={mappedEvent} index={0}
                onReserve={handleOpenReservation}
                onImageClick={setFullImageUrl}
                timeLeft={timeLeft}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/40 backdrop-blur-sm rounded-2xl border border-green-deep/10"
            >
              <Sparkles className="w-8 h-8 text-gold-accent/40 mx-auto mb-4" />
              <p className="font-inter text-base font-medium text-green-deep/70">
                No hay eventos activos programados en este momento.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Event Detail Popup ── */}
      <AnimatePresence>
        {mostrarPopup && mappedEvent && !isExpired && (
          <EventPopup
            event={mappedEvent}
            onClose={() => setMostrarPopup(false)}
            onReserve={handleOpenReservation}
            onImageClick={setFullImageUrl}
            timeLeft={timeLeft}
          />
        )}
      </AnimatePresence>

      {/* ── Full-screen Image Viewer ── */}
      <AnimatePresence>
        {fullImageUrl && (
          <FullscreenViewer src={fullImageUrl.src} onClose={() => setFullImageUrl(null)} />
        )}
      </AnimatePresence>

      {/* ── Reservation Modal ── */}
      <AnimatePresence>
        {reservationEvent && (
          <ReservationModal event={reservationEvent} onClose={() => setReservationEvent(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
