import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Leaf, 
  Plus, 
  Users, 
  ArrowRight,
  ClipboardList,
} from 'lucide-react';

const LogisticsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fecha_visita: new Date().toLocaleDateString(),
    nombre: '',
    edad: '',
    genero: '',
    nacionalidad: '',
    tipo_ingreso: '',
  });
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('logistics_token');
    if (!token) {
      navigate('/logistica');
    }

    let isEventValid = false;
    let eventTitle = '';
    
    try {
      const saved = localStorage.getItem('evento_activo');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fechaFin && parsed.horaFin) {
          const targetDate = new Date(`${parsed.fechaFin}T${parsed.horaFin}`).getTime();
          if (new Date().getTime() < targetDate) {
            isEventValid = true;
            eventTitle = parsed.titulo;
            setActiveEvent({ title: parsed.titulo, isActive: true });
          }
        }
      }
    } catch (e) {
      console.error('Error parsing event data');
    }

    if (isEventValid) {
      setFormData(prev => ({ ...prev, tipo_ingreso: eventTitle }));
    } else {
      setFormData(prev => ({ ...prev, tipo_ingreso: 'Visita general' }));
      setActiveEvent(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('logistics_token');
    navigate('/logistica');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Confirma tus datos antes de enviar')) {
      const newVisitor = {
        id: Date.now(),
        ...formData,
        source: 'logistica',
        createdAt: new Date().toISOString(),
      };

      const existingLogistics = JSON.parse(localStorage.getItem('eagle_logistics') || '[]');
      localStorage.setItem('eagle_logistics', JSON.stringify([newVisitor, ...existingLogistics]));

      // Reset form (keep tipo_ingreso and fecha_visita)
      setFormData({
        ...formData,
        fecha_visita: new Date().toLocaleDateString(),
        nombre: '',
        edad: '',
        genero: '',
        nacionalidad: '',
      });
      alert('Registro de ingreso exitoso.');
    }
  };

  return (
    <div className="min-h-screen bg-beige-warm flex flex-col font-inter">
      {/* Header */}
      <header className="bg-green-deep text-white p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Leaf className="w-24 h-24 text-gold-accent" />
        </div>
        
        <div className="max-w-xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-accent/20 rounded-xl">
              <Leaf className="w-6 h-6 text-gold-accent" />
            </div>
            <div>
              <h1 className="text-xl font-playfair font-bold">Registro de Ingreso</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Igle Parque Logística</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-full bg-white/10 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-gold-accent/10 p-10 space-y-10"
        >
          <div className="flex items-center gap-4 border-b border-gold-accent/10 pb-8">
            <div className="p-3 bg-beige-warm rounded-2xl">
              <ClipboardList className="w-6 h-6 text-gold-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-playfair font-bold text-green-deep">Nuevo Visitante</h2>
              <p className="text-xs text-green-deep/40 font-bold uppercase tracking-widest">Complete los datos de ingreso</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Fecha (Read-only) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Fecha</label>
                <input 
                  type="text"
                  value={formData.fecha_visita}
                  readOnly
                  className="w-full px-6 py-4 rounded-2xl bg-beige-warm/50 border border-gold-accent/10 text-green-deep/60 text-sm cursor-not-allowed outline-none font-medium shadow-inner"
                />
              </div>

              {/* Tipo de Ingreso */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Tipo de Ingreso</label>
                <select 
                  value={formData.tipo_ingreso}
                  onChange={(e) => setFormData({...formData, tipo_ingreso: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gold-accent/20 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none text-green-deep text-sm transition-all cursor-pointer font-medium hover:border-gold-accent/40 shadow-sm"
                >
                  <option value="Visita general">Visita general</option>
                  {activeEvent && activeEvent.isActive && (
                    <option value={activeEvent.title}>{activeEvent.title}</option>
                  )}
                </select>
              </div>
            </div>

            {/* Nombre */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Nombre Completo</label>
              <input 
                required
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Nombre del visitante"
                className="w-full px-6 py-4 rounded-2xl bg-white border border-gold-accent/20 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none text-green-deep text-sm transition-all hover:border-gold-accent/40 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Edad */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Edad</label>
                <input 
                  required
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                  placeholder="Ej: 28"
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gold-accent/20 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none text-green-deep text-sm transition-all hover:border-gold-accent/40 shadow-sm"
                />
              </div>

              {/* Género */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Género</label>
                <select 
                  required
                  value={formData.genero}
                  onChange={(e) => setFormData({...formData, genero: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-gold-accent/20 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none text-green-deep text-sm transition-all cursor-pointer hover:border-gold-accent/40 shadow-sm"
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Nacionalidad */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-green-deep/50 uppercase tracking-widest ml-1">Nacionalidad (Opcional)</label>
              <input 
                type="text"
                value={formData.nacionalidad}
                onChange={(e) => setFormData({...formData, nacionalidad: e.target.value})}
                placeholder="Ej: Colombia"
                className="w-full px-6 py-4 rounded-2xl bg-white border border-gold-accent/20 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/20 outline-none text-green-deep text-sm transition-all hover:border-gold-accent/40 shadow-sm"
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                className="w-full py-5 rounded-2xl bg-green-nature text-white font-bold text-sm uppercase tracking-widest hover:bg-green-deep transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-nature/20 group"
              >
                Registrar Ingreso Real
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-[10px] text-green-deep/20 uppercase tracking-widest font-bold">
              Fecha de Registro: {formData.fecha_visita}
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer info for logistics staff */}
      <footer className="p-8 text-center">
        <p className="text-[10px] text-green-deep/40 uppercase tracking-[0.3em] font-bold">
          Igle Parque • Sistema de Control de Acceso
        </p>
      </footer>
    </div>
  );
};

export default LogisticsForm;
