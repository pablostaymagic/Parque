import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Leaf, AlertCircle } from 'lucide-react';

const LogisticsLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Read user list from localStorage (managed by ConfiguracionPanel), fallback to default
    const stored = JSON.parse(localStorage.getItem('eagle_logistics_users') || 'null');
    const users = stored ?? [{ username: 'logistica', password: 'park123' }];
    const match = users.find(u => u.username === username && u.password === password);

    if (match) {
      localStorage.setItem('logistics_token', 'active');
      navigate('/logistica/form');
    } else {
      setError('Acceso denegado. Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-beige-warm flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-deep/5 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-accent/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gold-accent/10 p-10 relative z-10"
      >
        <div className="text-center space-y-8">
          <div className="inline-flex p-4 bg-green-nature rounded-full shadow-lg">
            <Leaf className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-playfair font-bold text-green-deep uppercase tracking-tight">Logística Igle Parque</h1>
            <p className="text-green-deep/40 text-xs font-bold uppercase tracking-widest">Registro de Ingresos</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-beige-warm/30 border border-gold-accent/10 focus:border-gold-accent outline-none text-green-deep text-sm transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-beige-warm/30 border border-gold-accent/10 focus:border-gold-accent outline-none text-green-deep text-sm transition-all"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-widest justify-center"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-green-deep text-white font-bold text-xs tracking-widest uppercase shadow-xl shadow-green-deep/20 hover:bg-green-nature transition-all duration-300 mt-4"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-[10px] text-green-deep/20 uppercase tracking-[0.2em] pt-4 font-bold">
            © 2026 Igle Parque Logística
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LogisticsLogin;
