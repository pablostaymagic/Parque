import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, X, Upload, Trash2, Film, Edit, ExternalLink, Package, Sparkles, AlertTriangle, Eye, EyeOff, LayoutPanelLeft, Plus, Clock, Globe, UserCheck, AlertCircle, CheckCircle, ZoomIn, Image } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusBadgeClass = (status) => {
  const normalized = String(status || '').toUpperCase();

  if (normalized === 'ACTIVO') {
    return 'bg-emerald-500 text-white border-emerald-300 shadow-md';
  }
  if (normalized === 'INACTIVO') {
    return 'bg-zinc-500 text-white border-zinc-300 shadow-md';
  }
  if (normalized === 'OCULTO') {
    return 'bg-amber-500 text-[#004d26] border-amber-300 shadow-md';
  }
  if (normalized === 'BORRADOR') {
    return 'bg-slate-500 text-white border-slate-300 shadow-md';
  }
  return 'bg-[#F6EED6]/95 text-[#004d26] border-[#D4AF37]/30 shadow-md';
};

/* ─── Station Gallery Component ─── */
const StationGallery = ({ station, onClose, API_URL }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const galleryRef = useRef(null);

  // Build media array from station
  const allMedia = (station.media || []).map(path => ({
    url: path.startsWith('http') ? path : `http://localhost:3000${path}`,
    type: (typeof path === 'string' && path.match(/\.(mp4|mov)$/i)) ? 'video' : 'image',
    label: station.nombre_estacion
  }));

  const handleNext = useCallback(() => {
    if (allMedia.length > 0) setCurrentIndex(prev => (prev + 1) % allMedia.length);
  }, [allMedia.length]);

  const handlePrev = useCallback(() => {
    if (allMedia.length > 0) setCurrentIndex(prev => (prev - 1 + allMedia.length) % allMedia.length);
  }, [allMedia.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxItem) {
        if (e.key === 'Escape') setLightboxItem(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); handlePrev(); }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, lightboxItem, onClose]);

  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); }
    setTouchStart(null);
  };

  const currentMedia = allMedia[currentIndex];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[900] overflow-y-auto"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="min-h-full flex items-start justify-center py-8 px-4">
          <motion.div
            ref={galleryRef}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            className="bg-[#F6EED6] rounded-[2rem] w-full max-w-[1200px] overflow-hidden relative border border-[#004d26]/10"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 bg-white/80 border border-[#004d26]/10 rounded-full w-10 h-10 flex items-center justify-center text-[#004d26] hover:bg-[#D4AF37]/20 transition-all shadow-sm cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Main carousel */}
            {allMedia.length > 0 ? (
              <div
                className="relative w-full h-[250px] sm:h-[300px] lg:h-[400px] bg-black/10 overflow-hidden select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {/* Current media */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    {currentMedia?.type === 'video' ? (
                      <video src={currentMedia.url} className="w-full h-full object-cover" controls playsInline />
                    ) : (
                      <img
                        src={currentMedia?.url}
                        alt={currentMedia?.label}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setLightboxItem(currentMedia)}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=Imagen+No+Disponible'; }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Counter */}
                <div className="absolute top-4 right-16 z-20 bg-black/60 text-white px-4 py-2 rounded-full font-inter text-[0.85rem] font-semibold">
                  {currentIndex + 1} / {allMedia.length}
                </div>

                {/* Prev/Next */}
                {allMedia.length > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200"
                      style={{ background: 'rgba(0,0,0,0.4)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(-50%)'; }}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] lg:w-[50px] lg:h-[50px] rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all duration-200"
                      style={{ background: 'rgba(0,0,0,0.4)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(-50%)'; }}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Thumbnails */}
                {allMedia.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center gap-3 px-4 pb-4 pt-10" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}>
                    {allMedia.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] lg:w-[80px] lg:h-[80px] rounded-lg overflow-hidden shrink-0 border-[3px] cursor-pointer transition-all duration-200 ${i === currentIndex ? 'border-white shadow-[0_0_0_2px_rgba(255,255,255,0.9)] scale-105' : 'border-transparent hover:border-white/70 opacity-80 hover:opacity-100'}`}
                      >
                        {m.type === 'video' ? (
                          <div className="w-full h-full bg-black/50 flex items-center justify-center text-white">
                            <Film className="w-5 h-5" />
                          </div>
                        ) : (
                          <img src={m.url} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[250px] sm:h-[300px] lg:h-[400px] bg-white/10 flex flex-col items-center justify-center text-[#D4AF37]/50 gap-3">
                <Image className="w-16 h-16" />
                <span className="font-inter text-[0.95rem] font-semibold text-[#004d26]/40">Sin contenido multimedia</span>
              </div>
            )}

            {/* Station info + grid + subestaciones */}
            <div className="p-6 sm:p-8 lg:p-10 bg-transparent">
              {/* Station header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-playfair text-2xl lg:text-3xl font-bold text-[#004d26] leading-tight mb-2">
                    {station.nombre_estacion}
                  </h2>
                  <p className="font-inter text-sm text-[#004d26]/75 leading-[1.6] max-w-4xl font-medium">
                    {station.descripcion_principal}
                  </p>
                </div>
                <span className="shrink-0 bg-white/80 border border-[#004d26]/10 px-3.5 py-1.5 rounded-xl font-inter text-sm font-bold text-[#004d26] shadow-sm">#{station.orden}</span>
              </div>

              {/* Subestaciones */}
              {subs.length > 0 && (
                <div className="mt-8 border-t border-[#004d26]/10 pt-8">
                  <h3 className="font-playfair text-xl font-bold text-[#004d26] mb-6 flex items-center gap-2">
                    <LayoutPanelLeft className="w-5 h-5 text-[#D4AF37]" /> Subestaciones de la Ruta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subs.map((sub, idx) => {
                      const subMedia = (sub.media || []).map(path => ({
                        url: path.startsWith('http') ? path : `http://localhost:3000${path}`,
                        type: (typeof path === 'string' && path.match(/\.(mp4|mov)$/i)) ? 'video' : 'image'
                      }));

                      return (
                        <div key={idx} className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 backdrop-blur-sm shadow-sm flex flex-col justify-between">
                          <div>
                            <h4 className="font-playfair text-lg font-bold text-[#004d26] mb-2">{sub.nombre || `Subestación ${idx + 1}`}</h4>
                            <p className="font-inter text-sm text-[#004d26]/70 mb-4 leading-relaxed font-medium">{sub.description || sub.descripcion || 'Sin descripción.'}</p>
                          </div>

                          {subMedia.length > 0 && (
                            <div className="flex flex-wrap gap-2.5 mt-2">
                              {subMedia.map((m, fileIdx) => (
                                <div
                                  key={fileIdx}
                                  onClick={() => setLightboxItem(m)}
                                  className="w-14 h-14 rounded-lg overflow-hidden border border-[#004d26]/10 cursor-zoom-in bg-black/10 relative group"
                                >
                                  {m.type === 'video' ? (
                                    <div className="w-full h-full bg-black/50 flex items-center justify-center text-white">
                                      <Film className="w-3.5 h-3.5" />
                                    </div>
                                  ) : (
                                    <img src={m.url} alt="" className="w-full h-full object-cover" />
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <ZoomIn className="w-5 h-5 text-white drop-shadow-lg" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[950] flex items-center justify-center p-8"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-8 right-8 bg-transparent border-none text-white text-[2rem] cursor-pointer hover:text-[#D4AF37] transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
            >
              {lightboxItem.type === 'video' ? (
                <video src={lightboxItem.url} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg object-contain" />
              ) : (
                <img src={lightboxItem.url} alt="" className="max-w-full max-h-[90vh] rounded-lg object-contain" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const EstacionesPanel = () => {
  // --- ESTADOS ---
  const [estaciones, setEstaciones] = useState([]);
  const [formData, setFormData] = useState({
    numero_estacion: '',
    visibilidad: 'ACTIVO',
    nombre_estacion: '',
    descripcion_principal: '',
    media: [] // Objetos { id, file, name, type, url, isExisting: bool }
  });
  const [subestaciones, setSubestaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [galleryStation, setGalleryStation] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [archivosBorrados, setArchivosBorrados] = useState([]);

  const fileInputRef = useRef(null);
  const API_URL = 'http://localhost:3000/api/estaciones';

  // --- CARGA INICIAL ---
  const fetchEstaciones = async () => {
    setListLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data && data.success) {
        setEstaciones(Array.isArray(data.data) ? data.data : []);
      } else {
        setEstaciones([]);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchEstaciones();
  }, []);

  // --- HELPERS ---
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const resetForm = () => {
    setFormData({
      numero_estacion: '',
      visibilidad: 'ACTIVO',
      nombre_estacion: '',
      descripcion_principal: '',
      media: []
    });
    setSubestaciones([]);
    setArchivosBorrados([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleOpenEdit = async (estacion) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${estacion.id}`);
      const data = await res.json();
      if (data.success) {
        const fullEstacion = data.data;
        setFormData({
          numero_estacion: fullEstacion.orden,
          visibilidad: fullEstacion.visibilidad ? fullEstacion.visibilidad.toUpperCase() : 'ACTIVO',
          nombre_estacion: fullEstacion.nombre_estacion,
          descripcion_principal: fullEstacion.descripcion_principal,
          media: (fullEstacion.media || []).map(path => ({
            id: uuidv4(),
            url: `http://localhost:3000${path}`,
            path: path,
            name: path.split('/').pop(),
            type: path.match(/\.(mp4|mov)$/i) ? 'video' : 'image',
            isExisting: true
          }))
        });
        setSubestaciones((fullEstacion.subestaciones || []).map(sub => ({
          ...sub,
          media: (sub.media || []).map(path => ({
            id: uuidv4(),
            url: `http://localhost:3000${path}`,
            path: path,
            name: path.split('/').pop(),
            type: path.match(/\.(mp4|mov)$/i) ? 'video' : 'image',
            isExisting: true
          }))
        })));
        setEditingId(estacion.id);
        setIsEditing(true);
        setShowModal(true);
      }
    } catch (error) {
      showMessage('❌ Error al cargar detalles de la estación', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Deseas eliminar esta estación? Se borrarán también sus subestaciones y archivos físicos.')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showMessage('🗑 Estación eliminada correctamente');
        fetchEstaciones();
        if (showModal) setShowModal(false);
      }
    } catch (error) {
      showMessage('❌ Error al eliminar', 'error');
    }
  };

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubestacionChange = (index, field, value) => {
    const newSubs = [...subestaciones];
    newSubs[index][field] = value;
    setSubestaciones(newSubs);
  };

  const handleAddSubestacion = () => {
    setSubestaciones([...subestaciones, {
      id: uuidv4(),
      nombre: '',
      description: '',
      orden: subestaciones.length + 1,
      media: []
    }]);
  };

  const handleRemoveSubestacion = (index) => {
    const sub = subestaciones[index];
    if (sub && sub.media) {
      const existingSubMedia = sub.media.filter(m => m.isExisting).map(m => m.path);
      if (existingSubMedia.length > 0) {
        setArchivosBorrados(prev => [...prev, ...existingSubMedia]);
      }
    }
    const newSubs = [...subestaciones];
    newSubs.splice(index, 1);
    setSubestaciones(newSubs);
  };

  const handleFileUpload = async (e, isSubestacion = false, index = null) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const overSized = files.some(f => f.size > 50 * 1024 * 1024);
    if (overSized) return showMessage('❌ Error: Archivo supera el límite de 50MB', 'error');

    const newMedia = files.map(file => ({
      id: uuidv4(),
      file: file,
      name: file.name,
      type: file.type.startsWith('video/') ? 'video' : 'image',
      url: URL.createObjectURL(file),
      isExisting: false
    }));

    if (isSubestacion) {
      const newSubs = [...subestaciones];
      newSubs[index].media = [...newSubs[index].media, ...newMedia];
      setSubestaciones(newSubs);
    } else {
      setFormData(prev => ({ ...prev, media: [...prev.media, ...newMedia] }));
    }
    e.target.value = '';
  };

  const handleRemoveFile = (isSubestacion, index, fileIndex) => {
    if (isSubestacion) {
      const newSubs = [...subestaciones];
      const removed = newSubs[index].media[fileIndex];
      if (removed && removed.isExisting) {
        setArchivosBorrados(prev => [...prev, removed.path]);
      }
      newSubs[index].media.splice(fileIndex, 1);
      setSubestaciones(newSubs);
    } else {
      const newMedia = [...formData.media];
      const removed = newMedia[fileIndex];
      if (removed && removed.isExisting) {
        setArchivosBorrados(prev => [...prev, removed.path]);
      }
      newMedia.splice(fileIndex, 1);
      setFormData(prev => ({ ...prev, media: newMedia }));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    const errors = {};
    if (formData.numero_estacion !== '' && formData.numero_estacion !== undefined && formData.numero_estacion !== null) {
      if (isNaN(Number(formData.numero_estacion)) || Number(formData.numero_estacion) < 0) {
        errors.numero_estacion = 'Ingresa un número de orden válido (mayor o igual a 0)';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstErrorMsg = Object.values(errors)[0];
      showMessage(`❌ ${firstErrorMsg}`, 'error');
      return;
    }
    setFieldErrors({});

    setLoading(true);
    try {
      const payload = new FormData();

      const ordenVal = (formData.numero_estacion !== '' && !isNaN(Number(formData.numero_estacion)))
        ? parseInt(formData.numero_estacion)
        : 1;

      payload.append('orden', ordenVal);
      payload.append('visibilidad', formData.visibilidad || 'ACTIVO');
      payload.append('nombre_estacion', (formData.nombre_estacion || '').trim());
      payload.append('descripcion_principal', (formData.descripcion_principal || '').trim());

      const subestacionesPayload = subestaciones.map(sub => ({
        nombre: (sub.nombre || '').trim(),
        description: (sub.description || sub.descripcion || '').trim(),
        orden: sub.orden || 1,
        media: sub.media.filter(m => m.isExisting).map(m => m.path)
      }));
      payload.append('subestaciones', JSON.stringify(subestacionesPayload));

      const existingMedia = formData.media.filter(m => m.isExisting).map(m => m.path);
      payload.append('existingMedia', JSON.stringify(existingMedia));
      payload.append('archivosBorrados', JSON.stringify(archivosBorrados));

      // Append new main station files as 'archivos[]'
      formData.media.filter(m => !m.isExisting && m.file).forEach(m => {
        payload.append('archivos[]', m.file);
      });

      // Append new subestaciones files as 'sub_${index}_archivos[]'
      subestaciones.forEach((sub, index) => {
        sub.media.filter(m => !m.isExisting && m.file).forEach(m => {
          payload.append(`sub_${index}_archivos[]`, m.file);
        });
      });

      const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
      const method = isEditing ? 'PUT' : 'POST';

      console.log(`[EstacionesPanel] ${method} ${url}`);
      const res = await fetch(url, { method, body: payload });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMsg;
        try {
          const errorData = JSON.parse(errorText);
          errorMsg = errorData.error || errorData.message || `Error del servidor (${res.status})`;
        } catch {
          errorMsg = `Error del servidor (${res.status})`;
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();

      if (data.success) {
        showMessage(isEditing ? '✅ Estación actualizada correctamente' : '✅ Estación creada correctamente');
        setShowModal(false);
        resetForm();
        setFieldErrors({});
        fetchEstaciones();

        // Auto-refresh gallery ONLY if it's already open for this station
        const savedId = isEditing ? editingId : data.data?.id;
        if (savedId && galleryStation) {
          fetch(`${API_URL}/${savedId}`)
            .then(r => r.json())
            .then(d => { if (d.success) setGalleryStation(d.data); })
            .catch(() => { });
        }
      } else {
        throw new Error(data.error || data.message || 'Error en el servidor');
      }
    } catch (error) {
      console.error('[EstacionesPanel] Error guardando:', error);
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        showMessage('❌ Sin conexión al servidor. Verifica que el backend está activo.', 'error');
      } else {
        showMessage(`❌ Error: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = (mediaArray, isSubestacion = false, subIndex = null) => {
    if (!mediaArray.length) return null;
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {mediaArray.map((m, fileIndex) => (
          <div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-white/40 flex items-center justify-center group border border-[#004d26]/10 shadow-sm">
            {m.type === 'image' ? (
              <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
            ) : (
              <video src={m.url} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-[#004d26]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center duration-200">
              <button
                type="button"
                onClick={() => handleRemoveFile(isSubestacion, subIndex, fileIndex)}
                className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {m.type === 'video' && (
              <div className="absolute bottom-2 left-2 p-1.5 bg-[#004d26]/60 backdrop-blur-sm rounded-md text-white">
                <Film className="w-3 h-3 text-[#D4AF37]" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-white/45 border border-[#004d26]/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none text-[#004d26] text-sm transition-all duration-300 font-inter";
  const inputErrorCls = "w-full px-4 py-2.5 rounded-xl bg-red-50 border-2 border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)] outline-none text-[#004d26] text-sm transition-all duration-300 font-inter";
  const labelCls = "block font-inter text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2";

  return (
    <div
      className="w-full min-h-screen relative overflow-hidden"
      style={{ background: '#F6EED6', padding: '24px 16px md:p-8' }}
    >
      {/* Lights decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#004d26]/5 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {/* Toast Alert */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-12 left-1/2 z-[100] px-6 py-3.5 rounded-full shadow-lg font-inter text-sm font-semibold border flex items-center gap-3 ${message.type === 'success'
                ? 'bg-[#004d26] text-[#F6EED6] border-[#D4AF37]/20'
                : 'bg-red-600 text-white border-red-400/20'
              }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> : <AlertCircle className="w-5 h-5 text-white" />}
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-[#004d26]/5 pb-8">
          <div className="space-y-1">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-[#004d26] leading-tight mb-2">Estaciones</h1>
            <p className="font-inter text-sm font-normal text-[#004d26]/70 leading-relaxed max-w-2xl">
              Gestiona los puntos de interés, estaciones y subestaciones del recorrido.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter text-sm font-semibold hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-300 shadow-sm active:scale-95 w-full sm:w-auto flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-current" /> Crear Estación
          </button>
        </div>

        {listLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-white/50 border-t-[#004d26] rounded-full animate-spin" />
            <p className="font-inter text-[0.95rem] font-semibold text-[#004d26]/50">Cargando estaciones...</p>
          </div>
        ) : estaciones.length === 0 ? (
          <div className="bg-white/35 border border-[#004d26]/10 rounded-3xl p-16 text-center max-w-2xl mx-auto backdrop-blur-sm">
            <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#004d26]/10 shadow-sm">
              <Package className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-[#004d26] mb-2">Sin estaciones registradas</h2>
            <p className="font-inter text-sm text-[#004d26]/60 mb-6 max-w-md mx-auto">Aún no se han creado estaciones en el sistema para este recorrido.</p>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold text-sm hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-300"
            >
              <Plus className="w-4 h-4" /> Crear Primera Estación
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {estaciones.map((estacion) => {
              const hasMedia = estacion.media && estacion.media.length > 0;
              const isVideo = hasMedia ? estacion.media[0].match(/\.(mp4|mov)$/i) : false;

              return (
                <motion.div
                  key={estacion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#F6EED6]/95 border border-[#004d26]/10 rounded-3xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group h-full relative backdrop-blur-sm"
                >
                  <div className="aspect-[16/10] relative bg-white/10 border-b border-[#004d26]/10 overflow-hidden">
                    {hasMedia ? (
                      isVideo ? (
                        <video
                          src={`http://localhost:3000${estacion.media[0]}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          muted loop playsInline autoPlay
                        />
                      ) : (
                        <img
                          src={`http://localhost:3000${estacion.media[0]}`}
                          alt={estacion.nombre_estacion}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+No+Disponible';
                          }}
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#D4AF37]/40">
                        <LayoutPanelLeft className="w-12 h-12" />
                      </div>
                    )}

                    {/* Estacion Badge */}
                    <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-xl bg-[#F6EED6]/95 border border-[#D4AF37]/30 text-[#004d26] text-xs font-inter font-bold shadow-md backdrop-blur-sm">
                      #{estacion.orden}
                    </div>

                    {/* Visibility Badge */}
                    <span className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full border text-[10px] font-inter font-black uppercase tracking-[0.18em] backdrop-blur-sm ${getStatusBadgeClass(estacion.visibilidad)}`}>
                      {estacion.visibilidad || 'ACTIVO'}
                    </span>
                  </div>

                  <div className="p-6 flex flex-1 flex-col">
                    <h3 className="font-playfair text-xl font-bold text-[#004d26] mb-2 leading-tight text-left">{estacion.nombre_estacion}</h3>
                    <p className="font-inter text-sm font-semibold text-[#004d26]/70 line-clamp-2 flex-1 mb-4 leading-relaxed text-left">
                      {estacion.descripcion_principal}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-[#004d26]/10 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-inter font-semibold text-[#004d26]/65">
                          <Film className="w-4 h-4 text-[#D4AF37]" /> {estacion.media?.length || 0}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-inter font-semibold text-[#004d26]/65">
                          <LayoutPanelLeft className="w-4 h-4 text-[#D4AF37]" /> {estacion.subestacion_count || 0}
                        </div>
                      </div>


                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => handleOpenEdit(estacion)}
                        className="flex-grow px-4 py-2 bg-white/45 border border-[#004d26]/10 text-[#004d26] rounded-xl font-inter font-semibold hover:bg-[#D4AF37]/15 hover:border-[#D4AF37]/30 transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-sm"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#D4AF37]" /> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(estacion.id)}
                        className="px-3.5 py-2 bg-white/45 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Form Modal ── */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#004d26]/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-[700px] bg-[#F6EED6] border border-[#004d26]/15 rounded-[2rem] shadow-2xl overflow-y-auto flex flex-col max-h-[90vh] backdrop-blur-sm"
            >
              {/* Header */}
              <div className="bg-[#F6EED6]/50 px-6 py-5 flex items-center justify-between border-b border-[#004d26]/10">
                <div>
                  <h2 className="font-playfair text-xl font-bold text-[#004d26]">
                    {isEditing ? 'Editar Estación' : 'Crear Estación'}
                  </h2>
                  <p className="font-inter text-xs text-[#004d26]/60 mt-0.5">Defina las propiedades de este punto del recorrido espiritual.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 text-[#004d26]/40 hover:text-[#004d26] hover:bg-[#004d26]/5 rounded-full transition duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                {/* Basic Section */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={labelCls}>Número de Orden</label>
                      <input
                        type="number"
                        name="numero_estacion"
                        value={formData.numero_estacion}
                        onChange={handleChange}
                        className={fieldErrors.numero_estacion ? inputErrorCls : inputCls}
                        placeholder="1"
                      />
                      {fieldErrors.numero_estacion && (
                        <p className="font-inter text-[0.8rem] text-[#ef4444] mt-1">{fieldErrors.numero_estacion}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Visibilidad</label>
                      <div className="relative">
                        <select
                          name="visibilidad"
                          value={formData.visibilidad}
                          onChange={handleChange}
                          className={`${inputCls} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="ACTIVO">ACTIVO</option>
                          <option value="INACTIVO">INACTIVO</option>
                          <option value="OCULTO">OCULTO</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#004d26]/50 w-4 h-4 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Nombre de la Estación</label>
                    <input
                      type="text"
                      name="nombre_estacion"
                      value={formData.nombre_estacion}
                      onChange={handleChange}
                      placeholder="Nombre de la estación..."
                      className={fieldErrors.nombre_estacion ? inputErrorCls : inputCls}
                    />
                    {fieldErrors.nombre_estacion && (
                      <p className="font-inter text-[0.8rem] text-[#ef4444] mt-1">{fieldErrors.nombre_estacion}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Descripción Principal</label>
                    <textarea
                      name="descripcion_principal"
                      value={formData.descripcion_principal}
                      onChange={handleChange}
                      placeholder="Describe los principios especiales..."
                      className={`${fieldErrors.descripcion_principal ? inputErrorCls : inputCls} resize-vertical`}
                      style={{ height: 110 }}
                    />
                    {fieldErrors.descripcion_principal && (
                      <p className="font-inter text-[0.8rem] text-[#ef4444] mt-1">{fieldErrors.descripcion_principal}</p>
                    )}
                  </div>
                </div>

                {/* Media Section */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <label className={labelCls}>Fotos o Videos de la Estación</label>
                  <div
                    className="flex flex-col sm:flex-row items-center gap-4 border-2 border-dashed border-[#004d26]/20 rounded-2xl bg-white/30 cursor-pointer hover:border-[#D4AF37] hover:bg-white transition-all duration-200 p-6"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-10 h-10 text-[#D4AF37] shrink-0" />
                    <div className="text-center sm:text-left flex-grow">
                      <p className="font-inter text-sm font-semibold text-[#004d26]/70">
                        {formData.media.length > 0
                          ? `${formData.media.length} archivo(s) seleccionado(s)`
                          : 'Sin archivos seleccionados'}
                      </p>
                      <p className="font-inter text-xs text-[#004d26]/40 mt-1">JPG, PNG, MP4, MOV — Máx 50 MB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="shrink-0 bg-[#004d26] hover:bg-[#D4AF37] hover:text-[#004d26] text-[#F6EED6] font-inter text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border-none cursor-pointer transition-colors duration-200"
                    >
                      Subir
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => handleFileUpload(e, false)}
                      className="hidden"
                      multiple
                      accept=".jpg,.jpeg,.png,.mp4,.mov"
                    />
                  </div>
                  {renderMediaPreview(formData.media, false)}
                </div>

                {/* Subestaciones */}
                <div className="bg-white/45 p-6 rounded-2xl border border-[#004d26]/10 space-y-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-4">
                    <label className={labelCls}>Subestaciones / Elementos</label>
                    <button
                      type="button"
                      onClick={handleAddSubestacion}
                      className="bg-[#004d26] hover:bg-[#D4AF37] hover:text-[#004d26] text-[#F6EED6] font-inter text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full border-none cursor-pointer transition-colors duration-200 flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Agregar
                    </button>
                  </div>

                  <div className="space-y-6">
                    {Array.isArray(subestaciones) && subestaciones.map((sub, index) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/40 border border-[#004d26]/10 rounded-2xl p-5 relative"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveSubestacion(index)}
                          className="absolute top-4 right-4 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full w-7 h-7 cursor-pointer transition-colors shadow-md"
                          aria-label="Eliminar subestación"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="mb-5 pr-10">
                          <label className={labelCls}>Nombre Subestación</label>
                          <input
                            type="text"
                            value={sub.nombre}
                            onChange={(e) => handleSubestacionChange(index, 'nombre', e.target.value)}
                            className={fieldErrors[`sub_${index}_nombre`] ? inputErrorCls : inputCls}
                            placeholder="Ej. La Cruz del Perdón"
                          />
                          {fieldErrors[`sub_${index}_nombre`] && (
                            <p className="font-inter text-[0.8rem] text-[#ef4444] mt-1">{fieldErrors[`sub_${index}_nombre`]}</p>
                          )}
                        </div>

                        <div className="mb-5">
                          <label className={labelCls}>Descripción</label>
                          <textarea
                            value={sub.description}
                            onChange={(e) => handleSubestacionChange(index, 'description', e.target.value)}
                            className={`${fieldErrors[`sub_${index}_description`] ? inputErrorCls : inputCls} resize-vertical`}
                            style={{ height: 90 }}
                            placeholder="Explica el significado de este elemento..."
                          />
                          {fieldErrors[`sub_${index}_description`] && (
                            <p className="font-inter text-[0.8rem] text-[#ef4444] mt-1">{fieldErrors[`sub_${index}_description`]}</p>
                          )}
                        </div>

                        <div>
                          <label className={labelCls}>Archivos de esta Subestación</label>
                          <div className="flex items-center gap-4 border-2 border-dashed border-[#004d26]/20 rounded-xl bg-white/30 p-4">
                            <span className="font-inter text-xs text-[#004d26]/50 flex-grow font-semibold">
                              {sub.media.length > 0
                                ? `${sub.media.length} archivo(s)`
                                : 'Sin archivos seleccionados'}
                            </span>
                            <label className="shrink-0 bg-[#004d26] hover:bg-[#D4AF37] hover:text-[#004d26] text-[#F6EED6] font-inter text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 flex items-center gap-1.5">
                              <input
                                type="file"
                                className="hidden"
                                multiple
                                accept=".jpg,.jpeg,.png,.mp4,.mov"
                                onChange={(e) => handleFileUpload(e, true, index)}
                              />
                              <Upload className="w-3.5 h-3.5" /> Subir
                            </label>
                          </div>
                          {renderMediaPreview(sub.media, true, index)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-[#004d26]/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-white/40 text-[#004d26] border border-[#004d26]/10 rounded-full font-inter font-semibold text-sm hover:bg-[#D4AF37]/15 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-8 py-2.5 bg-[#004d26] text-[#F6EED6] rounded-full font-inter font-semibold text-sm hover:bg-[#D4AF37] hover:text-[#004d26] transition duration-200 flex items-center gap-2"
                  >
                    {loading && (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Estación')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Station Gallery Modal */}
      <AnimatePresence>
        {galleryStation && (
          <StationGallery
            station={galleryStation}
            onClose={() => setGalleryStation(null)}
            API_URL={API_URL}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EstacionesPanel;
