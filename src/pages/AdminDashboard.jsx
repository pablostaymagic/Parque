import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfiguracionPanel from '../components/ConfiguracionPanel';
import EstadisticasPanel from '../components/EstadisticasPanel';
import TurismoPanel from '../components/TurismoPanel';
import EstacionesPanel from '../components/EstacionesPanel';
import VirtualAssistantAdmin from '../components/VirtualAssistantAdmin';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
  Users,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  Trash2,
  Clock,
  ExternalLink,
  RotateCcw,
  UserCheck,
  Globe,
  Plus,
  X,
  Menu,
  MessageCircle,
  AlertTriangle,
  MapPin,
  ListOrdered,
  Camera,
} from 'lucide-react';

/* ─── Sidebar Item ─── */
const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-5 transition-all duration-500 relative group ${
      active
        ? 'text-gold-warm bg-white/5'
        : 'text-text-muted/40 hover:text-text-warm hover:bg-white/[0.02]'
    }`}
  >
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute left-0 w-1 h-8 bg-gold-warm rounded-r-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    )}
    <Icon className={`w-5 h-5 transition-transform duration-500 ${active ? 'text-gold-warm scale-110' : 'group-hover:scale-110'}`} />
    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'opacity-100 translate-x-1' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'}`}>
      {label}
    </span>
  </button>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, icon: Icon, trend, subValue }) => (
  <div className="bg-beige-cream/80 backdrop-blur-xl p-6 rounded-3xl border border-gold-warm/10 shadow-sm space-y-4 group hover:border-gold-warm/30 transition-all duration-500">
    <div className="flex items-center justify-between">
      <div className="p-3 bg-gold-warm/10 rounded-xl border border-gold-warm/10 group-hover:bg-gold-warm/20 transition-all duration-500">
        <Icon className="w-5 h-5 text-gold-warm" />
      </div>
      {trend && (
        <span className="text-[9px] font-black text-gold-warm bg-gold-warm/10 px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp className="w-3 h-3" />
          {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/40 group-hover:text-gold-warm/80 transition-colors duration-500">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-3xl font-playfair font-black text-green-forest group-hover:text-gold-warm transition-colors duration-500">{value}</p>
        {subValue && <span className="text-[10px] font-bold uppercase tracking-widest text-green-forest/20">{subValue}</span>}
      </div>
    </div>
  </div>
);

/* ─── Reservation Table Sub-component ─── */
const ReservationTable = ({ title, data, onConfirm, onCancel, onDelete, type }) => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="space-y-1">
          <h4 className="text-xl font-playfair font-black text-green-forest flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${type === 'pending' ? 'bg-gold-warm shadow-[0_0_10px_rgba(197,160,89,0.5)]' : 'bg-green-olive'}`} />
            {title}
          </h4>
          <p className="text-[10px] font-medium text-green-forest/40 uppercase tracking-[0.2em] ml-5 italic">Registros de almas en el territorio</p>
        </div>
        <span className="text-[10px] font-bold text-gold-warm bg-gold-warm/5 border border-gold-warm/10 px-3 py-1 rounded-full uppercase tracking-[0.1em]">
          {data.length} REGISTROS
        </span>
      </div>

      <div className="bg-beige-cream/40 backdrop-blur-md rounded-2xl shadow-sm border border-gold-warm/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-green-forest/5 border-b border-gold-warm/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/50">Visitante</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/50">Contacto & Origen</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/50">Perfil Espiritual</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/50">Fecha Visita</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-forest/50 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-warm/5">
              {Array.isArray(data) && data.length > 0 ? (
                data.map((res) => (
                  <tr key={res.id} className="hover:bg-white/50 transition-all duration-300 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold-warm/5 border border-gold-warm/10 flex items-center justify-center text-gold-warm font-playfair font-black text-sm group-hover:bg-gold-warm group-hover:text-white transition-all duration-300">
                          {getInitials(res.nombre)}
                        </div>
                        <span className="text-sm font-medium text-green-forest group-hover:text-gold-warm transition-all duration-300">{res.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <a href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-xs font-medium tracking-wide text-gold-warm flex items-center gap-1.5 hover:text-green-forest transition-colors uppercase">
                          <ExternalLink className="w-3 h-3" />
                          {res.whatsapp}
                        </a>
                        <p className="text-[10px] text-green-forest/40 italic uppercase tracking-wider font-medium">{res.nacionalidad || 'Global'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5 text-green-forest/60 font-medium">
                        <p><span className="text-[10px] font-bold uppercase tracking-widest text-green-forest/30 mr-2">Edad</span> {res.edad} años</p>
                        <p className="capitalize"><span className="text-[10px] font-bold uppercase tracking-widest text-green-forest/30 mr-2">Género</span> {res.genero}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-green-forest/80">
                        <Calendar className="w-4 h-4 text-gold-warm/60" />
                        {res.fecha}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                        {type === 'pending' ? (
                          <button onClick={() => onConfirm(res.id)} title="Confirmar Reserva" className="p-2.5 rounded-lg bg-white/40 text-gold-warm hover:bg-gold-warm hover:text-white border border-gold-warm/10 transition-all shadow-sm">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => onCancel(res.id)} title="Restaurar a Pendiente" className="p-2.5 rounded-lg bg-white/40 text-green-forest/40 hover:bg-white hover:text-green-forest border border-gold-warm/10 transition-all shadow-sm">
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => onDelete(res.id)} title="Eliminar Permanente" className="p-2.5 rounded-lg bg-white/40 text-red-500/60 hover:bg-red-500 hover:text-white border border-red-500/10 transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-green-forest/30 italic">El silencio de la naturaleza prevalece</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ─── Create Event Modal ─── */
const CreateEventModal = ({ isOpen, onClose, onSave, currentEvent }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    fechaInicio: '',
    horaInicio: '',
    fechaFin: '',
    horaFin: '',
    descripcion: ''
  });
  const [flyerData, setFlyerData] = useState(null); // { type: 'image', src: 'base64', width, height }
  const [flyerFile, setFlyerFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [mediaError, setMediaError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setMediaError('');
      setFlyerData(null);
      setFlyerFile(null);
      setPreviewUrl('');
      if (currentEvent) {
        setFormData({
          titulo: currentEvent.titulo || '',
          fechaInicio: currentEvent.fechaInicio || '',
          horaInicio: currentEvent.horaInicio || '',
          fechaFin: currentEvent.fechaFin || '',
          horaFin: currentEvent.horaFin || '',
          descripcion: currentEvent.descripcion || ''
        });
        // Recuperar imagen existente sin convertirla a File
        const existingFlyerSrc =
          currentEvent?.flyer?.src ||
          currentEvent?.flyer_url ||
          currentEvent?.flyerUrl ||
          currentEvent?.imagen ||
          currentEvent?.image ||
          '';
        if (existingFlyerSrc) {
          setPreviewUrl(existingFlyerSrc);
          setFlyerData({ type: 'image', src: existingFlyerSrc, isExisting: true });
          setFlyerFile(null); // No es un File nuevo
        }
      } else {
        setFormData({ titulo: '', fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', descripcion: '' });
      }
    }
  }, [isOpen, currentEvent]);

  if (!isOpen) return null;

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFlyerData(null);
      setFlyerFile(null);
      setPreviewUrl('');
      return;
    }

    const isImage = file.type.match(/image\/(jpeg|jpg|png|webp)/);

    if (!isImage) {
      setMediaError('Solo se permiten imágenes para el flyer del evento.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result;
      
      // Validate dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width !== 1080 || img.height !== 1920) {
          setMediaError('El flyer debe tener medidas exactas de 1080 x 1920 píxeles.');
          setFlyerData(null);
          setFlyerFile(null);
          setPreviewUrl('');
        } else {
          setFlyerData({ type: 'image', src, width: 1080, height: 1920 });
          setFlyerFile(file);
          setPreviewUrl(src);
          setMediaError('');
          setError('');
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Basic completion validation
    if (!formData.titulo || !formData.fechaInicio || !formData.horaInicio || !formData.fechaFin || !formData.horaFin || !formData.descripcion) {
      setError('Por favor, completa todos los campos obligatorios (Título, Inicio, Fin y Descripción).');
      return;
    }

    const isEditing = Boolean(currentEvent?.id);
    const hasExistingFlyer = Boolean(
      flyerData?.isExisting ||
      previewUrl ||
      currentEvent?.flyer?.src ||
      currentEvent?.flyer_url ||
      currentEvent?.flyerUrl
    );

    // Crear: exige imagen. Editar: solo exige imagen si no hay existente
    if (!isEditing && !flyerData && !flyerFile) {
      setError('Debes cargar una imagen válida de 1080 x 1920 px para el evento.');
      return;
    }
    if (isEditing && !hasExistingFlyer && !flyerFile) {
      setError('Debes cargar una imagen válida de 1080 x 1920 px para el evento.');
      return;
    }

    // Logic validation: End must be after Start
    const start = new Date(`${formData.fechaInicio}T${formData.horaInicio}`).getTime();
    const end = new Date(`${formData.fechaFin}T${formData.horaFin}`).getTime();

    if (end <= start) {
      setError('La fecha de finalización no puede ser anterior al inicio del evento.');
      return;
    }

    const finalFlyer = flyerData || (
      previewUrl
        ? { type: 'image', src: previewUrl, isExisting: true }
        : null
    );

    const finalData = { 
      ...(currentEvent?.id ? { id: currentEvent.id } : {}),
      titulo: formData.titulo,
      fechaInicio: formData.fechaInicio,
      horaInicio: formData.horaInicio,
      fechaFin: formData.fechaFin,
      horaFin: formData.horaFin,
      descripcion: formData.descripcion,
      flyer: finalFlyer,
      flyerFile: flyerFile,
      publicado: true,
      createdAt: currentEvent?.createdAt || new Date().toISOString()
    };

    try {
      await onSave(finalData);
      
      // Clear form after successful save
      setFormData({ titulo: '', fechaInicio: '', horaInicio: '', fechaFin: '', horaFin: '', descripcion: '' });
      setFlyerData(null);
      setFlyerFile(null);
      setPreviewUrl('');
      setError('');
      setMediaError('');
    } catch (err) {
      console.error("Error saving event:", err);
      setError('No se pudo publicar el evento. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative bg-[#F6EED6] rounded-3xl border border-[#004d26]/10 shadow-2xl w-[95vw] sm:w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-0"
      >
        {/* Header */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent border-none cursor-pointer text-[#004d26]/50 hover:text-[#004d26] transition-colors flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <h3
          className="font-playfair text-2xl font-bold text-[#004d26] leading-tight mb-1"
        >
          {currentEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
        </h3>
        <p className="font-inter text-sm text-[#004d26]/60 mb-6">
          Configura el evento que aparecerá en la página principal.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-750 rounded-xl font-inter text-xs flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Título */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Título del Evento *
            </label>
            <input
              type="text"
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              placeholder="Ej. Gran Vigilia de Oración"
              className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Fecha y Hora Inicio + Fin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  value={formData.fechaInicio}
                  onChange={e => setFormData({...formData, fechaInicio: e.target.value})}
                  className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  value={formData.horaInicio}
                  onChange={e => setFormData({...formData, horaInicio: e.target.value})}
                  className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Fecha Fin *
                </label>
                <input
                  type="date"
                  value={formData.fechaFin}
                  onChange={e => setFormData({...formData, fechaFin: e.target.value})}
                  className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Hora Fin *
                </label>
                <input
                  type="time"
                  value={formData.horaFin}
                  onChange={e => setFormData({...formData, horaFin: e.target.value})}
                  className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Imagen / Flyer */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Cargar imagen — solo dimensión 1080 x 1920 px *
            </label>
            <p className="font-inter text-[10px] text-[#004d26]/50 -mt-1">
              Sube una imagen vertical en formato JPG, PNG o WEBP. Medida obligatoria: 1080 x 1920 px.
            </p>
            <div className="flex items-center gap-4">
              <label className="shrink-0 bg-[#004d26] hover:bg-[#D4AF37] hover:text-[#004d26] text-[#F6EED6] font-inter text-xs font-semibold uppercase tracking-[0.1em] px-6 py-3 rounded-full cursor-pointer transition-colors duration-200">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleMediaChange}
                  className="hidden"
                />
                Cargar imagen
              </label>
              <span className="font-inter text-xs text-[#004d26]/60 flex-1 truncate">
                {previewUrl ? 'Archivo seleccionado ✓' : 'Sin archivos seleccionados'}
              </span>
            </div>
            {mediaError && (
              <p className="font-inter text-red-500 text-xs mt-1">{mediaError}</p>
            )}
            {previewUrl && (
              <div className="mt-2">
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#004d26]/10 shadow-sm bg-[#004d26]/5 flex items-center justify-center">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#004d26] text-[8px] px-3 py-1 rounded-full font-inter font-bold uppercase tracking-wide">
                    Flyer Cargado ✓
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1.5">
            <label className="font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Describe los detalles del evento..."
              className="w-full font-inter text-[#004d26] bg-white/45 border border-[#004d26]/10 rounded-xl px-4 py-3 text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 focus:outline-none resize-vertical transition-all duration-200 leading-[1.5] min-h-[100px]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full font-inter font-bold text-[#F6EED6] bg-[#004d26] hover:bg-[#D4AF37] hover:text-[#004d26] uppercase transition-all duration-200 active:scale-[0.98] rounded-full py-3.5 text-xs tracking-widest mt-2"
          >
            {currentEvent ? 'Actualizar Evento' : 'Publicar Evento'}
          </button>
          <p className="font-inter text-[10px] text-[#004d26]/40 text-center mt-1">
            El evento se publicará inmediatamente en la página principal.
          </p>
        </form>
      </div>
    </div>
  );
};

/* ─── API base URL ─── */
const API_BASE = 'http://localhost:3000';

/* ─── fetchEvents helper ─── */
// Consulta GET /eventos, toma el evento más reciente y convierte
// los campos del backend (snake_case) al formato del frontend (camelCase).
const fetchLatestEvent = async () => {
  const res = await fetch(`${API_BASE}/eventos`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const result = await res.json();
  if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
    const latest = result.data[0];
    const flyerSrc = latest.flyer_url
      ? (latest.flyer_url.startsWith('http') ? latest.flyer_url : `${API_BASE}/${latest.flyer_url}`)
      : null;
    return {
      ...latest,
      fechaInicio: latest.fecha_inicio ? latest.fecha_inicio.split('T')[0] : '',
      horaInicio:  latest.fecha_inicio ? latest.fecha_inicio.split('T')[1]?.substring(0, 5) : (latest.hora_inicio?.substring(0, 5) || ''),
      fechaFin:    latest.fecha_fin   ? latest.fecha_fin.split('T')[0]   : '',
      horaFin:     latest.fecha_fin   ? latest.fecha_fin.split('T')[1]?.substring(0, 5) : (latest.hora_fin?.substring(0, 5) || ''),
      flyer: flyerSrc ? { src: flyerSrc } : null,
    };
  }
  return null;
};

/* ─── AdminDashboard Component ─── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [logisticVisitors, setLogisticVisitors] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [eventHistory, setEventHistory] = useState([]);
  const [timeLeft, setTimeLeft] = useState('');
  const [viewHistoryEvent, setViewHistoryEvent] = useState(null);

  /* Clear ALL operational data (keeps Configuración keys safe) */
  const clearOperationalData = () => {
    if (!window.confirm('¿Limpiar TODOS los datos operativos? (Reservas, Logística, Eventos, Historial)\n\nLa Configuración de usuarios NO se verá afectada.')) return;
    const SAFE_KEYS = ['eagle_admin_users','eagle_admin_credentials','eagle_logistics_users'];
    Object.keys(localStorage).forEach(k => { if (!SAFE_KEYS.includes(k)) localStorage.removeItem(k); });
    setReservations([]);
    setLogisticVisitors([]);
    setActiveEvent(null);
    setScheduledEvents([]);
    setEventHistory([]);
  };

  const archiveEvent = React.useCallback((eventData) => {
    const history = JSON.parse(localStorage.getItem('eventos_historial') || '[]');
    const exists = history.find(e => e.titulo === eventData.titulo && e.fechaInicio === eventData.fechaInicio);
    if (!exists) {
      history.push({ ...eventData, estado: 'finalizado', archivedAt: new Date().toISOString() });
      localStorage.setItem('eventos_historial', JSON.stringify(history));
    }
    localStorage.removeItem('evento_activo');
    console.log('Event archived:', eventData.titulo);
  }, []);

  const checkScheduledEvents = React.useCallback(() => {
    const scheduled = JSON.parse(localStorage.getItem('eventos_programados') || '[]');
    const now = new Date().getTime();
    
    let toPublish = null;
    const remainingScheduled = [];
    
    scheduled.forEach(ev => {
      const pubDate = new Date(ev.publish_date).getTime();
      if (now >= pubDate) {
        if (!toPublish || pubDate > new Date(toPublish.publish_date).getTime()) {
          if (toPublish) remainingScheduled.push(toPublish);
          toPublish = { ...ev, status: 'Published' };
        } else {
          remainingScheduled.push(ev);
        }
      } else {
        remainingScheduled.push(ev);
      }
    });

    if (toPublish) {
      localStorage.setItem('evento_activo', JSON.stringify({ ...toPublish, publicado: true }));
      localStorage.setItem('eventos_programados', JSON.stringify(remainingScheduled));
      console.log('Scheduled event published to evento_activo:', toPublish.titulo);
    }
    setScheduledEvents(remainingScheduled.sort((a, b) => new Date(a.publish_date).getTime() - new Date(b.publish_date).getTime()));
  }, [archiveEvent]);
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    
    // Load data
    const loadReservations = async () => {
      try {
        const res = await fetch('http://localhost:3000/reservas');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const result = await res.json();
        if (result && result.success && Array.isArray(result.data)) {
          const adapted = result.data.map(r => ({
            id: r.id,
            nombre: r.nombre,
            whatsapp: r.telefono,
            genero: r.genero,
            edad: r.edad,
            nacionalidad: r.nacionalidad,
            fecha: r.fecha_visita ? r.fecha_visita.split('T')[0] : '',
            eventTitle: r.evento_titulo || 'Sin evento',
            estado: r.estado || 'confirmada',
          }));
          setReservations(adapted);
        } else {
          const savedReservations = JSON.parse(localStorage.getItem('eagle_reservations') || '[]');
          setReservations(Array.isArray(savedReservations) ? savedReservations.sort((a, b) => b.id - a.id) : []);
        }
      } catch (error) {
        console.warn('Error al cargar reservas del backend, usando localStorage:', error.message);
        const savedReservations = JSON.parse(localStorage.getItem('eagle_reservations') || '[]');
        setReservations(Array.isArray(savedReservations) ? savedReservations.sort((a, b) => b.id - a.id) : []);
      }
    };

    loadReservations();

    const loadEvents = async () => {
      try {
        const formatted = await fetchLatestEvent();

        if (formatted) {
          setActiveEvent(formatted);
          localStorage.setItem('evento_activo', JSON.stringify(formatted));
        } else {
          // Si PostgreSQL no devuelve eventos, no revivir desde localStorage.
          localStorage.removeItem('evento_activo');
          setActiveEvent(null);
          setTimeLeft('');
        }
      } catch (error) {
        console.warn('Error al cargar eventos desde backend:', error.message);

        // Para eventos, la fuente de verdad es PostgreSQL.
        // No usar localStorage como fallback porque revive eventos eliminados.
        localStorage.removeItem('evento_activo');
        setActiveEvent(null);
        setTimeLeft('');
      }
    };

    loadEvents();

    const history = JSON.parse(localStorage.getItem('eventos_historial') || '[]');
    setEventHistory(Array.isArray(history) ? history.sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt)) : []);

    checkScheduledEvents();

  }, [navigate, activeView, archiveEvent, checkScheduledEvents]);

  useEffect(() => {
    const scheduleInterval = setInterval(() => {
      checkScheduledEvents();
    }, 10000); // Check every 10 seconds
    return () => clearInterval(scheduleInterval);
  }, [checkScheduledEvents]);

  useEffect(() => {
    if (!activeEvent || !activeEvent.fechaFin || !activeEvent.horaFin) return;

    const targetDate = new Date(`${activeEvent.fechaFin}T${activeEvent.horaFin}`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(interval);
        archiveEvent(activeEvent);
        setActiveEvent(null);
        const savedHistory = JSON.parse(localStorage.getItem('eventos_historial') || '[]');
        setEventHistory(savedHistory.sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt)));
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeEvent, archiveEvent]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin');
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = reservations.map(r => r.id === id ? { ...r, estado: newStatus } : r);
    setReservations(updated);
    localStorage.setItem('eagle_reservations', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      const updated = reservations.filter(r => r.id !== id);
      setReservations(updated);
      localStorage.setItem('eagle_reservations', JSON.stringify(updated));
    }
  };

  const clearEventFromFrontend = (deletedEvent = null) => {
    const deletedId = deletedEvent?.id || activeEvent?.id || null;
    const deletedTitle = deletedEvent?.titulo || activeEvent?.titulo || null;

    // 1. Borrar evento activo local
    localStorage.removeItem('evento_activo');

    // 2. Borrar cualquier programación relacionada para evitar que se republique
    try {
      const scheduled = JSON.parse(localStorage.getItem('eventos_programados') || '[]');

      const filteredScheduled = Array.isArray(scheduled)
        ? scheduled.filter((ev) => {
            const sameId = deletedId && String(ev.id) === String(deletedId);
            const sameTitle = deletedTitle && ev.titulo === deletedTitle;
            return !sameId && !sameTitle;
          })
        : [];

      localStorage.setItem('eventos_programados', JSON.stringify(filteredScheduled));
      setScheduledEvents(filteredScheduled);
    } catch (error) {
      console.warn('No se pudo limpiar eventos_programados:', error);
      localStorage.removeItem('eventos_programados');
      setScheduledEvents([]);
    }

    // 3. Limpiar estados visuales
    setActiveEvent(null);
    setTimeLeft('');
    setShowEventModal(false);
    setEditingEvent(null);

    // 4. Notificar a otras vistas/componentes
    window.dispatchEvent(new CustomEvent('eventoActivoActualizado', { detail: null }));
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteActiveEvent = async () => {
    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar este evento? Se eliminará de la base de datos y no volverá a mostrarse.'
    );

    if (!confirmDelete) return;

    const eventToDelete = activeEvent;
    const eventoId = eventToDelete?.id;

    if (!eventoId) {
      clearEventFromFrontend(eventToDelete);
      alert('El evento no tenía ID válido. Se eliminó de la vista local.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/eventos/${eventoId}`, {
        method: 'DELETE',
      });

      const result = await response.json().catch(() => ({}));

      // Si no existe en BD, también se limpia visualmente.
      if (response.status === 404) {
        clearEventFromFrontend(eventToDelete);
        alert('El evento no existía en la base de datos. Se limpió de la vista.');
        return;
      }

      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'No se pudo eliminar el evento en la base de datos.');
      }

      // Confirmación extra: volver a consultar backend después del DELETE
      const checkResponse = await fetch(`${API_BASE}/eventos`);
      const checkResult = await checkResponse.json().catch(() => ({}));

      if (checkResponse.ok && checkResult.success && Array.isArray(checkResult.data)) {
        const stillExists = checkResult.data.some(
          ev => String(ev.id) === String(eventoId)
        );

        if (stillExists) {
          throw new Error('El backend respondió eliminado, pero el evento todavía aparece en GET /eventos.');
        }
      }

      clearEventFromFrontend(eventToDelete);
      alert('Evento eliminado correctamente.');

    } catch (error) {
      console.error('Error eliminando evento:', error);
      alert('Error al eliminar el evento: ' + error.message);
    }
  };

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'eventos', label: 'Eventos', icon: Calendar },
    { id: 'reservas', label: 'Reservas', icon: Users },
    { id: 'estadisticas', label: 'Estadísticas', icon: BarChart3 },
    { id: 'turismo', label: 'Qué hacer en Anolaima', icon: MapPin },
    { id: 'estaciones', label: 'Estaciones', icon: ListOrdered },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
    { id: 'asistente', label: 'Asistente Virtual', icon: MessageCircle },
  ];

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  /* ─── Render Dashboard ─── */
  const renderDashboard = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 lg:space-y-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-10">
        <StatCard label="Reservas Totales" value={reservations.length.toLocaleString()} icon={Users} trend={reservations.length > 0 ? '+' + reservations.length : '0'} />
        <StatCard label="Ingresos Logística" value={logisticVisitors.length.toLocaleString()} icon={UserCheck} trend={logisticVisitors.length > 0 ? '+' + logisticVisitors.length : '0'} />
        <StatCard label="Eventos" value={(activeEvent ? 1 : 0) + (scheduledEvents?.length || 0)} icon={Calendar} trend="" />
        <StatCard label="Visitantes Recibidos" value={(reservations.length + logisticVisitors.length).toLocaleString()} icon={Sparkles} trend="" />
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-beige-cream/50 backdrop-blur-xl rounded-[3rem] shadow-premium border border-gold-warm/10 p-10 lg:p-14">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h3 className="text-3xl font-playfair font-black text-green-forest">Últimas Interacciones</h3>
              <p className="text-[10px] font-black text-green-forest/30 uppercase tracking-[0.4em] italic">Visitantes que han cruzado el umbral recientemente</p>
            </div>
            <button onClick={() => setActiveView('reservas')} className="px-6 py-2.5 bg-gold-warm/5 hover:bg-gold-warm hover:text-white text-gold-warm text-[10px] font-black uppercase tracking-widest rounded-full border border-gold-warm/20 transition-all">Explorar Reservas</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.isArray(reservations) && reservations.slice(0, 6).map((res) => (
              <div key={res.id} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white/40 hover:bg-white transition-all duration-500 group border border-transparent hover:border-gold-warm/20 shadow-sm">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gold-warm/10 flex-shrink-0 flex items-center justify-center text-gold-warm font-playfair font-black text-lg border border-gold-warm/10 group-hover:bg-gold-warm group-hover:text-white transition-all duration-500">{getInitials(res.nombre)}</div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-lg font-playfair font-black text-green-forest truncate group-hover:text-gold-warm transition-colors">{res.nombre}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-forest/20 truncate italic">{res.eventTitle} • {new Date(res.id).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full ${res.estado === 'confirmada' ? 'bg-gold-warm/20 text-gold-warm border border-gold-warm/20' : 'bg-white/5 text-white/20 border border-white/10'}`}>{res.estado}</span>
                </div>
              </div>
            ))}
            {reservations.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/10 italic">El eco del parque aún espera por visitantes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset banner */}
      {(reservations.length > 0 || logisticVisitors.length > 0 || activeEvent || eventHistory.length > 0) && (
        <div className="flex items-center justify-between gap-8 p-10 bg-red-500/5 border border-red-500/10 rounded-[3rem] backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-playfair font-black text-green-forest">Purificación del Sistema</p>
              <p className="text-xs text-green-forest/40 font-medium">¿Deseas resetear todos los datos operativos y empezar un nuevo ciclo espiritual?</p>
            </div>
          </div>
          <button onClick={clearOperationalData}
            className="px-8 py-4 bg-red-500 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-green-forest transition-all shadow-premium active:scale-95">
            Reiniciar Ciclo
          </button>
        </div>
      )}

      {/* Empty-state hint */}
      {reservations.length === 0 && logisticVisitors.length === 0 && !activeEvent && (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-beige-cream/50 backdrop-blur-xl rounded-[4rem] border border-gold-warm/10 shadow-premium relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gold-warm/[0.05]" />
          <div className="w-24 h-24 rounded-[2.5rem] bg-gold-warm/5 flex items-center justify-center border border-gold-warm/10 relative z-10">
            <Sparkles className="w-10 h-10 text-gold-warm animate-pulse" />
          </div>
          <div className="space-y-3 relative z-10">
            <h4 className="text-4xl font-playfair font-black text-green-forest">El Despertar del Parque</h4>
            <p className="text-sm text-green-forest/30 max-w-sm mx-auto font-light leading-relaxed italic">
              Todo gran camino comienza con un primer paso sagrado. Publica tu primer evento para recibir a los buscadores.
            </p>
          </div>
          <button onClick={() => setActiveView('eventos')}
            className="px-10 py-5 bg-gold-warm text-white rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-green-forest transition-all shadow-premium relative z-10 active:scale-95">
            Crear Evento Maestro
          </button>
        </div>
      )}
    </motion.div>
  );

  /* ─── Render Reservations ─── */
  const renderReservations = () => {
    const pending = reservations.filter(r => r.estado === 'pendiente');
    const confirmed = reservations.filter(r => r.estado === 'confirmada');
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-20 lg:space-y-32 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
          <div className="space-y-2">
            <h3 className="text-4xl font-playfair font-black text-green-forest">Gestión de Almas</h3>
            <p className="text-[10px] font-black text-gold-warm/40 uppercase tracking-[0.4em] italic">Control de flujo y armonía en el territorio</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-gold-warm/5 px-6 py-3 rounded-2xl border border-gold-warm/10 shadow-premium">
              <div className="w-2.5 h-2.5 rounded-full bg-gold-warm animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gold-warm">Pendientes: {pending.length}</span>
            </div>
            <div className="flex items-center gap-3 bg-green-forest/5 px-6 py-3 rounded-2xl border border-green-forest/10 shadow-premium">
              <div className="w-2.5 h-2.5 rounded-full bg-green-forest/20" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-forest/40">Confirmadas: {confirmed.length}</span>
            </div>
          </div>
        </div>
        <ReservationTable title="Reservas por Manifestar" data={pending} onConfirm={(id) => handleUpdateStatus(id, 'confirmada')} onDelete={handleDelete} type="pending" />
        <ReservationTable title="Vínculos Confirmados" data={confirmed} onCancel={(id) => handleUpdateStatus(id, 'pendiente')} onDelete={handleDelete} type="confirmed" />
      </motion.div>
    );
  };

  /* ─── Render Events ─── */
  const renderEvents = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="space-y-12 pb-20 bg-[#F6EED6]"
      >
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-0 sm:px-4">
            <div className="space-y-2">
              <h3 className="text-3xl sm:text-4xl font-playfair font-bold text-[#004d26]">Gestión de eventos</h3>
              <p className="text-sm font-inter text-[#004d26]/65 leading-relaxed">
                Administra eventos activos, fechas, contenido publicado e historial.
              </p>
            </div>
            <button 
              onClick={() => {
                setEditingEvent(null);
                setShowEventModal(true);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] hover:text-[#004d26] transition-all duration-300 shadow-sm w-full sm:w-auto active:scale-95"
            >
              <Plus className="w-4 h-4" /> Crear evento
            </button>
          </div>

          {showEventModal && (
            <CreateEventModal 
              isOpen={showEventModal}
              onClose={() => {
                setShowEventModal(false);
                setEditingEvent(null);
              }}
              currentEvent={editingEvent}
              onSave={async (data) => {
                const isEditing = Boolean(editingEvent?.id);

                try {
                  const formData = new FormData();
                  formData.append('titulo',      data.titulo);
                  formData.append('descripcion', data.descripcion);
                  formData.append('fecha_inicio', `${data.fechaInicio}T${data.horaInicio}:00`);
                  formData.append('fecha_fin',    `${data.fechaFin}T${data.horaFin}:00`);
                  formData.append('hora_inicio',  data.horaInicio);
                  formData.append('hora_fin',     data.horaFin);
                  formData.append('estado',       data.estado || 'activo');
                  // Solo adjuntar imagen si viene un archivo nuevo
                  if (data.flyerFile) {
                    formData.append('imagen', data.flyerFile);
                  }

                  let response;
                  if (isEditing) {
                    // ── EDICIÓN: PUT /eventos/:id ──
                    const eventoId = editingEvent.id;
                    response = await fetch(`${API_BASE}/eventos/${eventoId}`, {
                      method: 'PUT',
                      body: formData,
                    });
                  } else {
                    // ── CREACIÓN: POST /crear-evento ──
                    response = await fetch(`${API_BASE}/crear-evento`, {
                      method: 'POST',
                      body: formData,
                    });
                  }

                  if (!response.ok) {
                    const errorText = await response.text();
                    console.warn('Error response text:', errorText.substring(0, 200));
                    let errorMessage = isEditing
                      ? 'Error al actualizar el evento. Verifica que la ruta PUT /eventos/:id existe en el backend.'
                      : 'Error al guardar el evento. Revisa la consola.';
                    try {
                      const errorData = JSON.parse(errorText);
                      errorMessage = errorData.message || errorMessage;
                    } catch (e) { /* Respuesta HTML o no-JSON */ }
                    throw new Error(errorMessage);
                  }

                  // Recargar el evento real desde la base de datos
                  let updatedEvent = null;
                  try {
                    updatedEvent = await fetchLatestEvent();
                  } catch (fetchErr) {
                    console.warn('No se pudo recargar el evento desde backend:', fetchErr.message);
                  }

                  if (updatedEvent) {
                    localStorage.setItem('evento_activo', JSON.stringify(updatedEvent));
                    setActiveEvent(updatedEvent);
                    window.dispatchEvent(new CustomEvent('eventoActivoActualizado', { detail: updatedEvent }));
                  } else {
                    // Fallback: usar los datos enviados con el flyer resuelto
                    const savedData = await response.clone().json().catch(() => ({}));
                    const flyerUrl = savedData?.evento?.flyer_url
                      ? (savedData.evento.flyer_url.startsWith('http')
                          ? savedData.evento.flyer_url
                          : `${API_BASE}/${savedData.evento.flyer_url}`)
                      : data.flyer?.src;
                    const fallback = { ...data, flyer: { src: flyerUrl } };
                    localStorage.setItem('evento_activo', JSON.stringify(fallback));
                    setActiveEvent(fallback);
                    window.dispatchEvent(new CustomEvent('eventoActivoActualizado', { detail: fallback }));
                  }

                  window.dispatchEvent(new Event('storage'));
                  setShowEventModal(false);
                  setEditingEvent(null);
                  return Promise.resolve();

                } catch (err) {
                  console.error(err);
                  alert('Error al guardar: ' + err.message);
                  return Promise.reject(err);
                }
              }}
            />
          )}

          {/* Active Event */}
          {activeEvent ? (
            <div className="bg-white/40 backdrop-blur-sm border border-[#004d26]/10 rounded-3xl shadow-md overflow-hidden flex flex-col lg:flex-row min-h-[500px] group">
              {/* Image Column */}
              <div className="w-full lg:w-[420px] bg-[#004d26]/5 p-4 sm:p-6 flex items-center justify-center relative shrink-0">
                {activeEvent.flyer?.src ? (
                  <img 
                    src={activeEvent.flyer.src} 
                    alt={activeEvent.titulo} 
                    className="max-h-[420px] w-full object-contain rounded-2xl shadow-sm transition-transform duration-1000 group-hover:scale-[1.02]" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4 text-[#004d26]/20 py-12">
                    <Calendar className="w-20 h-20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Sin imagen del evento</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-[#D4AF37] text-[#004d26] rounded-full text-[10px] font-bold uppercase tracking-[0.25em] shadow-sm">
                  Evento activo
                </div>
              </div>
              
              {/* Info Column */}
              <div className="flex-grow p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-[#004d26]">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-3xl lg:text-4xl font-playfair font-bold text-[#004d26] leading-tight tracking-tight">
                      {activeEvent.titulo}
                    </h4>
                    <p className="text-sm sm:text-base font-inter text-[#004d26]/70 leading-relaxed whitespace-pre-line">
                      {activeEvent.descripcion || 'Sin descripción disponible.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" /> Fecha de inicio
                      </p>
                      <div className="bg-white/45 p-4 rounded-2xl border border-[#004d26]/10">
                        <p className="text-lg font-playfair font-bold text-[#004d26]">{activeEvent.fechaInicio}</p>
                        <p className="text-xs font-inter text-[#004d26]/60 mt-1">{activeEvent.horaInicio}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004d26]/30" /> Fecha de cierre
                      </p>
                      <div className="bg-white/45 p-4 rounded-2xl border border-[#004d26]/10">
                        <p className="text-lg font-playfair font-bold text-[#004d26]">{activeEvent.fechaFin}</p>
                        <p className="text-xs font-inter text-[#004d26]/60 mt-1">{activeEvent.horaFin}</p>
                      </div>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.25em] flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Tiempo restante
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      {['Días', 'Horas', 'Mins', 'Segs'].map((unit, i) => (
                        <div key={unit} className="flex flex-col items-center gap-1.5">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/45 text-[#004d26] rounded-2xl flex items-center justify-center text-2xl font-playfair font-bold border border-[#004d26]/10 shadow-sm">
                            {timeLeft ? String(Object.values(timeLeft)[i]).padStart(2, '0') : '00'}
                          </div>
                          <span className="text-[9px] font-bold text-[#004d26]/60 uppercase tracking-widest">{unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 mt-8 border-t border-[#004d26]/10">
                  <button 
                    onClick={() => {
                      setEditingEvent(activeEvent);
                      setShowEventModal(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-white/50 text-[#004d26] border border-[#004d26]/10 rounded-full font-inter font-semibold hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Settings className="w-4 h-4" /> Editar evento
                  </button>
                  <button 
                    onClick={handleDeleteActiveEvent}
                    className="w-full sm:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-inter font-semibold transition-all text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar evento
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/40 border border-[#004d26]/10 rounded-3xl shadow-sm p-8 sm:p-12 lg:p-16 text-center space-y-6">
              <div className="w-16 h-16 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-playfair font-bold text-[#004d26]">Sin evento activo</h4>
                <p className="font-inter text-sm text-[#004d26]/60 max-w-md mx-auto">
                  No hay eventos activos publicados en este momento.
                </p>
              </div>
              <button 
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventModal(true);
                }} 
                className="px-8 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold text-xs tracking-wider uppercase hover:bg-[#D4AF37] hover:text-[#004d26] transition-all duration-300 shadow-sm active:scale-95"
              >
                Crear evento
              </button>
            </div>
          )}
        </div>

        {/* Scheduled Events */}
        {scheduledEvents.length > 0 && (
          <div className="space-y-12">
            <div className="px-4 space-y-2">
              <h3 className="text-3xl font-playfair font-bold text-[#004d26]">Eventos programados</h3>
              <p className="text-sm font-inter text-[#004d26]/60">Eventos pendientes de publicación.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scheduledEvents.map((ev, i) => (
                <div key={i} className="bg-white/40 border border-[#004d26]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col group hover:border-[#D4AF37]/45 transition-all duration-300">
                  <div className="h-64 relative overflow-hidden bg-[#004d26]/5 flex items-center justify-center">
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#D4AF37] text-[#004d26] rounded-full text-[9px] font-bold uppercase tracking-widest z-30 shadow-sm">PROGRAMADO</div>
                    {ev.imagen ? (
                      <img src={ev.imagen} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <Calendar className="w-16 h-16 text-[#004d26]/20" />
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col flex-1 space-y-6 text-[#004d26]">
                    <h4 className="text-2xl font-playfair font-bold text-[#004d26] leading-tight">{ev.titulo}</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#004d26]/60 uppercase">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" /> {ev.fecha}
                      </div>
                      <div className="bg-white/45 p-4 rounded-2xl border border-[#004d26]/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Publicación Automática</p>
                        <p className="text-xs font-medium mt-1">{new Date(ev.publish_date).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="pt-6 flex justify-end">
                      <button 
                        onClick={() => {
                          if (window.confirm('¿Eliminar programación?')) {
                            const newScheduled = scheduledEvents.filter((_, index) => index !== i);
                            localStorage.setItem('eventos_programados', JSON.stringify(newScheduled));
                            setScheduledEvents(newScheduled);
                            window.dispatchEvent(new Event('storage'));
                          }
                        }}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event History */}
        <div className="space-y-12">
          <div className="px-4 space-y-2">
            <h3 className="text-3xl font-playfair font-bold text-[#004d26]">Historial de eventos</h3>
            <p className="text-sm font-inter text-[#004d26]/60">Eventos finalizados y registros asociados.</p>
          </div>
          <div className="bg-white/40 border border-[#004d26]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-[#004d26]/8 border-b border-[#004d26]/10">
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/60">Evento</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/60">Fecha de inicio</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/60">Fecha de cierre</th>
                    <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/60 text-right">Registros asociados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#004d26]/10">
                  {Array.isArray(eventHistory) && eventHistory.length > 0 ? (
                    eventHistory.map((ev, i) => {
                      const resCount = reservations.filter(r => r.eventTitle === ev.titulo).length;
                      const logCount = logisticVisitors.filter(v => v.tipo_ingreso === ev.titulo).length;
                      return (
                        <tr key={i} className="hover:bg-white/30 transition-all duration-300 group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-20 rounded-xl bg-black overflow-hidden flex-shrink-0 shadow-sm group-hover:scale-102 transition-transform duration-500">
                                {ev.imagen ? (
                                  <img src={ev.imagen} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[#004d26]/20 bg-[#004d26]/5"><Calendar className="w-6 h-6" /></div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <p className="text-lg font-playfair font-bold text-[#004d26]">{ev.titulo}</p>
                                <span className="inline-block px-3 py-1 bg-white/5 text-[#004d26]/60 border border-[#004d26]/10 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] italic">Finalizado</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1 text-[#004d26]/70">
                              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider"><Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {ev.fecha}</div>
                              <div className="text-[10px] font-inter text-[#004d26]/50 uppercase tracking-widest ml-5">{ev.hora || ev.horaInicio}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="space-y-1 text-[#004d26]/70">
                              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider"><Calendar className="w-3.5 h-3.5 text-[#004d26]/30" /> {ev.fechaFin}</div>
                              <div className="text-[10px] font-inter text-[#004d26]/50 uppercase tracking-widest ml-5">{ev.horaFin}</div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-60 group-hover:opacity-100 transition-all duration-300">
                              <button onClick={() => setViewHistoryEvent(ev)} className="px-4 py-2 bg-white/60 text-[#004d26] border border-[#004d26]/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37] hover:text-[#004d26] transition-all flex items-center gap-2 shadow-sm">
                                <Globe className="w-3.5 h-3.5" /> Reservas Web ({resCount})
                              </button>
                              <button onClick={() => setViewHistoryEvent(ev)} className="px-4 py-2 bg-white/60 text-[#004d26] border border-[#004d26]/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#004d26] hover:text-[#F6EED6] transition-all flex items-center gap-2 shadow-sm">
                                <UserCheck className="w-3.5 h-3.5" /> Ingresos Puerta ({logCount})
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-16 text-center text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/40 italic bg-white/20">
                        No hay eventos finalizados registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${activeView === 'eventos' ? 'bg-[#F6EED6]' : 'bg-beige-linen'} flex font-inter relative overflow-hidden selection:bg-gold-warm/30 selection:text-white`}>
      {/* Cinematic Ambient Overlays */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.02] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-gold-warm/[0.03] via-transparent to-transparent pointer-events-none" />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60] lg:hidden backdrop-blur-xl"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-green-deep border-r border-white/5 flex flex-col shadow-[10px_0_50px_rgba(0,0,0,0.5)] shrink-0 z-[70] transform transition-all duration-700 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-10 flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-gold-warm/10 rounded-2xl border border-gold-warm/20 group-hover:bg-gold-warm/20 transition-all duration-700">
              <Leaf className="w-8 h-8 text-gold-warm animate-float" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-playfair font-black text-white tracking-tighter leading-none">IGLE</span>
              <span className="text-[10px] font-black text-gold-warm uppercase tracking-[0.4em] mt-1 italic">Admin Panel</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 pt-6 overflow-y-auto custom-scrollbar">
          <div className="px-10 mb-6">
            <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em] mb-4">Navegación</p>
          </div>
          {sections.map((item) => (
            <SidebarItem 
              key={item.id} 
              icon={item.icon} 
              label={item.label} 
              active={activeView === item.id} 
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }} 
            />
          ))}
        </nav>

        <div className="p-10 border-t border-white/5 bg-black/20">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 h-screen overflow-y-auto w-full custom-scrollbar relative">
        {/* Floating Mobile Header/Menu */}
        <div className="lg:hidden sticky top-0 z-50 p-4 flex items-center justify-between bg-beige-cream/80 backdrop-blur-md border-b border-gold-warm/10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-warm/10 rounded-xl border border-gold-warm/20"><Leaf className="w-5 h-5 text-gold-warm" /></div>
            <span className="text-lg font-playfair font-black text-green-forest tracking-tight">IGLE</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 bg-gold-warm/10 rounded-xl text-gold-warm border border-gold-warm/20 shadow-sm active:scale-95 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 lg:p-20 max-w-[1800px] mx-auto relative z-10">
          <header className="hidden lg:flex items-center justify-between mb-20">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-gold-warm uppercase tracking-[0.5em] italic">Panel Administrativo</p>
              <h2 className="text-6xl font-playfair font-black text-green-forest tracking-tighter">
                {activeView === 'dashboard' ? 'Bienvenido' : 
                 activeView === 'reservas' ? 'Reservas' : 
                 activeView === 'eventos' ? 'Eventos' : 
                 activeView === 'asistente' ? 'Asistente Virtual' :
                 activeView === 'turismo' ? 'Destino Anolaima' :
                 activeView === 'estaciones' ? 'Estaciones' :
                 activeView === 'estadisticas' ? 'Gestión de Datos' : 'Configuración del Sistema'}
              </h2>
            </div>
            
            <div className="flex items-center gap-6 bg-white/50 backdrop-blur-xl px-8 py-4 rounded-[2rem] border border-gold-warm/10 shadow-premium">
              <div className="text-right">
                <p className="text-[10px] font-black text-green-forest uppercase tracking-widest">Administrador</p>
                <p className="text-[9px] text-gold-warm font-medium italic tracking-widest mt-0.5 uppercase">Sesión segura</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gold-warm/10 flex items-center justify-center text-gold-warm font-playfair font-black text-2xl border border-gold-warm/20 shadow-inner">A</div>
            </div>
          </header>

          {/* Mobile Title Display */}
          <div className="lg:hidden mb-8">
            <h2 className="text-3xl font-playfair font-black text-green-forest tracking-tight">
              {activeView === 'dashboard' ? 'Bienvenido' : 
               activeView === 'reservas' ? 'Reservas' : 
               activeView === 'eventos' ? 'Eventos' : 
               activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h2>
            <div className="w-8 h-1 bg-gold-warm mt-3 rounded-full opacity-60" />
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'dashboard' ? <React.Fragment key="db">{renderDashboard()}</React.Fragment> : 
             activeView === 'reservas' ? <React.Fragment key="res">{renderReservations()}</React.Fragment> :
             activeView === 'eventos' ? <React.Fragment key="evt">{renderEvents()}</React.Fragment> :
             activeView === 'estadisticas' ? (
               <React.Fragment key="stats">
                 <EstadisticasPanel
                   reservations={reservations}
                   logisticVisitors={logisticVisitors}
                   eventHistory={eventHistory}
                   activeEvent={activeEvent}
                 />
               </React.Fragment>
             ) :
             activeView === 'configuracion' ? <React.Fragment key="cfg"><ConfiguracionPanel /></React.Fragment> :
             activeView === 'turismo' ? <React.Fragment key="tur"><TurismoPanel /></React.Fragment> :
             activeView === 'estaciones' ? <React.Fragment key="est"><EstacionesPanel /></React.Fragment> :
             activeView === 'asistente' ? (
                <React.Fragment key="asist">
                  <VirtualAssistantAdmin />
                </React.Fragment>
              ) : (
                <motion.div key="other" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-white/10">
                  <Settings className="w-12 h-12 mx-auto mb-4 animate-spin-slow opacity-20" />
                  <p className="text-sm font-playfair italic">Sección en construcción espiritual</p>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {viewHistoryEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setViewHistoryEvent(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-5xl bg-[#F6EED6] border border-[#004d26]/10 rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-[#004d26]"
            >
              <div className="bg-[#004d26]/5 px-6 sm:px-10 py-6 sm:py-8 border-b border-[#004d26]/10 flex items-center justify-between backdrop-blur-md shrink-0">
                <div>
                  <h3 className="text-xl sm:text-2xl font-playfair font-bold text-[#004d26]">{viewHistoryEvent.titulo}</h3>
                  <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.25em] mt-1">Registros históricos de visitantes</p>
                </div>
                <button onClick={() => setViewHistoryEvent(null)} className="p-2.5 rounded-full bg-white/50 border border-[#004d26]/10 hover:bg-[#D4AF37] hover:text-[#004d26] text-[#004d26] transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 sm:p-10 overflow-y-auto space-y-12 custom-scrollbar">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20"><Globe className="w-4 h-4" /></div>
                    <h4 className="text-lg font-playfair font-bold text-[#004d26]">Reservas Web Confirmadas</h4>
                  </div>
                  <div className="bg-white/40 border border-[#004d26]/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[600px]">
                        <thead className="bg-[#004d26]/8 text-[#004d26]/60 text-[9px] font-bold uppercase tracking-[0.2em] border-b border-[#004d26]/10">
                          <tr><th className="px-6 py-3">Nombre</th><th className="px-6 py-3">Edad</th><th className="px-6 py-3">Género</th><th className="px-6 py-3">Nacionalidad</th><th className="px-6 py-3">WhatsApp</th></tr>
                        </thead>
                        <tbody className="divide-y divide-[#004d26]/10 text-[#004d26]/70">
                          {reservations.filter(r => r.eventTitle === viewHistoryEvent.titulo && r.estado === 'confirmada').map((r, i) => (
                            <tr key={i} className="hover:bg-white/30 transition-all"><td className="px-6 py-3 font-playfair font-bold text-base text-[#004d26]">{r.nombre}</td><td className="px-6 py-3">{r.edad}</td><td className="px-6 py-3 capitalize italic">{r.genero}</td><td className="px-6 py-3">{r.nacionalidad || '-'}</td><td className="px-6 py-3 text-[#D4AF37] font-semibold">{r.whatsapp}</td></tr>
                          ))}
                          {reservations.filter(r => r.eventTitle === viewHistoryEvent.titulo && r.estado === 'confirmada').length === 0 && (
                            <tr><td colSpan="5" className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-widest text-[#004d26]/40 italic">No hay reservas web registradas para este evento.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20"><UserCheck className="w-4 h-4" /></div>
                    <h4 className="text-lg font-playfair font-bold text-[#004d26]">Ingresos Puerta</h4>
                  </div>
                  <div className="bg-white/40 border border-[#004d26]/10 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm min-w-[500px]">
                        <thead className="bg-[#004d26]/8 text-[#004d26]/60 text-[9px] font-bold uppercase tracking-[0.2em] border-b border-[#004d26]/10">
                          <tr><th className="px-6 py-3">Edad</th><th className="px-6 py-3">Género</th><th className="px-6 py-3">Nacionalidad</th><th className="px-6 py-3">Fecha de Ingreso</th></tr>
                        </thead>
                        <tbody className="divide-y divide-[#004d26]/10 text-[#004d26]/70">
                          {logisticVisitors.filter(r => r.tipo_ingreso === viewHistoryEvent.titulo).map((r, i) => (
                            <tr key={i} className="hover:bg-white/30 transition-all"><td className="px-6 py-3">{r.edad}</td><td className="px-6 py-3 capitalize italic">{r.genero}</td><td className="px-6 py-3">{r.nacionalidad || '-'}</td><td className="px-6 py-3 font-medium">{r.fecha}</td></tr>
                          ))}
                          {logisticVisitors.filter(r => r.tipo_ingreso === viewHistoryEvent.titulo).length === 0 && (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-[10px] font-bold uppercase tracking-widest text-[#004d26]/40 italic">No hay ingresos por puerta registrados para este evento.</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
