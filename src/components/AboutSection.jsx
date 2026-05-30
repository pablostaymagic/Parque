import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MapPin } from 'lucide-react';

const contents = [
  {
    id: 'history',
    label: 'Historia',
    tag: 'NUESTRA HISTORIA',
    title: 'Nuestra Historia',
    text: 'Igle Parque nació como un lugar dedicado a la contemplación, la fe y la conexión espiritual con Dios en medio de la naturaleza de Anolaima.',
    secondaryText: 'Un santuario pensado para el descanso del alma, donde el silencio y la majestuosidad de la creación se unen para ofrecer una experiencia única de renovación interior.',
    image: '/about-img.png',
    icon: Heart
  },
  {
    id: 'mission',
    label: 'Misión',
    tag: 'PROPÓSITO ESPIRITUAL',
    title: 'Misión y Visión',
    text: 'Nuestra misión s ofrecer un espacio donde las familias, visitantes y comunidades puedan vivir una experiencia de fe, reflexión y conexión con Dios a través de estaciones bíblicas y entornos naturales.',
    secondaryText: 'Nuestra visión es consolidar a Igle Parque como un referente de turismo espiritual y bíblico en Cundinamarca, promoviendo valores, esperanza y transformation interior.',
    image: '/hero-bg.png',
    icon: Sparkles
  },
  {
    id: 'anolaima',
    label: 'Anolaima',
    tag: 'TURISMO CON PROPÓSITO',
    title: 'Anolaima e Igle Parque',
    text: 'Visitar Anolaima e Igle Parque es vivir una experiencia donde el encanto del pueblo, la naturaleza y la espiritualidad caminan de la mano.',
    secondaryText: 'El parque busca fortalecer el turismo local, invitando a los visitantes a descubrir no solo un espacio de fe, sino también la riqueza cultural, natural y humana de Anolaima.',
    image: '/about-img.png',
    icon: MapPin
  }
];

const StoryCard = ({ item, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 outline-none"
    >
      <div className={`relative p-0.5 rounded-full transition-all duration-500 ${active
          ? 'ring-2 ring-gold-accent ring-offset-2 ring-offset-beige-warm'
          : 'ring-1 ring-gold-accent/20 hover:ring-gold-accent/50'
        }`}>
        <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
          <img
            src={item.image}
            alt={item.label}
            className={`w-full h-full object-cover transition-transform duration-700 ${active ? 'scale-110' : 'group-hover:scale-110'
              }`}
          />
        </div>
        {active && (
          <motion.div
            layoutId="active-indicator"
            className="absolute inset-0 rounded-full border-2 border-gold-accent"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </div>
      <span className={`text-[9px] md:text-xs font-bold uppercase tracking-[0.2em] transition-colors ${active ? 'text-green-nature' : 'text-green-deep/40 group-hover:text-green-deep/70'
        }`}>
        {item.label}
      </span>
    </button>
  );
};

const AboutSection = () => {
  const [activeTab, setActiveTab] = useState(contents[0]);

  return (
    <section id="history" className="py-20 md:py-32 bg-green-forest overflow-visible relative pb-32 md:pb-40">
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

          {/* Image Side (Left on Desktop, Top on Mobile) */}
          <div className="w-full lg:w-1/2 relative order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-[320px] sm:h-[400px] md:h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-gold-accent/10 relative group"
              >
                <img
                  src={activeTab.image}
                  alt={activeTab.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-green-deep/5 mix-blend-overlay" />

                {/* Desktop Label Overlay */}
                <div className="absolute bottom-8 left-8 right-8 p-6 rounded-[1.5rem] bg-black/20 backdrop-blur-md border border-white/10 hidden md:block">
                  <div className="flex items-center gap-3 text-white mb-1">
                    <activeTab.icon className="w-4 h-4 text-gold-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">{activeTab.tag}</span>
                  </div>
                  <h4 className="text-xl font-playfair font-bold text-white leading-tight">{activeTab.title}</h4>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Small Spiritual Icon (Decorative) */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 w-16 h-16 md:w-20 md:h-20 bg-gold-accent flex items-center justify-center rounded-full shadow-2xl shadow-gold-accent/40 hidden md:flex z-10"
            >
              <Sparkles className="text-green-deep w-6 h-6 md:w-8 md:h-8" />
            </motion.div>
          </div>

          {/* Content Side (Right on Desktop, Bottom on Mobile) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 md:gap-10 order-2">

            {/* Story Cards Navigation */}
            <div className="flex items-center justify-center lg:justify-start gap-5 md:gap-10 overflow-visible py-2">
              {contents.map((item) => (
                <StoryCard
                  key={item.id}
                  item={item}
                  active={activeTab.id === item.id}
                  onClick={() => setActiveTab(item)}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6 md:space-y-8"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gold-warm">
                    <activeTab.icon className="w-4 h-4 fill-gold-warm" />
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">{activeTab.tag}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-playfair font-black text-white leading-tight">
                    {activeTab.title}
                  </h2>
                </div>

                <div className="space-y-5 md:space-y-6">
                  <p className="text-lg md:text-xl lg:text-3xl text-beige-warm/90 font-light leading-relaxed">
                    {activeTab.text}
                  </p>

                  <p className="text-base md:text-lg text-beige-warm/50 leading-relaxed font-inter italic">
                    {activeTab.secondaryText}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
