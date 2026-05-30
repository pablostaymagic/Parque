import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, Globe, Phone, MapPin, CheckCircle,
  X, ImageIcon, Tag, ChevronDown, AlertCircle, Compass
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/turismo';

const CATEGORIAS = [
  'Restaurantes', 'Piscinas', 'Alojamientos', 'Senderismo', 'Sitios Turísticos', 'Otro'
];

const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/45 border border-[#004d26]/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#004d26] text-sm transition-all duration-300 font-inter';
const labelCls = 'block font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2';

/* ─── Toast ─── */
const Toast = ({ msg, type }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 20, x: '-50%' }}
    className={`fixed bottom-12 left-1/2 z-[300] flex items-center gap-3 px-6 py-3.5 rounded-full shadow-lg font-inter text-sm font-semibold border ${
      type === 'success'
        ? 'bg-[#004d26] text-[#F6EED6] border-[#D4AF37]/20'
        : 'bg-[#ef4444] text-white border-red-400/20'
    }`}
  >
    {type === 'success' ? <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> : <AlertCircle className="w-5 h-5 text-white" />}
    {msg}
  </motion.div>
);

/* ─── Empty form ─── */
const emptyForm = () => ({
  id: null,
  nombre: '',
  descripcion_principal: '',
  categoria: '',
  telefono: '',
  maps: '',
  redes_sociales: '',
  visibilidad: 'ACTIVO',
  media: []
});

/* ─── Multi File Upload ─── */
const MultiMediaInput = ({ media, onAddFiles, onRemoveFile }) => {
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    onAddFiles(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="flex items-center gap-2 px-6 py-3 bg-white/45 border border-[#004d26]/10 hover:bg-[#D4AF37]/15 text-[#004d26] rounded-xl font-inter text-sm font-semibold transition duration-200 shadow-sm"
        >
          <ImageIcon className="w-5 h-5 text-[#D4AF37]" /> Subir Fotos o Videos
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          <AnimatePresence>
            {media.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="aspect-video w-full rounded-xl overflow-hidden border border-[#004d26]/10 bg-white/40 relative group"
              >
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover" controls={false} muted />
                ) : (
                  <img src={item.url} alt="media preview" className="w-full h-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-full transition duration-150"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/50 text-[10px] text-white font-medium rounded">
                  {item.isExisting ? 'En Servidor' : 'Para Subir'}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PANEL
   ══════════════════════════════════════════ */
const TurismoPanel = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [archivosBorrados, setArchivosBorrados] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const loadItems = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al consultar base de datos');
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Error cargando destinos turísticos.', 'error');
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm(emptyForm());
    setArchivosBorrados([]);
    setShowForm(true);
  };

  const openEdit = (item) => {
    // Map existing media strings to files preview structure
    const mappedMedia = (item.contenido_media || []).map((filePath, idx) => ({
      id: `existing_${idx}_${Date.now()}`,
      isExisting: true,
      path: filePath,
      type: filePath.match(/\.(mp4|mov)$/i) ? 'video' : 'image',
      name: filePath.split('/').pop(),
      url: `http://localhost:3000${filePath}`
    }));

    // Map redes_sociales array back to comma-separated text
    const redesText = Array.isArray(item.redes_sociales)
      ? item.redes_sociales.join(', ')
      : (item.redes_sociales || '');

    setForm({
      id: item.id,
      nombre: item.nombre || '',
      descripcion_principal: item.descripcion_principal || '',
      categoria: item.categoria || '',
      telefono: item.telefono || '',
      maps: item.maps || '',
      redes_sociales: redesText,
      visibilidad: item.visibilidad || 'ACTIVO',
      media: mappedMedia
    });
    setArchivosBorrados([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm());
    setArchivosBorrados([]);
  };

  const handleAddFiles = (files) => {
    const newMedia = files.map(file => ({
      id: `new_${Date.now()}_${Math.round(Math.random() * 1E9)}`,
      file: file,
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      isExisting: false
    }));
    setForm(f => ({ ...f, media: [...f.media, ...newMedia] }));
  };

  const handleRemoveFile = (index) => {
    const removed = form.media[index];
    if (removed && removed.isExisting) {
      setArchivosBorrados(prev => [...prev, removed.path]);
    }
    const updatedMedia = [...form.media];
    updatedMedia.splice(index, 1);
    setForm(f => ({ ...f, media: updatedMedia }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!form.nombre.trim() || !form.descripcion_principal.trim()) {
      showToast('Campos obligatorios incompletos.', 'error');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('nombre', form.nombre.trim());
      payload.append('descripcion_principal', form.descripcion_principal.trim());
      payload.append('categoria', form.categoria || '');
      payload.append('telefono', form.telefono || '');
      payload.append('maps', form.maps || '');
      payload.append('visibilidad', form.visibilidad || 'ACTIVO');

      // Parse redes_sociales to JSONB Array
      const redesArr = form.redes_sociales
        ? form.redes_sociales.split(',').map(link => link.trim()).filter(Boolean)
        : [];
      payload.append('redes_sociales', JSON.stringify(redesArr));

      // Append preserved existing media
      const existingMedia = form.media.filter(m => m.isExisting).map(m => m.path);
      payload.append('existingMedia', JSON.stringify(existingMedia));
      payload.append('archivosBorrados', JSON.stringify(archivosBorrados));

      // Append new files
      form.media.filter(m => !m.isExisting && m.file).forEach(m => {
        payload.append('archivos[]', m.file);
      });

      const url = form.id ? `${API_URL}/${form.id}` : API_URL;
      const method = form.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        body: payload
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al conectar con la base de datos');
      }

      const resData = await res.json();
      if (resData.success) {
        showToast(form.id ? 'Destino actualizado correctamente' : 'Destino creado correctamente');
        closeForm();
        loadItems();
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Error al guardar el destino', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este destino del mapa turístico?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al conectar con la base de datos');
      const resData = await res.json();
      if (resData.success) {
        showToast('Destino removido del mapa.');
        loadItems();
      }
    } catch (error) {
      console.error(error);
      showToast('Error al eliminar destino.', 'error');
    }
  };

  const field = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const visible = items;
  const publishedCount = items.filter(i => (i.visibilidad || 'ACTIVO') === 'ACTIVO').length;

  // Helper to visually normalize category names
  const formatCategoryName = (cat) => {
    const c = (cat || '').toLowerCase().trim();
    if (c === 'restaurantes' || c === 'restaurante') return 'Restaurantes';
    if (c === 'piscinas' || c === 'piscina') return 'Piscinas';
    if (c === 'alojamientos' || c === 'alojamiento' || c === 'hotel' || c === 'hoteles') return 'Alojamientos';
    if (c === 'senderismo' || c === 'senderos') return 'Senderismo';
    if (c === 'sitios turísticos' || c === 'sitio turístico' || c === 'sitios turisticos' || c === 'sitio turistico' || c === 'mirador' || c === 'miradores') return 'Sitios Turísticos';
    if (c === 'parque' || c === 'parques') return 'Parques';
    return cat || 'Otros Destinos';
  };

  // Group items by category dynamically
  const destinosPorCategoria = useMemo(() => {
    return visible.reduce((acc, item) => {
      const rawCat = item.categoria?.trim() || 'Otro';
      const cat = formatCategoryName(rawCat);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [visible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full min-h-screen relative overflow-hidden"
      style={{ background: '#F6EED6', padding: '24px 16px md:p-8' }}
    >
      {/* Cinematic & Spiritual lights */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#004d26]/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 py-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 border-b border-[#004d26]/5 pb-8">
          <div className="space-y-1">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#004d26] leading-tight mb-2">Turismo y destinos</h1>
            <p className="font-inter text-sm font-normal text-[#004d26]/70 leading-relaxed max-w-2xl">
              Administra los sitios turísticos, restaurantes, piscinas y puntos de interés de Anolaima desde un solo lugar.
            </p>
            <p className="font-inter text-xs text-[#D4AF37] font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
              <span>{publishedCount} destinos públicos</span>
              <span className="text-[#004d26]/20">•</span>
              <span>{items.length} sitios registrados</span>
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-300 shadow-sm active:scale-95 w-full sm:w-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-current" /> Agregar nuevo destino
          </button>
        </div>

        {/* Categories Grouped Items */}
        <div className="space-y-12">
          {visible.length === 0 ? (
            <div className="text-center py-20 bg-white/35 border border-[#004d26]/10 rounded-3xl backdrop-blur-sm max-w-2xl mx-auto shadow-sm">
              <Compass className="w-12 h-12 mx-auto text-[#D4AF37] mb-4" />
              <h2 className="font-playfair text-2xl font-bold text-[#004d26] mb-3">Aún no hay destinos registrados</h2>
              <p className="font-inter text-sm text-[#004d26]/60 max-w-md mx-auto mb-6">
                Agrega el primer sitio turístico para comenzar a organizar la oferta de Anolaima.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-300"
              >
                <Plus className="w-4 h-4" /> Agregar primer destino
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {Object.entries(destinosPorCategoria).map(([categoria, list]) => {
                if (list.length === 0) return null;
                return (
                  <section key={categoria} className="mb-12">
                    <div className="flex items-center justify-between gap-3 mb-6 pb-2 border-b border-[#004d26]/5">
                      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#004d26] m-0">
                        {categoria}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-3.5 py-1.5">
                        {list.length} {list.length === 1 ? 'sitio' : 'sitios'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {list.map(item => {
                        const hasMedia = item.contenido_media && item.contenido_media.length > 0;
                        const mainMediaPath = hasMedia ? item.contenido_media[0] : null;
                        const isVideo = mainMediaPath ? mainMediaPath.match(/\.(mp4|mov)$/i) : false;

                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-[#F6EED6]/90 border border-[#004d26]/10 rounded-3xl overflow-hidden flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full backdrop-blur-sm"
                          >
                            {/* Media */}
                            <div className="h-48 bg-white/10 relative overflow-hidden flex-shrink-0 border-b border-[#004d26]/10">
                              {hasMedia ? (
                                isVideo ? (
                                  <video src={`http://localhost:3000${mainMediaPath}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" muted />
                                ) : (
                                  <img src={`http://localhost:3000${mainMediaPath}`} alt={item.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )
                              ) : (
                                <div className="flex items-center justify-center h-full text-[#D4AF37]/40">
                                  <MapPin className="w-12 h-12" />
                                </div>
                              )}

                              {/* Status Badges */}
                              <div className="absolute top-3 left-3">
                                <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                                  (item.visibilidad || 'ACTIVO') === 'ACTIVO'
                                    ? 'bg-[#004d26] text-[#F6EED6]'
                                    : 'bg-[#ef4444] text-white'
                                }`}>
                                  {item.visibilidad || 'ACTIVO'}
                                </span>
                              </div>

                              {item.categoria && (
                                <div className="absolute top-3 right-3">
                                  <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-[#004d26] font-inter text-[10px] font-bold uppercase tracking-[0.25em] flex items-center gap-1.5 border border-[#004d26]/5">
                                    <Tag className="w-3 h-3 text-[#D4AF37]" /> {formatCategoryName(item.categoria)}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-grow">
                              <h4 className="font-playfair text-xl font-bold text-[#004d26] mb-2 leading-tight">{item.nombre}</h4>
                              <p className="font-inter text-sm text-[#004d26]/70 line-clamp-3 leading-relaxed flex-grow mb-5">{item.descripcion_principal}</p>

                              <div className="flex flex-col gap-2 pt-4 border-t border-[#004d26]/10 mb-5">
                                <div className="flex items-center gap-2 text-xs font-inter text-[#004d26]/60">
                                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> {item.telefono || 'Sin contacto'}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-inter text-[#004d26]/60">
                                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {item.maps ? 'Ver en Google Maps' : 'Sin ubicación'}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEdit(item)}
                                  className="flex-grow px-4 py-2 bg-white/45 border border-[#004d26]/10 hover:bg-[#D4AF37]/15 text-[#004d26] rounded-full transition duration-200 flex items-center justify-center gap-2 text-xs font-semibold shadow-sm"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-[#D4AF37]" /> Editar
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="px-3.5 py-2 bg-white/45 border border-[#004d26]/10 hover:bg-[#ef4444]/10 text-[#ef4444] rounded-full transition duration-200 flex items-center justify-center shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#004d26]/60 backdrop-blur-sm"
              onClick={closeForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-4xl bg-[#F6EED6] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col border border-[#004d26]/15 max-h-[90vh] backdrop-blur-sm"
            >
              {/* Modal header */}
              <div className="bg-[#F6EED6]/50 px-6 py-5 flex items-center justify-between border-b border-[#004d26]/10">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#004d26]">
                    {form.id ? 'Editar Destino Turístico' : 'Agregar nuevo destino'}
                  </h2>
                  <p className="font-inter text-xs text-[#004d26]/60 mt-0.5">Complete los detalles para sincronizar la oferta de Anolaima.</p>
                </div>
                <button
                  onClick={closeForm}
                  className="p-2 text-[#004d26]/40 hover:text-[#004d26] hover:bg-[#004d26]/5 rounded-full transition duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                {/* Basic Info */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <h3 className="font-playfair text-base font-bold text-[#004d26] mb-4">Información Principal</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className={labelCls}>Nombre del Destino *</label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={e => field('nombre', e.target.value)}
                        placeholder="Nombre del lugar..."
                        className={inputCls}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Categoría</label>
                      <div className="relative">
                        <select
                          value={form.categoria}
                          onChange={e => field('categoria', e.target.value)}
                          className={inputCls + ' appearance-none pr-10'}
                        >
                          <option value="">Seleccione una categoría</option>
                          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004d26]/50 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Visibilidad</label>
                      <div className="relative">
                        <select
                          value={form.visibilidad || 'ACTIVO'}
                          onChange={e => field('visibilidad', e.target.value)}
                          className={inputCls + ' appearance-none pr-10'}
                        >
                          <option value="ACTIVO">ACTIVO</option>
                          <option value="INACTIVO">INACTIVO</option>
                          <option value="OCULTO">OCULTO</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004d26]/50 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Descripción Principal *</label>
                    <textarea
                      value={form.descripcion_principal}
                      onChange={e => field('descripcion_principal', e.target.value)}
                      placeholder="Descripción completa del destino turístico..."
                      rows={4}
                      className={inputCls + ' resize-none'}
                      required
                    />
                  </div>
                </div>

                {/* Contact and Location */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <h3 className="font-playfair text-base font-bold text-[#004d26] mb-4">Contacto y Ubicación</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Enlace a Google Maps (URL)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                        <input
                          type="url"
                          value={form.maps}
                          onChange={e => field('maps', e.target.value)}
                          placeholder="https://maps.google.com/..."
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Teléfono</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                        <input
                          type="tel"
                          value={form.telefono}
                          onChange={e => field('telefono', e.target.value)}
                          placeholder="+57..."
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Redes Sociales (URLs separadas por comas)</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                        <input
                          type="text"
                          value={form.redes_sociales}
                          onChange={e => field('redes_sociales', e.target.value)}
                          placeholder="https://instagram.com/perfil, https://facebook.com/pagina..."
                          className={inputCls + ' pl-10'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image / Video Upload */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <h3 className="font-playfair text-base font-bold text-[#004d26] mb-4">Contenido Media (Fotos y Videos)</h3>
                  <MultiMediaInput
                    media={form.media}
                    onAddFiles={handleAddFiles}
                    onRemoveFile={handleRemoveFile}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-[#004d26]/10">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2.5 bg-white/40 text-[#004d26] border border-[#004d26]/10 rounded-full font-inter font-semibold text-sm hover:bg-[#D4AF37]/15 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold text-sm hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-200"
                  >
                    {form.id ? 'Guardar Cambios' : 'Crear Destino'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} />}</AnimatePresence>
    </motion.div>
  );
};

export default TurismoPanel;
