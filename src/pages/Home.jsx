import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import AttractionsSection from '../components/AttractionsSection';
import RecommendationsSection from '../components/RecommendationsSection';
import Footer from '../components/Footer';
import EventsSection from '../components/EventsSection';
import SeccionesFlotantes from '../components/SeccionesFlotantes';

const Home = () => {
  const [agendaEvents, setAgendaEvents] = useState([]);

  // Mock data to use when the API is unavailable
  const mockEvents = [
    {
      id: 1,
      nombre: 'Festival Cultural',
      descripcion: 'Evento cultural y artístico en la ciudad.',
      data: '2026-06-01T18:00:00Z',
      flyer: '/images/flyer1.png',
      publicado_home: true,
      is_active: true,
    },
    {
      id: 2,
      nombre: 'Concierto de Verano',
      descripcion: 'Concierto al aire libre con artistas locales.',
      data: '2026-06-10T20:00:00Z',
      flyer: '/images/flyer2.png',
      publicado_home: true,
      is_active: true,
    },
  ];

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/eventos`);
        if (!res.ok) throw new Error('API no disponible');
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          const formatted = json.data.map((e) => ({
            id: e.id,
            nombre: e.nombre || e.titulo || 'Evento',
            descripcion: e.descripcion || e.shortDescription || '',
            data: e.fecha_inicio || e.data,
            flyer: e.flyer_url ? `${API_BASE}/${e.flyer_url}` : null,
            publicado_home: e.publicado_home,
            is_active: e.is_active,
          }));
          setAgendaEvents(formatted);
        } else {
          setAgendaEvents(mockEvents);
        }
      } catch (err) {
        console.error('Error loading events, usando datos mock:', err);
        setAgendaEvents(mockEvents);
      }
    };
    fetchEvents();
  }, []);

  const eventosPublicados = agendaEvents.filter(e => e.publicado_home !== false && e.is_active !== false);

  return (
    <div className="min-h-screen bg-beige-warm relative">
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <AttractionsSection />
        {eventosPublicados.length > 0 && (
          <EventsSection />
        )}
        <RecommendationsSection />
      </main>
      <Footer />
      <SeccionesFlotantes />
    </div>
  );
};

export default Home;

