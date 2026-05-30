import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Lock, Plus, Pencil, Trash2, CheckCircle,
  Eye, EyeOff, Shield, UserCog, X, AlertCircle, Key, Sparkles, Wand2, Fingerprint
} from 'lucide-react';

/* ─── Constants ─── */
const STORAGE_LOGISTICS  = 'eagle_logistics_users';
const STORAGE_ADMINS     = 'eagle_admin_users'; 

const DEFAULT_LOGISTICS  = [{ id: 1, username: 'logistica', password: 'park123' }];
const DEFAULT_ADMINS     = [{ id: 1, email: 'admin@igleparque.com', password: 'admin123' }];

const inputCls = 'w-full px-4 py-3 rounded-md bg-[#ffffff] border border-[#d1d5db] focus:border-[#0ea5e9] focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)] outline-none text-[#1a1a1a] text-[0.95rem] transition-all font-inter';
const labelCls = 'block font-inter text-[0.85rem] font-medium text-[#6b7280] uppercase tracking-[0.5px] mb-2';

/* ─── Toast ─── */
const Toast = ({ msg, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
    className={`fixed bottom-12 left-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-md shadow-[0_10px_15px_rgba(0,0,0,0.1)] font-inter text-[0.95rem] font-medium ${type === 'success' ? 'bg-[#10b981] text-white' : 'bg-[#ef4444] text-white'}`}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    {msg}
  </motion.div>
);

/* ─── Password Field ─── */
const PwField = ({ value, onChange, placeholder = 'Contraseña', name }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative group">
      <input
        type={show ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputCls + ' pr-12'}
        required
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors p-1 rounded-md"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════
   LOGISTICS USER MANAGER
   ══════════════════════════════════════════ */
const LogisticsManager = ({ onToast }) => {
  const [users, setUsers]       = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null); 
  const [form, setForm]         = useState({ username: '', password: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_LOGISTICS) || 'null');
    setUsers(stored ?? DEFAULT_LOGISTICS);
  }, []);

  const save = (updated) => {
    setUsers(updated);
    localStorage.setItem(STORAGE_LOGISTICS, JSON.stringify(updated));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) return;

    if (editing) {
      const updated = users.map(u =>
        u.id === editing.id ? { ...u, username: form.username, password: form.password } : u
      );
      save(updated);
      onToast('Identidad de logística actualizada.', 'success');
    } else {
      if (users.find(u => u.username === form.username)) {
        onToast('Ese nombre de usuario ya existe.', 'error');
        return;
      }
      const newUser = { id: Date.now(), username: form.username, password: form.password };
      save([...users, newUser]);
      onToast('Nueva identidad de logística creada.', 'success');
    }

    setForm({ username: '', password: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (user) => {
    setEditing(user);
    setForm({ username: user.username, password: user.password });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar esta identidad de logística?')) return;
    const updated = users.filter(u => u.id !== id);
    save(updated);
    onToast('Identidad removida.', 'success');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ username: '', password: '' });
  };

  return (
    <div className="bg-[#f9fafb] p-6 sm:p-8 mb-6 rounded-[0.75rem] border border-[#e5e7eb] flex flex-col">
      <div className="pb-6 border-b border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserCog className="w-6 h-6 text-[#1a1a1a]" />
          <div>
            <h3 className="font-inter text-[1.25rem] font-semibold text-[#1a1a1a] mb-1">Logística</h3>
            <p className="font-inter text-[0.8rem] font-normal text-[#9ca3af]">Gestión de accesos logísticos</p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(s => !s); setEditing(null); setForm({ username: '', password: '' }); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-md font-inter text-[0.95rem] font-medium hover:bg-[#0284c7] transition duration-200"
        >
          <Plus className="w-4 h-4" /> Crear
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="py-6 border-b border-[#e5e7eb] space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Nombre de Usuario</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    placeholder="Identidad..."
                    className={inputCls}
                    required
                  />
                  <p className="font-inter text-[0.8rem] text-[#9ca3af] mt-1">Debe ser único en el sistema.</p>
                </div>
                <div>
                  <label className={labelCls}>Clave de Acceso</label>
                  <PwField
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2 bg-[#0ea5e9] text-white rounded-md font-inter font-medium text-[0.95rem] hover:bg-[#0284c7] transition duration-200">
                  {editing ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button type="button" onClick={cancelForm} className="px-6 py-2 bg-[#ffffff] text-[#4b5563] border border-[#d1d5db] rounded-md font-inter font-medium text-[0.95rem] hover:bg-[#f3f4f6] transition duration-200">
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col mt-4">
        {users.length === 0 && (
          <div className="py-12 text-center text-[#9ca3af]">
             <Fingerprint className="w-12 h-12 mx-auto mb-3 opacity-50" />
             <p className="font-inter text-[0.95rem]">No hay usuarios de logística registrados.</p>
          </div>
        )}
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 hover:bg-[#f3f4f6] rounded-md transition duration-200 gap-4 group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-[#4b5563]" />
              </div>
              <div className="min-w-0">
                <p className="font-inter text-[0.95rem] font-medium text-[#1a1a1a] truncate">{user.username}</p>
                <p className="font-inter text-[0.8rem] text-[#9ca3af]">{'•'.repeat(Math.min(user.password.length, 8))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(user)} className="p-2 rounded-md text-[#0ea5e9] hover:bg-[#0ea5e9]/10 transition duration-200" title="Editar">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(user.id)} className="p-2 rounded-md text-[#ef4444] hover:bg-[#ef4444]/10 transition duration-200" title="Eliminar">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   ADMIN USERS MANAGER (multi)
   ══════════════════════════════════════════ */
const AdminCredentialsManager = ({ onToast }) => {
  const [admins, setAdmins]     = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState({ email: '', password: '', confirm: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_ADMINS) || 'null');
    setAdmins(stored ?? DEFAULT_ADMINS);
  }, []);

  const save = (updated) => {
    setAdmins(updated);
    localStorage.setItem(STORAGE_ADMINS, JSON.stringify(updated));
    if (updated.length > 0) {
      localStorage.setItem('eagle_admin_credentials', JSON.stringify({ email: updated[0].email, password: updated[0].password }));
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ email: '', password: '', confirm: '' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!form.email.trim() || !form.password.trim()) return;
    if (form.password !== form.confirm) {
      onToast('Las contraseñas no coinciden.', 'error');
      return;
    }

    if (editing) {
      const updated = admins.map(a =>
        a.id === editing.id ? { ...a, email: form.email, password: form.password } : a
      );
      save(updated);
      onToast('Administrador actualizado.', 'success');
    } else {
      if (admins.find(a => a.email === form.email)) {
        onToast('Este email ya está registrado.', 'error');
        return;
      }
      const newAdmin = { id: Date.now(), email: form.email, password: form.password };
      save([...admins, newAdmin]);
      onToast('Nuevo administrador creado.', 'success');
    }

    cancelForm();
  };

  const handleEdit = (admin) => {
    setEditing(admin);
    setForm({ email: admin.email, password: admin.password, confirm: admin.password });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (admins.length <= 1) {
      onToast('Debe haber al menos un administrador principal.', 'error');
      return;
    }
    if (!window.confirm('¿Eliminar este administrador?')) return;
    const updated = admins.filter(a => a.id !== id);
    save(updated);
    onToast('Administrador removido.', 'success');
  };

  return (
    <div className="bg-[#f9fafb] p-6 sm:p-8 mb-6 rounded-[0.75rem] border border-[#e5e7eb] flex flex-col">
      <div className="pb-6 border-b border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#1a1a1a]" />
          <div>
            <h3 className="font-inter text-[1.25rem] font-semibold text-[#1a1a1a] mb-1">Administradores</h3>
            <p className="font-inter text-[0.8rem] font-normal text-[#9ca3af]">Gestión de accesos con privilegios</p>
          </div>
        </div>
        <button
          onClick={() => { cancelForm(); setShowForm(s => !s); }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-md font-inter text-[0.95rem] font-medium hover:bg-[#0284c7] transition duration-200"
        >
          <Plus className="w-4 h-4" /> Crear
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <form onSubmit={handleSubmit} className="py-6 border-b border-[#e5e7eb] space-y-5">
               <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Correo Electrónico</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="admin@igleparque.com"
                      className={inputCls}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                      <label className={labelCls}>Nueva Contraseña</label>
                      <PwField value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Contraseña..." />
                    </div>
                    <div>
                      <label className={labelCls}>Confirmar Contraseña</label>
                      <PwField value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Confirmar..." />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="px-6 py-2 bg-[#0ea5e9] text-white rounded-md font-inter font-medium text-[0.95rem] hover:bg-[#0284c7] transition duration-200">
                      {editing ? 'Guardar Cambios' : 'Crear Administrador'}
                    </button>
                    <button type="button" onClick={cancelForm} className="px-6 py-2 bg-[#ffffff] text-[#4b5563] border border-[#d1d5db] rounded-md font-inter font-medium text-[0.95rem] hover:bg-[#f3f4f6] transition duration-200">
                      Cancelar
                    </button>
                  </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col mt-4">
        {admins.map((admin, idx) => (
          <div key={admin.id} className="flex items-center justify-between p-4 hover:bg-[#f3f4f6] rounded-md transition duration-200 gap-4 group">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4 text-[#4b5563]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-inter text-[0.95rem] font-medium text-[#1a1a1a] truncate">{admin.email}</p>
                  {idx === 0 && (
                    <span className="font-inter text-[0.7rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#10b981] text-white flex-shrink-0">Principal</span>
                  )}
                </div>
                <p className="font-inter text-[0.8rem] text-[#9ca3af]">{'•'.repeat(Math.min(admin.password.length, 8))}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => handleEdit(admin)} className="p-2 rounded-md text-[#0ea5e9] hover:bg-[#0ea5e9]/10 transition duration-200" title="Editar">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(admin.id)} disabled={admins.length <= 1} className="p-2 rounded-md text-[#ef4444] hover:bg-[#ef4444]/10 transition duration-200 disabled:opacity-30 disabled:cursor-not-allowed" title="Eliminar">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PANEL
   ══════════════════════════════════════════ */
const ConfiguracionPanel = () => {
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[1400px] mx-auto p-4 sm:p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-inter text-[2rem] font-bold text-[#1a1a1a] leading-tight mb-2">Configuración</h1>
        <p className="font-inter text-[0.95rem] font-normal text-[#4b5563] leading-relaxed max-w-2xl">
          Gestiona los accesos y credenciales para el panel de administración y el portal de logística.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-4 md:gap-6 lg:gap-8">
        <AdminCredentialsManager onToast={showToast} />
        <LogisticsManager onToast={showToast} />
      </div>

      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConfiguracionPanel;
