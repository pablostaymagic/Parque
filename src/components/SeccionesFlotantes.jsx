import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaTimes, FaComments } from 'react-icons/fa';

const socialNetworks = [
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    url: 'https://wa.me/573145504897?text=Hola%20vengo%20de%20la%20web%20de%20IgleParque%20y%20quiero%20m%C3%A1s%20informaci%C3%B3n',
    color: 'bg-[#25D366] text-white hover:bg-[#20ba5a]',
    shadow: 'shadow-[#25D366]/30',
  },
  {
    name: 'Instagram',
    icon: FaInstagram,
    url: 'https://www.instagram.com/igleparque?igsh=b3F0Ymtkd3J2eDZz&utm_source=qr',
    color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-95',
    shadow: 'shadow-[#ee2a7b]/30',
  },
  {
    name: 'Facebook',
    icon: FaFacebookF,
    url: 'https://www.facebook.com/share/18cBkLnzoM/?mibextid=wwXIfr',
    color: 'bg-[#1877F2] text-white hover:bg-[#166fe5]',
    shadow: 'shadow-[#1877F2]/30',
  },
  {
    name: 'TikTok',
    icon: FaTiktok,
    url: 'https://www.tiktok.com/@igleparque?_r=1&_t=ZS-95yI8OFTC3M',
    color: 'bg-black text-white hover:bg-neutral-800 border border-white/10',
    shadow: 'shadow-black/30',
  },
  {
    name: 'Chat',
    icon: FaComments,
    action: 'chat',
    color: 'bg-[#0084FF] text-white hover:bg-[#007bf5]',
    shadow: 'shadow-[#0084FF]/30',
  },
];

const SeccionesFlotantes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados del Chatbot
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("chat_history");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback en caso de error
      }
    }
    return [
      {
        role: "assistant",
        content: "¡Hola! Bienvenido al chat de IgleParque. ¿En qué te puedo ayudar hoy?"
      }
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connected"); // 'connected' | 'connecting' | 'error'
  const [lastFailedMessage, setLastFailedMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Rotar iconos cada segundo cuando el menú está cerrado y el chat está cerrado
  useEffect(() => {
    if (isOpen || chatOpen) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % socialNetworks.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, chatOpen]);

  // Guardar historial al actualizar mensajes
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(messages));
  }, [messages]);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const activeNetwork = socialNetworks[activeIndex];
  const ActiveIcon = activeNetwork.icon;

  // Manejo de eventos para móviles (clic) y escritorio (hover)
  const handleMouseEnter = () => {
    if (!chatOpen) setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (!chatOpen) setIsOpen(false);
  };
  const handleToggle = () => {
    if (chatOpen) {
      setChatOpen(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Generador UUID seguro
  const uuidv4 = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // Extracción inteligente de texto del bot
  const extractBotText = (data) => {
    if (!data) return "Lo siento, no he recibido respuesta.";
    if (typeof data === "string") return data;
    if (Array.isArray(data)) {
      if (data.length === 0) return "Lo siento, no he recibido respuesta.";
      return extractBotText(data[0]);
    }
    if (typeof data === "object") {
      const keys = ["text", "output", "response", "message", "content", "msg", "reply"];
      for (const key of keys) {
        if (data[key] && typeof data[key] === "string") {
          return data[key];
        }
      }
      if (data.data) {
        return extractBotText(data.data);
      }
      for (const key in data) {
        if (typeof data[key] === "string") {
          return data[key];
        }
      }
      try {
        return JSON.stringify(data);
      } catch (e) {
        return "Respuesta no legible.";
      }
    }
    return String(data);
  };

  // Enviar mensaje
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setConnectionStatus("connecting");

    try {
      const sessionId = localStorage.getItem("chat_session") || uuidv4();
      localStorage.setItem("chat_session", sessionId);

      const response = await fetch(
        "https://ohmatokita.app.n8n.cloud/webhook/45e46539-d4cc-4f80-b787-d936cbda0c4d/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId
          })
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no exitosa");
      }

      const data = await response.json();
      const botReply = extractBotText(data);
      
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
      setConnectionStatus("connected");
      setLastFailedMessage("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setConnectionStatus("error");
      setLastFailedMessage(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reintentar envío
  const handleRetry = async () => {
    if (!lastFailedMessage || loading) return;
    
    const userMessage = lastFailedMessage;
    setLoading(true);
    setConnectionStatus("connecting");

    try {
      const sessionId = localStorage.getItem("chat_session") || uuidv4();
      localStorage.setItem("chat_session", sessionId);

      const response = await fetch(
        "https://ohmatokita.app.n8n.cloud/webhook/45e46539-d4cc-4f80-b787-d936cbda0c4d/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId
          })
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta no exitosa");
      }

      const data = await response.json();
      const botReply = extractBotText(data);
      
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
      setConnectionStatus("connected");
      setLastFailedMessage("");
    } catch (error) {
      console.error("Error al reintentar envío:", error);
      setConnectionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Animaciones de Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        staggerDirection: -1, // Desplegar de abajo hacia arriba
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.7,
      y: 15,
      transition: { duration: 0.15 },
    },
  };

  const isMainButtonClose = isOpen || chatOpen;

  return (
    <div
      className="fixed bottom-6 right-6 z-[999] flex flex-col items-center gap-3 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ventana del Chatbot */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-[360px] md:w-[380px] h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-neutral-100 flex flex-col z-[1000] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-green-deep p-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white relative">
                  <FaComments className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-green-deep"></span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-none">Asistente IgleParque</h3>
                  <span className="text-[10px] text-emerald-200 font-medium">
                    {connectionStatus === "connecting" ? "Conectando..." : "En línea"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm break-words ${
                      msg.role === 'user'
                        ? 'bg-green-deep text-white rounded-tr-none'
                        : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Animación Escribiendo... */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-neutral-500 border border-neutral-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-1 shadow-sm">
                    <span className="text-xs font-semibold mr-1">Escribiendo</span>
                    <div className="flex space-x-1 items-center">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Manejo de error de red */}
            {connectionStatus === 'error' && (
              <div className="p-3 bg-red-50 border-t border-red-100 flex items-center justify-between">
                <span className="text-xs text-red-600 font-medium">Error de conexión.</span>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-full transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Footer Input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-150 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-green-deep/50 focus:ring-1 focus:ring-green-deep/20 transition-all disabled:bg-neutral-100 disabled:text-neutral-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-full bg-green-deep text-white hover:opacity-90 shadow-md active:scale-95 transition-all disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none disabled:active:scale-100"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Redes sociales desplegadas verticalmente */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center gap-3 mb-1"
          >
            {socialNetworks.map((net) => {
              const NetIcon = net.icon;
              
              if (net.action === 'chat') {
                return (
                  <motion.button
                    key={net.name}
                    type="button"
                    onClick={() => {
                      setChatOpen(true);
                      setIsOpen(false);
                    }}
                    variants={itemVariants}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full ${net.color} flex items-center justify-center shadow-lg hover:shadow-xl ${net.shadow} transition-all duration-300 relative group cursor-pointer`}
                  >
                    <NetIcon className="w-5 h-5" />
                    
                    {/* Tooltip elegante */}
                    <span className="absolute right-14 bg-white text-green-deep font-inter font-semibold text-xs py-1.5 px-3 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md pointer-events-none whitespace-nowrap border border-green-deep/5">
                      {net.name}
                    </span>
                  </motion.button>
                );
              }

              return (
                <motion.a
                  key={net.name}
                  href={net.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={itemVariants}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-12 h-12 rounded-full ${net.color} flex items-center justify-center shadow-lg hover:shadow-xl ${net.shadow} transition-all duration-300 relative group cursor-pointer`}
                >
                  <NetIcon className="w-5 h-5" />
                  
                  {/* Tooltip elegante */}
                  <span className="absolute right-14 bg-white text-green-deep font-inter font-semibold text-xs py-1.5 px-3 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-md pointer-events-none whitespace-nowrap border border-green-deep/5">
                    {net.name}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante principal */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={
          !isMainButtonClose
            ? {
                scale: [1, 1.04, 1],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
        className={`w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-green-deep/5 cursor-pointer relative transition-colors duration-300 ${
          isMainButtonClose ? 'text-red-500 hover:bg-red-50' : 'text-green-deep hover:bg-beige-warm/10'
        }`}
      >
        <AnimatePresence mode="wait">
          {isMainButtonClose ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            >
              <FaTimes className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center"
            >
              <ActiveIcon className="w-6 h-6 text-green-deep" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default SeccionesFlotantes;
