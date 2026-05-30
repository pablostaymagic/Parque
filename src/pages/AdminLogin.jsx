import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Leaf, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Check multi-admin list first (eagle_admin_users), then legacy single key, then hardcoded default
    const multiAdmins = JSON.parse(localStorage.getItem('eagle_admin_users') || 'null');
    if (multiAdmins) {
      const match = multiAdmins.find(a => a.email === email && a.password === password);
      if (match) {
        localStorage.setItem('admin_token', 'logged_in');
        navigate('/admin/dashboard');
        return;
      }
    } else {
      // Fallback: legacy single-credential key
      const stored = JSON.parse(localStorage.getItem('eagle_admin_credentials') || 'null');
      const validEmail = stored?.email ?? 'admin@igleparque.com';
      const validPassword = stored?.password ?? 'admin123';
      if (email === validEmail && password === validPassword) {
        localStorage.setItem('admin_token', 'logged_in');
        navigate('/admin/dashboard');
        return;
      }
    }
    setError('Acceso denegado. Credenciales incorrectas.');
  };

  return (
    <div className="min-h-screen bg-beige-warm flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-deep/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gold-accent/10 p-8 sm:p-12 relative z-10"
      >
        <div className="text-center space-y-6">
          <div className="inline-flex p-4 bg-green-deep rounded-full shadow-lg">
            <Leaf className="w-8 h-8 text-gold-accent" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-playfair font-bold text-green-deep">Panel de Control</h1>
            <p className="text-green-deep/50 text-sm font-inter">Acceso exclusivo para administración</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-accent" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-500 text-xs font-medium justify-center"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-green-deep text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-green-deep/20 hover:bg-green-nature transition-all duration-300 cursor-pointer mt-2"
            >
              Iniciar Sesión
            </button>
          </form>

          <p className="text-[10px] text-green-deep/30 uppercase tracking-[0.2em] pt-4">
            © 2026 Igle Parque Admin System
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
