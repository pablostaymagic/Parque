import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ChevronRight, 
  MessageSquare, 
  Clock, 
  Calendar, 
  MapPin, 
  Utensils, 
  Home, 
  Info
} from 'lucide-react';

const STORAGE_CHATBOT = 'chatbot_public_content';

const QUICK_QUESTIONS = [
  { text: '¿Qué horarios tienen?', icon: Clock },
  { text: '¿Qué evento hay?', icon: Calendar },
  { text: '¿Cómo llegar?', icon: MapPin },
  { text: '¿Qué estaciones tiene el parque?', icon: Info },
  { text: '¿Dónde comer en Anolaima?', icon: Utensils },
  { text: '¿Dónde hospedarse?', icon: Home },
];

const SpiritualAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hola, soy tu asistente virtual de Igle Parque. Pregúntame sobre el parque, eventos, estaciones o turismo en Anolaima.', 
      sender: 'bot',
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const findBestResponse = (query) => {
    const q = query.toLowerCase().trim();
    const content = localStorage.getItem(STORAGE_CHATBOT) || '';
    
    if (!content.trim()) {
      return "Por ahora no tengo información cargada sobre eso. Puedes comunicarte con Igle Parque para más detalles.";
    }

    // Split content into blocks/paragraphs to find the most relevant one
    const blocks = content.split(/\n\s*\n/).map(b => b.trim()).filter(b => b.length > 0);
    const queryWords = q.split(/\s+/).filter(w => w.length > 3); // Focus on meaningful words

    let bestBlock = null;
    let maxScore = 0;

    blocks.forEach(block => {
      const lowerBlock = block.toLowerCase();
      let score = 0;

      // Exact match for the whole query in the block
      if (lowerBlock.includes(q)) score += 10;

      // Match individual meaningful words
      queryWords.forEach(word => {
        if (lowerBlock.includes(word)) score += 2;
      });

      if (score > maxScore) {
        maxScore = score;
        bestBlock = block;
      }
    });

    // If we found a relevant block with a minimum confidence score
    if (maxScore > 0) {
      return bestBlock;
    }

    return "Por ahora no tengo información cargada sobre eso. Puedes comunicarte con Igle Parque para más detalles.";
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const response = findBestResponse(text);
      const botMsg = { id: Date.now() + 1, text: response, sender: 'bot', time: new Date() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start pointer-events-none">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto mb-4 w-[90vw] sm:w-[400px] h-[580px] max-h-[75vh] bg-white/95 backdrop-blur-xl border border-gold-accent/20 rounded-[2.5rem] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-green-deep flex items-center justify-between text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-nature/20 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gold-accent/20 flex items-center justify-center border border-white/10 shadow-inner">
                  <Bot className="w-6 h-6 text-gold-accent" />
                </div>
                <div>
                  <h3 className="font-playfair font-bold text-base">Asistente Igle Parque</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-nature animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Disponible ahora</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-beige-warm/5">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-end gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.sender === 'user' ? 'bg-gold-accent text-green-deep' : 'bg-green-deep text-white'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`max-w-[82%] p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gold-accent text-green-deep font-medium rounded-br-none' 
                      : 'bg-white text-green-deep rounded-bl-none border border-gold-accent/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-deep text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white p-4 rounded-3xl rounded-bl-none flex gap-1.5 items-center border border-gold-accent/10 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-green-deep/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-green-deep/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-green-deep/30 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            <div className="px-6 py-3 border-t border-gold-accent/5 bg-beige-warm/20 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 whitespace-nowrap">
                {QUICK_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q.text)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gold-accent/20 text-[11px] font-bold text-green-deep hover:bg-gold-accent hover:border-gold-accent hover:scale-105 transition-all shadow-sm"
                  >
                    <q.icon className="w-3.5 h-3.5 text-gold-accent" />
                    {q.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-5 bg-white border-t border-gold-accent/10 flex gap-3 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 bg-beige-warm/30 border border-transparent focus:border-gold-accent/30 rounded-2xl px-5 py-3.5 text-sm outline-none transition-all placeholder:text-green-deep/30"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="w-12 h-12 rounded-2xl bg-green-deep text-white flex items-center justify-center hover:bg-green-nature transition-all disabled:opacity-30 shadow-lg shadow-green-deep/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto relative group"
      >
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] transition-all duration-500 ${
          isOpen ? 'bg-red-500 rotate-90 rounded-full' : 'bg-green-deep'
        }`}>
          {isOpen ? <X className="text-white w-7 h-7" /> : <MessageSquare className="text-white w-7 h-7" />}
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-3xl blur-2xl -z-10 transition-all duration-500 opacity-60 ${
          isOpen ? 'bg-red-500/40' : 'bg-green-nature/40'
        }`} />

        {/* Small label when closed */}
        {!isOpen && (
          <div className="absolute left-full ml-5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-green-deep text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap shadow-2xl border border-white/10">
            ¿Tienes dudas? ¡Pregúntame!
          </div>
        )}
      </motion.button>

    </div>
  );
};

export default SpiritualAssistant;
