import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Save, Trash2, CheckCircle, AlertCircle, Info, Database, Sparkles, Wand2, Brain, ScrollText } from 'lucide-react';

const STORAGE_KEY = 'chatbot_public_content';

const VirtualAssistantAdmin = () => {
  const [content, setContent] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Note: In production, this should fetch from a real backend/database
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    setContent(saved);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, content);
    showToast('Conocimiento infundido correctamente.', 'success');
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas desvanecer todo el conocimiento actual?')) {
      setContent('');
      localStorage.setItem(STORAGE_KEY, '');
      showToast('Memoria despejada.', 'success');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-20 lg:space-y-32 pb-32 px-4"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gold-warm uppercase tracking-[0.4em] italic">Omnisciencia Digital</p>
          <h3 className="text-4xl lg:text-5xl font-playfair font-black text-green-forest leading-none tracking-tight">Asistente</h3>
          <p className="text-green-forest/60 text-sm max-w-xl font-medium leading-relaxed italic">
            Configura el núcleo de sabiduría de tu guía espiritual. Aquí se gestan las palabras que orientarán a los viajeros.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gold-warm/5 rounded-xl border border-gold-warm/10 shadow-sm">
            <Database className="w-3 h-3 text-gold-warm/80" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-forest/60">Almacén: Local Storage</span>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-3 px-8 py-4 bg-gold-warm text-white rounded-xl font-bold text-xs tracking-[0.2em] uppercase hover:bg-green-forest transition-all shadow-sm active:scale-95 group"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" /> Guardar Cambios
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row items-center gap-6 p-6 lg:p-8 bg-beige-linen rounded-3xl border border-gold-warm/10 shadow-sm relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gold-warm/[0.03] to-transparent pointer-events-none" />
        <div className="p-4 bg-gold-warm/10 rounded-2xl border border-gold-warm/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-sm">
          <Brain className="w-8 h-8 text-gold-warm" />
        </div>
        <div className="space-y-2 text-center md:text-left relative z-10">
          <p className="text-xl font-playfair font-black text-green-forest tracking-tight">Arquitectura del Pensamiento</p>
          <p className="text-sm text-green-forest/60 leading-relaxed italic font-medium max-w-3xl">
            Proporciona relatos sobre la historia, misión, estaciones sagradas, hospedajes y secretos de Anolaima. 
            El oráculo destilará esta información para ofrecer respuestas impregnadas de la esencia del parque.
          </p>
        </div>
      </motion.div>

      {/* Editor Section */}
      <div className="bg-beige-cream/80 backdrop-blur-md rounded-3xl shadow-sm border border-gold-warm/10 overflow-hidden flex flex-col relative group transition-all duration-500 hover:border-gold-warm/30">
        
        <div className="p-6 lg:p-8 border-b border-gold-warm/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gold-warm/10 rounded-xl border border-gold-warm/20 group-hover:border-gold-warm/40 transition-colors">
              <ScrollText className="w-5 h-5 text-gold-warm" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-green-forest/40 uppercase tracking-[0.2em]">Pergamino de Datos</span>
              <h4 className="text-xl font-playfair font-black text-green-forest leading-none tracking-tight">Base de Conocimiento</h4>
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              onClick={handleClear}
              className="flex-1 sm:flex-none p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95 shadow-sm"
              title="Borrar memoria"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gold-warm text-white hover:bg-green-forest rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all border border-gold-warm/10 active:scale-95 shadow-sm"
            >
              <Save className="w-4 h-4" /> Guardar
            </button>
          </div>
        </div>
        
        <div className="p-6 lg:p-8 relative z-10">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe o pega aquí toda la información pública sobre Igle Parque..."
            className="w-full min-h-[400px] p-6 lg:p-8 rounded-2xl bg-white/50 border border-gold-warm/10 focus:border-gold-warm/40 outline-none text-green-forest text-sm font-medium leading-relaxed transition-all resize-none shadow-inner placeholder:text-green-forest/20 italic custom-scrollbar"
          />
        </div>
      </div>

      <div className="px-6 py-4 bg-red-900/10 rounded-2xl border border-red-500/10 backdrop-blur-md">
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-[0.2em] text-center italic">
          Nota: Esta información se almacena localmente para pruebas. En manifestación final, debe conectarse a una base de datos.
        </p>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[300]"
          >
            <div className={`flex items-center gap-5 px-10 py-5 rounded-full shadow-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] backdrop-blur-2xl border border-white/10 ${
              toast.type === 'success' ? 'bg-gold-warm/80' : 'bg-red-500/80'
            }`}>
              {toast.type === 'success' ? <Sparkles className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VirtualAssistantAdmin;
