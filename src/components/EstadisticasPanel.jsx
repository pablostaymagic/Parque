import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Row, Col, Typography, Statistic, ConfigProvider, Grid, Button } from 'antd';
import {
  Users, Globe, UserCheck, Activity, Filter,
  ChevronDown, X, Download, MapPin, Search
} from 'lucide-react';

const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const GENDER_OPTS = ['masculino', 'femenino', 'otro'];

/* ─── Period filter logic ─── */
const passDate = (dateStr, fechaInicio, fechaFin) => {
  if (!dateStr) return true;
  const dStr = dateStr.slice(0, 10);

  if (fechaInicio && dStr < fechaInicio) return false;
  if (fechaFin && dStr > fechaFin) return false;

  return true;
};

/* ─── Mini select ─── */
const Sel = ({ label, value, onChange, opts }) => (
  <div className="flex-1 w-full mb-4">
    <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-2.5 rounded-xl bg-[#F6EED6]/70 border border-[#004d26]/10 text-sm font-inter text-[#004d26] outline-none cursor-pointer transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/40"
      >
        {opts.map(o => (
          <option key={o.value ?? o} value={o.value ?? o} className="bg-[#F6EED6] text-[#004d26]">
            {o.label ?? o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#004d26]/50 pointer-events-none" />
    </div>
  </div>
);

/* ─── Mini input ─── */
const Inp = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div className="flex-1 w-full mb-4">
    <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl bg-[#F6EED6]/70 border border-[#004d26]/10 text-sm font-inter text-[#004d26] outline-none placeholder-[#004d26]/30 transition-all duration-300 focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/40"
      />
    </div>
  </div>
);

/* ─── Animated bar ─── */
const Bar = ({ label, count, total, color = '#D4AF37' }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-semibold text-[#004d26]/70 mb-2">
        <span className="truncate max-w-[70%] font-inter">{label}</span>
        <span className="font-bold text-[#004d26]">
          {count} <span className="text-[#D4AF37] ml-1 font-bold">({pct.toFixed(0)}%)</span>
        </span>
      </div>
      <div className="h-2 w-full bg-[#004d26]/5 rounded-full overflow-hidden">
        <motion.div
          key={`${label}-${count}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'circOut' }}
          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#004d26]"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

/* ─── Donut SVG ─── */
const COLORS = ['#004d26', '#D4AF37', '#8c7853', '#f2d184', '#1f5f3b', '#c4b28d'];
const Donut = ({ segments }) => {
  const total = segments.reduce((s, g) => s + g.value, 0);
  let cum = -90;
  const r = 50, cx = 70, cy = 70, sw = 12;
  const arcs = segments.map((seg, i) => {
    const angle = total > 0 ? (seg.value / total) * 360 : 0;
    const start = cum; cum += angle;
    const rad = d => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(start)), y1 = cy + r * Math.sin(rad(start));
    const x2 = cx + r * Math.cos(rad(cum - 0.01)), y2 = cy + r * Math.sin(rad(cum - 0.01));
    const large = angle > 180 ? 1 : 0;
    return { ...seg, d: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: COLORS[i % COLORS.length] };
  });
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg viewBox="0 0 140 140" className="w-40 h-40">
          {total === 0
            ? <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8E8E8" strokeWidth={sw} />
            : arcs.map((a, i) => (
              <motion.path
                key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw} strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeInOut' }}
              />
            ))
          }
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="font-playfair text-3xl font-bold text-[#004d26] m-0 leading-none">{total}</p>
          <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.2em] m-0 mt-1">Visitantes</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 max-w-md">
        {arcs.map((a, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-[#004d26]/5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
            <span className="text-[10px] font-bold text-[#004d26]/60 uppercase tracking-wider">{a.label}</span>
            <span className="text-[11px] font-bold text-[#004d26]">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Stat card ─── */
const StatCard = ({ label, value, icon: Icon, subValue, screens }) => {
  const isMobile = screens?.xs && !screens?.sm;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0, 77, 38, 0.08)' }}
      className="bg-white/45 backdrop-blur-sm border border-[#004d26]/10 rounded-2xl p-5 min-h-[150px] flex flex-col justify-between shadow-sm transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center">
          <Icon size={20} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/60">
          {label}
        </div>
      </div>
      <Statistic
        value={value}
        suffix={subValue && <span className="text-xs font-bold text-[#004d26]/60 ml-2 font-inter uppercase tracking-wider">{subValue}</span>}
        valueStyle={{ color: '#004d26', fontWeight: 700, fontSize: isMobile ? '24px' : '32px', lineHeight: 1, fontFamily: 'Playfair Display, Georgia, serif' }}
      />
    </motion.div>
  );
};

/* ─── Excel export ─── */
const exportToExcel = (rows) => {
  const headers = ['Nombre', 'Tipo Ingreso', 'Edad', 'Género', 'Nacionalidad', 'Fecha', 'Fuente'];
  const csv = [
    headers.join(','),
    ...rows.map(d => [
      `"${d.nombre || ''}"`,
      `"${d.tipo_ingreso || d.eventTitle || ''}"`,
      d.edad || '',
      `"${d.genero || ''}"`,
      `"${d.nacionalidad || ''}"`,
      d.fecha || '',
      d.source === 'web' ? 'Web' : 'Logística'
    ].join(','))
  ].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `eagle-park-metricas-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

const customTheme = {
  token: {
    colorPrimary: '#004d26',
    colorSuccess: '#D4AF37',
    colorError: '#D9534F',
    fontSize: 14,
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
    borderRadiusLG: 16,
    borderRadiusSM: 12,
    margin: 16,
    padding: 16,
    marginXS: 8,
    paddingXS: 8,
  },
  components: {
    Card: {
      colorBgContainer: 'rgba(255, 255, 255, 0.45)',
      borderRadiusLG: 24,
      boxShadow: 'none',
    },
    Typography: {
      colorText: '#004d26',
      colorTextSecondary: 'rgba(0, 77, 38, 0.6)',
    },
    Button: {
      colorPrimary: '#004d26',
      borderRadius: 999,
    },
  },
};

/* ══════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════ */
const EstadisticasPanel = ({ reservations = [], logisticVisitors = [], eventHistory = [], activeEvent }) => {
  const screens = useBreakpoint();

  /* filters */
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoIngreso, setTipoIngreso] = useState('todos');
  const [edadMin, setEdadMin] = useState('');
  const [edadMax, setEdadMax] = useState('');
  const [genders, setGenders] = useState(['masculino', 'femenino', 'otro']);
  const [nacionalidad, setNacionalidad] = useState('');
  const [open, setOpen] = useState(false);

  const toggleGender = g => setGenders(prev =>
    prev.includes(g) ? (prev.length > 1 ? prev.filter(x => x !== g) : prev) : [...prev, g]
  );

  const eventOptions = useMemo(() => {
    const opts = [{ value: 'todos', label: 'Todos los Destinos' }, { value: 'visita_general', label: 'Visita General' }];
    if (activeEvent) opts.push({ value: activeEvent.titulo, label: activeEvent.titulo });
    (eventHistory || []).forEach(e => { if (!opts.find(o => o.value === e.titulo)) opts.push({ value: e.titulo, label: e.titulo }); });
    return opts;
  }, [activeEvent, eventHistory]);

  const allData = useMemo(() => {
    const web = (reservations || []).map(r => ({ ...r, fecha: r.fecha || new Date(r.id).toISOString().slice(0, 10), source: 'web', tipo_ingreso: r.eventTitle || 'Visita general' }));
    const log = (logisticVisitors || []).map(l => ({ ...l, source: 'logistica' }));
    return [...web, ...log];
  }, [reservations, logisticVisitors]);

  const filtered = useMemo(() => {
    return allData.filter(d => {
      if (!passDate(d.fecha, fechaInicio, fechaFin)) return false;
      if (tipoIngreso === 'visita_general') {
        const ti = (d.tipo_ingreso || '').toLowerCase();
        if (ti !== 'visita general' && ti !== 'visita_general') return false;
      } else if (tipoIngreso !== 'todos') {
        if ((d.tipo_ingreso || '').toLowerCase() !== tipoIngreso.toLowerCase()) return false;
      }
      const age = parseInt(d.edad);
      if (edadMin && !isNaN(age) && age < parseInt(edadMin)) return false;
      if (edadMax && !isNaN(age) && age > parseInt(edadMax)) return false;
      if (!genders.includes((d.genero || 'otro').toLowerCase())) return false;
      if (nacionalidad.trim() && !(d.nacionalidad || '').toLowerCase().includes(nacionalidad.toLowerCase())) return false;
      return true;
    });
  }, [allData, fechaInicio, fechaFin, tipoIngreso, edadMin, edadMax, genders, nacionalidad]);

  const webCount = filtered.filter(d => d.source === 'web').length;
  const logCount = filtered.filter(d => d.source === 'logistica').length;
  const avgAge = filtered.length > 0
    ? (filtered.reduce((s, d) => s + (parseInt(d.edad) || 0), 0) / filtered.length).toFixed(1) : '–';

  const genderSegs = GENDER_OPTS.map(g => ({ label: g, value: filtered.filter(d => (d.genero || '').toLowerCase() === g).length }));

  const topNats = Object.entries(
    filtered.reduce((acc, d) => { const n = d.nacionalidad?.trim() || 'N/A'; acc[n] = (acc[n] || 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0,6);

  const ageGroups = [{ l: 'Niños (0–12)', mn: 0, mx: 12 }, { l: 'Adolescentes (13–17)', mn: 13, mx: 17 }, { l: 'Jóvenes adultos (18–25)', mn: 18, mx: 25 }, { l: 'Adultos (26–40)', mn: 26, mx: 40 }, { l: 'Adultos mayores (41–60)', mn: 41, mx: 60 }, { l: 'Mayores de 61 años', mn: 61, mx: 999 }]
    .map(g => ({ label: g.l, value: filtered.filter(d => { const a = parseInt(d.edad); return !isNaN(a) && a >= g.mn && a <= g.mx; }).length }));

  const hasFilter = fechaInicio || fechaFin || tipoIngreso !== 'todos' || edadMin || edadMax || genders.length < 3 || nacionalidad;

  const resetFilters = () => { setFechaInicio(''); setFechaFin(''); setTipoIngreso('todos'); setEdadMin(''); setEdadMax(''); setGenders(['masculino', 'femenino', 'otro']); setNacionalidad(''); };

  const getPadding = () => {
    if (screens?.lg || screens?.xl) return '24px';
    if (screens?.sm || screens?.md) return '16px';
    return '12px'; // xs
  };

  const buttonStyle = {
    desktop: {
      height: '40px',
      padding: '0 24px',
      fontSize: '14px',
      fontWeight: 600,
    },
    mobile: {
      height: '44px',
      width: '100%',
      padding: '0 16px',
      fontSize: '14px',
      fontWeight: 600,
    },
  };

  const isMobile = screens?.xs && !screens?.sm;

  return (
    <ConfigProvider theme={customTheme}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden w-full min-h-screen"
        style={{
          padding: getPadding(),
          background: '#F6EED6',
        }}
      >
        {/* Cinematic & Spiritual Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.03] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#004d26]/5 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <Row justify="space-between" align="middle" gutter={[24, 24]} className="mb-8 md:mb-12">
            <Col xs={24} lg={12}>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-[0.35em] text-[#D4AF37] mb-1">
                  Panel de Estadísticas
                </div>
                <Title level={1} className="!font-playfair !font-bold !text-[#004d26] !mb-1" style={{ fontSize: isMobile ? '28px' : '40px', lineHeight: 1.15 }}>
                  Bienvenido de nuevo
                </Title>
                <Paragraph className="!font-inter !text-sm !text-[#004d26]/60 !m-0">
                  Resumen de actividad para Eagle Park · <span className="font-bold text-[#D4AF37]">{filtered.length}</span> visitantes registrados
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Row gutter={[16, 16]} justify={screens?.lg ? "end" : "start"}>
                <Col xs={24} sm={12} md="auto">
                  <Button
                    type="default"
                    icon={<Download size={16} className="text-[#004d26]" />}
                    onClick={() => exportToExcel(filtered)}
                    className="!inline-flex !items-center !justify-center !rounded-full !font-inter !font-semibold !transition-all !duration-300 bg-white/45 text-[#004d26] border border-[#004d26]/10 hover:!bg-[#D4AF37]/15 hover:!border-[#D4AF37]/30 hover:!text-[#004d26]"
                    style={buttonStyle[isMobile ? 'mobile' : 'desktop']}
                  >
                    EXPORTAR CSV
                  </Button>
                </Col>
                <Col xs={24} sm={12} md="auto">
                  <Button
                    type="primary"
                    icon={<Filter size={16} />}
                    onClick={() => setOpen(o => !o)}
                    className="!inline-flex !items-center !justify-center !rounded-full !font-inter !font-semibold !transition-all !duration-300 bg-[#004d26] text-[#F6EED6] border border-[#004d26] hover:!bg-[#D4AF37] hover:!text-[#004d26] hover:!border-[#D4AF37]"
                    style={buttonStyle[isMobile ? 'mobile' : 'desktop']}
                  >
                    {open ? 'CERRAR FILTROS' : 'FILTRAR'}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Filter panel */}
          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: 'circOut' }} style={{ overflow: 'hidden', marginBottom: '24px' }}>
                <div className="bg-white/45 backdrop-blur-sm border border-[#004d26]/10 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-[#004d26]" />
                      <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#004d26]">Configuración de Filtros</span>
                    </div>
                    {hasFilter && (
                      <button
                        onClick={resetFilters}
                        className="bg-transparent border-none text-[#D9534F] hover:text-[#004d26] text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer flex items-center gap-1.5 transition-colors duration-300"
                      >
                        <X size={14} /> Limpiar Todo
                      </button>
                    )}
                  </div>

                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12} lg={6}><Inp label="Inicio (Desde)" type="date" value={fechaInicio} onChange={setFechaInicio} /></Col>
                    <Col xs={24} md={12} lg={6}><Inp label="Fin (Hasta)" type="date" value={fechaFin} onChange={setFechaFin} /></Col>
                    <Col xs={24} md={12} lg={6}><Sel label="Origen del Viaje" value={tipoIngreso} onChange={setTipoIngreso} opts={eventOptions} /></Col>
                    <Col xs={24} md={12} lg={6}><Inp label="Nacionalidad" value={nacionalidad} onChange={setNacionalidad} placeholder="Colombia, México..." /></Col>

                    <Col xs={24} md={12} lg={6}>
                      <Row gutter={[16, 16]}>
                        <Col xs={12}><Inp label="Edad Mín." value={edadMin} onChange={setEdadMin} type="number" /></Col>
                        <Col xs={12}><Inp label="Edad Máx." value={edadMax} onChange={setEdadMax} type="number" /></Col>
                      </Row>
                    </Col>
                  </Row>

                  <Row gutter={[24, 24]} style={{ marginTop: '16px' }}>
                    <Col xs={24} lg={16}>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-3">Género</label>
                      <div className="flex flex-wrap gap-2">
                        {GENDER_OPTS.map(g => (
                          <button
                            key={g}
                            onClick={() => toggleGender(g)}
                            className={`flex-1 min-h-[40px] px-4 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${
                              genders.includes(g)
                                ? 'bg-[#004d26] text-[#F6EED6] border-[#004d26] shadow-sm'
                                : 'bg-[#F6EED6]/40 text-[#004d26]/60 border-[#004d26]/10 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </Col>
                    <Col xs={24} lg={8} className="flex items-end justify-end">
                      <Button
                        type="primary"
                        onClick={resetFilters}
                        className="!inline-flex !items-center !justify-center !rounded-full !font-inter !font-semibold !transition-all !duration-300 bg-[#004d26] text-[#F6EED6] border border-[#004d26] hover:!bg-[#D4AF37] hover:!text-[#004d26] hover:!border-[#D4AF37]"
                        style={{ ...buttonStyle[isMobile ? 'mobile' : 'desktop'], width: isMobile ? '100%' : 'auto' }}
                      >
                        RESTAURAR FILTROS
                      </Button>
                    </Col>
                  </Row>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards metrics */}
          <Row gutter={[16, 16]} className="mb-6 md:mb-8">
            <Col xs={24} sm={12} md={6}>
              <StatCard label="Reservas totales" value={filtered.length} icon={Users} screens={screens} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard label="Registros web" value={webCount} icon={Globe} screens={screens} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard label="Registros internos" value={logCount} icon={UserCheck} screens={screens} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <StatCard label="Edad promedio" value={avgAge} icon={Activity} subValue="años" screens={screens} />
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[24, 24]} className="mb-6 md:mb-8">
            <Col xs={24} md={12}>
              {/* Gender Dist */}
              <div className="bg-white/45 border border-[#004d26]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full backdrop-blur-sm">
                <div className="px-6 py-4 border-b border-[#004d26]/10 bg-[#F6EED6]/40">
                  <h3 className="font-playfair text-xl font-bold text-[#004d26] m-0">Distribución por género</h3>
                </div>
                <div className="p-6 flex-1 flex items-center justify-center">
                  <div className="w-full py-4">
                    <Donut segments={genderSegs} />
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} md={12}>
              {/* Age Groups */}
              <div className="bg-white/45 border border-[#004d26]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full backdrop-blur-sm">
                <div className="px-6 py-4 border-b border-[#004d26]/10 bg-[#F6EED6]/40">
                  <h3 className="font-playfair text-xl font-bold text-[#004d26] m-0">Distribución por edad</h3>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex flex-col gap-2">
                    {ageGroups.map(g => (
                      <Bar key={g.label} label={g.label} count={g.value} total={filtered.length} color="#D4AF37" />
                    ))}
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Top Nationalities */}
          <Row gutter={[24, 24]} className="mb-6 md:mb-8">
            <Col xs={24}>
              <div className="bg-white/45 border border-[#004d26]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col backdrop-blur-sm">
                <div className="px-6 py-4 border-b border-[#004d26]/10 bg-[#F6EED6]/40">
                  <h3 className="font-playfair text-xl font-bold text-[#004d26] m-0">Distribución por origen</h3>
                </div>
                <div className="p-6">
                  <Row gutter={[24, 24]}>
                    {topNats.map(([nat, count], i) => (
                      <Col xs={24} sm={12} lg={8} key={nat}>
                        <Bar label={nat} count={count} total={filtered.length} color={i === 0 ? '#D4AF37' : '#004d26'} />
                      </Col>
                    ))}
                    {topNats.length === 0 && (
                      <Col xs={24}>
                        <div className="flex flex-col items-center justify-center py-14 text-center">
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center mb-4">
                            <MapPin size={20} />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#004d26]/40 m-0">
                            Sin datos de origen registrados
                          </p>
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>

          {/* Data table */}
          <div className="bg-white/45 border border-[#004d26]/10 rounded-3xl shadow-sm overflow-hidden flex flex-col backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-[#004d26]/10 flex justify-between items-center bg-[#F6EED6]/40">
              <h3 className="font-playfair text-xl font-bold text-[#004d26] m-0">Registro de visitantes</h3>
              <a
                href="#"
                className="text-[#D4AF37] hover:text-[#004d26] font-bold text-[10px] uppercase tracking-[0.25em] transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  exportToExcel(filtered);
                }}
              >
                Exportar datos
              </a>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr className="bg-[#F6EED6]/60">
                    {['Nombre del visitante', 'Fuente de registro', 'Edad', 'Género', 'Origen', 'Grupo de edad', 'Canal'].map(h => (
                      <th
                        key={h}
                        className="px-6 py-4 border-b border-[#004d26]/10 text-[#004d26]/60 text-[10px] uppercase tracking-[0.2em] font-bold text-left"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#004d26]/35 uppercase tracking-widest gap-3">
                          <Search size={32} className="text-[#004d26]/30" />
                          <span className="text-xs font-bold font-inter">No se encontraron registros</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {filtered.slice(0, 50).map((d, i) => (
                    <tr key={i} className="border-b border-[#004d26]/5 hover:bg-[#D4AF37]/5 transition-colors duration-200">
                      <td className="px-6 py-4 text-[#004d26] font-bold text-sm">{d.nombre || 'Desconocido'}</td>
                      <td className="px-6 py-4 text-[#004d26]/75 text-sm">{d.tipo_ingreso || d.eventTitle || 'Sugerencia'}</td>
                      <td className="px-6 py-4 text-[#004d26]/75 text-sm">{d.edad || '—'}</td>
                      <td className="px-6 py-4 text-[#004d26]/75 text-sm text-capitalize">{d.genero || '—'}</td>
                      <td className="px-6 py-4 text-[#004d26]/75 text-sm">{d.nacionalidad || '—'}</td>
                      <td className="px-6 py-4 text-[#004d26]/75 text-sm">{d.fecha || '—'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            d.source === 'web'
                              ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37]'
                              : 'bg-[#004d26]/10 border-[#004d26]/20 text-[#004d26]'
                          }`}
                        >
                          {d.source === 'web' ? <Globe size={12} /> : <UserCheck size={12} />}
                          {d.source === 'web' ? 'Portal Web' : 'Logística'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </motion.div>
    </ConfigProvider>
  );
};

export default EstadisticasPanel;

