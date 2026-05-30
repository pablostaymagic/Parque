import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Sparkles,
  Clock,
  Play,
  MapPin,
  Navigation,
  Calendar,
  Heart,
  Video,
  Info
} from 'lucide-react';

const stories = [
  {
    id: 'schedule',
    label: 'Horario',
    title: 'Horario de atención',
    icon: Clock,
    image: '/about-img.png',
    type: 'text'
  },
  {
    id: 'pastor',
    label: 'Invitación',
    title: 'Invitación del Pastor',
    icon: Play,
    image: '/hero-bg.png',
    type: 'video'
  },
  {
    id: 'route',
    label: 'Cómo llegar',
    title: 'Cómo llegar a Igle Parque',
    icon: MapPin,
    image: '/about-img.png',
    type: 'map',
    href: "https://maps.google.com/?q=Anolaima,Cundinamarca,Colombia"
  }
];

const getColombiaStatus = () => {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Bogota',
      weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const day = parts.find(p => p.type === 'weekday').value;
    const hour = parseInt(parts.find(p => p.type === 'hour').value);

    const dayMap = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes',
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };

    const dayName = dayMap[day] || day;

    if (day === 'Saturday' || day === 'Sunday') {
      if (hour >= 10 && hour < 17) {
        return { label: 'Abierto ahora', color: 'bg-green-nature', dayName };
      }
      return { label: 'Cerrado por horario', color: 'bg-red-500/80', dayName };
    } else if (day === 'Wednesday') {
      return { label: 'Cerrado hoy', color: 'bg-red-600', dayName };
    } else {
      return { label: 'Solo con cita previa', color: 'bg-gold-accent', dayName };
    }
  } catch (e) {
    return { label: 'Consulta disponibilidad', color: 'bg-gold-accent', dayName: 'Hoy' };
  }
};

const StoryBubble = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-2 outline-none transition-transform hover:scale-105 active:scale-95 shrink-0"
    >
      <div className={`relative p-0.5 rounded-full transition-all duration-500 ${active
          ? 'ring-2 ring-gold-accent ring-offset-2 ring-offset-black/20'
          : 'ring-1 ring-white/20 hover:ring-white/50'
        }`}>
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center relative">
          <img
            src={item.image}
            alt={item.label}
            className={`absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-700 ${active ? 'scale-110 opacity-60' : 'group-hover:scale-110 group-hover:opacity-60'
              }`}
          />
          <Icon className={`w-5 h-5 md:w-5 md:h-5 relative z-10 transition-colors ${active ? 'text-gold-accent' : 'text-white/70'}`} />
        </div>
      </div>
      <span className={`text-[9px] md:text-[9px] font-bold uppercase tracking-[0.2em] transition-colors ${active ? 'text-gold-accent' : 'text-white/40'
        }`}>
        {item.label}
      </span>
    </button>
  );
};

const StoryDetailCard = ({ activeStory }) => {
  const story = stories[activeStory];
  const [colStatus, setColStatus] = useState(getColombiaStatus());

  useEffect(() => {
    const timer = setInterval(() => setColStatus(getColombiaStatus()), 60000);
    return () => clearInterval(timer);
  }, []);

  const renderContent = () => {
    switch (story.type) {
      case 'text':
        return (
          <div className="space-y-3.5 text-white/90">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 text-gold-accent font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>🌿✨ Bienvenido(a)</span>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white ${colStatus.color} shadow-lg backdrop-blur-md border border-white/10`}>
                {colStatus.label}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-medium bg-white/5 w-fit px-2.5 py-0.5 rounded-lg">
              <Clock className="w-3 h-3" />
              <span>Hoy es {colStatus.dayName}</span>
            </div>

            <p className="text-xs font-light leading-relaxed italic opacity-80">
              Disfruta una experiencia espiritual, natural y familiar en Anolaima, Cundinamarca.
            </p>

            <div className="grid grid-cols-1 gap-2.5 py-1">
              <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Calendar className="w-3.5 h-3.5 text-gold-accent mt-0.5" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Sábados y Domingos</p>
                  <p className="text-xs font-bold">10:00 a.m. – 5:00 p.m.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <Info className="w-3.5 h-3.5 text-gold-accent mt-0.5" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-0.5">Lunes, Martes, Jueves y Viernes</p>
                  <p className="text-xs font-bold">Solo con cita previa</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-red-500/10 p-2.5 rounded-xl border border-red-500/10">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 animate-pulse" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-red-500/60 mb-0.5 font-bold font-inter">Miércoles Cerrado</p>
                  <p className="text-[10px] italic opacity-70">Embellecimiento y cuidado del parque.</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gold-accent/80 font-medium text-center pt-1 italic">
              Te esperamos para vivir un recorrido lleno de fe, paz y naturaleza.
            </p>
          </div>
        );
      case 'video':
        return (
          <div className="space-y-3.5">
            <div className="aspect-video rounded-xl bg-black/40 border border-white/10 relative group overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop"
                alt="Pastor Placeholder"
                className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-700"
              />
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gold-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                  <Play className="w-5 h-5 text-green-deep fill-green-deep" />
                </div>
                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Video próximamente</span>
              </div>
            </div>
            <p className="text-xs text-white/70 font-light leading-relaxed italic text-center px-2">
              "Recibe una invitación especial para conocer Igle Parque, un lugar creado para acercarte a Dios, compartir en familia y disfrutar la naturaleza de Anolaima."
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-gold-accent hover:text-green-deep text-white rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <Video className="w-3.5 h-3.5" />
              Ver invitación
            </button>
          </div>
        );
      case 'map':
        return (
          <div className="space-y-3.5">
            <a
              href={story.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block aspect-[16/9] rounded-xl bg-black/40 border border-white/10 relative group overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1170&auto=format&fit=crop"
                alt="Map Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-deep/90 via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <div className="p-2 bg-gold-accent rounded-full text-green-deep shadow-2xl group-hover:rotate-12 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-bold text-white uppercase tracking-[0.2em] bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  CLICK PARA LLEGAR AQUÍ
                </span>
              </div>
            </a>
            <div className="flex items-start gap-2.5 px-2">
              <MapPin className="w-3.5 h-3.5 text-gold-accent mt-0.5 shrink-0" />
              <p className="text-xs text-white/70 font-medium leading-tight">
                Ruta hacia Igle Parque en Anolaima, Cundinamarca.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
        <div className="w-7 h-7 rounded-lg bg-gold-accent/20 flex items-center justify-center">
          <story.icon className="w-3.5 h-3.5 text-gold-accent" />
        </div>
        <h3 className="text-lg font-playfair font-bold text-white">{story.title}</h3>
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

const Hero = () => {
  const [activeStory, setActiveStory] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const whatsappUrl = "https://wa.me/573145504897?text=Hola,%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Igle%20Parque.";

  return (
    <section className="relative min-h-[100svh] lg:min-h-screen w-full flex flex-col justify-center overflow-visible pb-20 lg:pb-0">

      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black/80 via-black/40 lg:from-green-deep/95 lg:via-green-deep/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/10 z-10" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pt-24 lg:pt-0">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">

          {/* Left Side: Text & Buttons */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:gap-10 lg:flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-3 lg:space-y-6"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-bold text-white leading-tight">
                Igle Parque
              </h1>
              <h2 className="text-xl md:text-3xl font-playfair text-gold-warm italic max-w-[300px] md:max-w-none mx-auto lg:mx-0">
                Vive una experiencia espiritual en medio de la naturaleza
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-base md:text-lg lg:text-xl text-beige-warm/80 font-inter leading-relaxed max-w-[320px] md:max-w-xl font-light"
            >
              Conecta con Dios, la naturaleza y momentos de paz en Anolaima.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 bg-gold-warm text-white rounded-full font-bold transition-all shadow-xl shadow-gold-warm/20 hover:bg-white hover:text-green-forest text-sm uppercase tracking-widest"
              >
                Reservar visita
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            {/* Story Bubbles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-5 md:gap-7 pt-2"
            >
              {stories.map((item, index) => (
                <StoryBubble
                  key={item.id}
                  item={item}
                  active={index === activeStory}
                  onClick={() => setActiveStory(index)}
                />
              ))}
            </motion.div>
          </div>

          {/* Right Side: Detail Card */}
          <div className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] mx-auto lg:mx-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-2xl border border-white/15 rounded-[2rem] p-5 md:p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] relative overflow-visible"
              >
                {/* Glow effect */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-accent/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-nature/10 blur-[80px] rounded-full pointer-events-none" />

                <StoryDetailCard activeStory={activeStory} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Decorative Bottom Bar (Desktop) */}
      <div className="absolute bottom-12 left-6 right-6 z-20 hidden lg:flex items-center gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-gold-accent/50 to-transparent" />
        <div className="flex flex-col gap-1 text-[10px] font-bold text-gold-accent/40 uppercase tracking-[0.4em]">
          <span>Paz</span>
          <span>Fe</span>
          <span>Vida</span>
        </div>
      </div>

    </section>
  );
};

export default Hero;
