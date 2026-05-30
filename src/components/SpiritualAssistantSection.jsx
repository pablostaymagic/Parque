import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Save, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Sparkles
} from 'lucide-react';

const STORAGE_KEY = 'chatbot_public_content';

const SpiritualAssistantSection = () => {
  // Admin State
  const [content, setContent] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState(null);

  // Chat State
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: '¡Hola! Bienvenido a Igle Parque. Soy tu asistente espiritual y turístico. ¿En qué puedo ayudarte hoy?', 
      sender: 'bot',
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    setContent(saved);
    
    // Check if user is admin (simple check for demo/testing purposes)
    const isAdmin = localStorage.getItem('admin_token');
    if (isAdmin) setShowAdmin(true);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, content);
    showToast('Información actualizada para el asistente.', 'success');
  };

  const findBestResponse = (query) => {
    const q = query.toLowerCase().trim();
    const knowledge = localStorage.getItem(STORAGE_KEY) || '';
    
    if (!knowledge.trim()) {
      return "No tengo esa información cargada todavía. Te recomiendo consultar con el personal del lugar.";
    }

    const blocks = knowledge.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);
    const queryWords = q.split(/\s+/).filter(w => w.length > 3);

    let bestBlock = null;
    let maxScore = 0;

    blocks.forEach(block => {
      const lowerBlock = block.toLowerCase();
      let score = 0;
      if (lowerBlock.includes(q)) score += 10;
      queryWords.forEach(word => {
        if (lowerBlock.includes(word)) score += 2;
      });

      if (score > maxScore) {
        maxScore = score;
        bestBlock = block;
      }
    });

    if (maxScore > 0) return bestBlock;
    return "No tengo esa información cargada todavía. Te recomiendo consultar con el personal del lugar.";
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = findBestResponse(input);
      const botMsg = { id: Date.now() + 1, text: response, sender: 'bot', time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <section id="asistente-espiritual" className="py-24 bg-beige-warm relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-nature/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gold-accent/10 text-gold-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            >
              Tecnología y Espíritu
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-playfair font-bold text-green-deep mb-6"
            >
              Asistente Espiritual
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-green-deep/60 max-w-2xl mx-auto leading-relaxed"
            >
              Resuelve tus dudas sobre el parque, nuestra misión y la experiencia espiritual que te espera en Igle Parque.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Admin Side - Carga de Información (Only visible for testing/admin) */}
            <AnimatePresence>
              {showAdmin && (
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="lg:col-span-5 space-y-6"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-green-deep/5 border border-gold-accent/10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 bg-gold-accent/10 rounded-2xl">
                        <Info className="w-5 h-5 text-gold-accent" />
                      </div>
                      <h3 className="text-lg font-playfair font-bold text-green-deep">Información para el asistente</h3>
                    </div>
                    <p className="text-xs text-green-deep/50 mb-6 leading-relaxed">
                      Pega aquí la información pública que quieres que el asistente use para responder a los turistas.
                    </p>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Historia, horarios, estaciones, reglas..."
                      className="w-full min-h-[300px] p-5 rounded-2xl bg-beige-warm/30 border border-gold-accent/5 focus:border-gold-accent/30 outline-none text-sm text-green-deep transition-all resize-none mb-6"
                    />
                    <button 
                      onClick={handleSave}
                      className="w-full py-4 bg-green-nature text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-green-deep transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-nature/20"
                    >
                      <Save className="w-4 h-4" /> Guardar información
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Public Side - Chat UI */}
            <div className={`${showAdmin ? 'lg:col-span-7' : 'lg:col-span-8 lg:col-start-3'} w-full`}>
              <div className="bg-white rounded-[3rem] shadow-2xl shadow-green-deep/5 border border-gold-accent/10 overflow-hidden flex flex-col h-[650px]">
                
                {/* Chat Header */}
                <div className="p-8 bg-green-deep flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold-accent/20 flex items-center justify-center border border-white/10">
                      <Bot className="w-6 h-6 text-gold-accent" />
                    </div>
                    <div>
                      <h3 className="text-white font-playfair font-bold text-lg">Pregunta al Asistente</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-nature animate-pulse" />
                        <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">En línea ahora</span>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-gold-accent/40" />
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-beige-warm/5 custom-scrollbar">
                  {messages.map((msg) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user' ? 'bg-gold-accent text-green-deep' : 'bg-green-deep text-white'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>
                      <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-gold-accent text-green-deep font-medium rounded-br-none' 
                          : 'bg-white text-green-deep rounded-bl-none border border-gold-accent/10 shadow-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-deep text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white p-4 rounded-3xl rounded-bl-none flex gap-1.5 items-center border border-gold-accent/10">
                        <span className="w-1.5 h-1.5 bg-green-deep/20 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-green-deep/20 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-green-deep/20 rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSend} className="p-6 bg-white border-t border-gold-accent/10 flex gap-4 items-center">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="flex-1 bg-beige-warm/30 border border-transparent focus:border-gold-accent/30 rounded-2xl px-6 py-4 text-sm outline-none transition-all placeholder:text-green-deep/30"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim()}
                    className="w-14 h-14 rounded-2xl bg-green-deep text-white flex items-center justify-center hover:bg-green-nature transition-all disabled:opacity-30 shadow-xl shadow-green-deep/10"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl text-white font-bold text-sm ${
              toast.type === 'success' ? 'bg-green-nature' : 'bg-red-500'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SpiritualAssistantSection;
