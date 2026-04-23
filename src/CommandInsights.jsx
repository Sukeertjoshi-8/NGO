import { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import {
  ArrowLeft, Activity, AlertTriangle, Radio, Crosshair, CheckCircle,
  Truck, Loader2, ScanSearch, Map as MapIcon, Shield, Signal, Users, Zap
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   SEED CRISES — 10 across India
   ═══════════════════════════════════════════════════════ */
const SEED = [
  { id: 's1', description: 'Massive flooding in residential colony near Yamuna banks', urgency_category: 'Flood/Water', lat: 28.6139, lng: 77.2090, image_url: '/crisis/flood_delhi.png', ai_analysis: { severity: 92, category: 'Flood', status: 'complete', confidence: 94 }, timestamp: { seconds: Date.now() / 1000 - 300 }, cluster: 12 },
  { id: 's2', description: 'Factory fire spreading to adjacent buildings in Surat industrial area', urgency_category: 'Fire/Smoke', lat: 21.1702, lng: 72.8311, image_url: '/crisis/fire_surat.png', ai_analysis: { severity: 88, category: 'Fire', status: 'complete', confidence: 91 }, timestamp: { seconds: Date.now() / 1000 - 900 }, cluster: 7 },
  { id: 's3', description: 'Building collapse after earthquake tremors in Bhuj', urgency_category: 'Structural Damage', lat: 23.2420, lng: 69.6669, image_url: '/crisis/collapse_bhuj.png', ai_analysis: { severity: 95, category: 'Accident', status: 'complete', confidence: 97 }, timestamp: { seconds: Date.now() / 1000 - 1500 }, cluster: 19 },
  { id: 's4', description: 'Landslide blocking NH-5 highway near Shimla', urgency_category: 'Structural Damage', lat: 31.1048, lng: 77.1734, image_url: '/crisis/landslide_shimla.png', ai_analysis: { severity: 78, category: 'Accident', status: 'complete', confidence: 85 }, timestamp: { seconds: Date.now() / 1000 - 2100 }, cluster: 4 },
  { id: 's5', description: 'Cyclone damage — roofs torn off in Puri coastal village', urgency_category: 'Flood/Water', lat: 19.7983, lng: 85.8315, image_url: '/crisis/cyclone_puri.png', ai_analysis: { severity: 85, category: 'Flood', status: 'complete', confidence: 89 }, timestamp: { seconds: Date.now() / 1000 - 3600 }, cluster: 9 },
  { id: 's6', description: 'Chemical gas leak from refinery in Vizag industrial zone', urgency_category: 'Medical Emergency', lat: 17.6868, lng: 83.2185, image_url: '/crisis/gasleak_vizag.png', ai_analysis: { severity: 91, category: 'Medical', status: 'complete', confidence: 93 }, timestamp: { seconds: Date.now() / 1000 - 4200 }, cluster: 15 },
  { id: 's7', description: 'Train derailment near Balasore — multiple casualties', urgency_category: 'Medical Emergency', lat: 21.4934, lng: 86.9337, image_url: '/crisis/train_balasore.png', ai_analysis: { severity: 97, category: 'Accident', status: 'complete', confidence: 99 }, timestamp: { seconds: Date.now() / 1000 - 5400 }, cluster: 23 },
  { id: 's8', description: 'Flash floods washing away bridges in Wayanad', urgency_category: 'Flood/Water', lat: 11.6854, lng: 76.1320, image_url: '/crisis/flood_wayanad.png', ai_analysis: { severity: 83, category: 'Flood', status: 'complete', confidence: 87 }, timestamp: { seconds: Date.now() / 1000 - 6000 }, cluster: 6 },
  { id: 's9', description: 'Forest fire spreading across Uttarakhand pine belt', urgency_category: 'Fire/Smoke', lat: 30.0668, lng: 79.0193, image_url: '/crisis/forestfire_uttarakhand.png', ai_analysis: { severity: 74, category: 'Fire', status: 'complete', confidence: 81 }, timestamp: { seconds: Date.now() / 1000 - 7200 }, cluster: 3 },
  { id: 's10', description: 'Food and water shortage in drought-hit Marathwada village', urgency_category: 'Resource Shortage', lat: 19.8762, lng: 75.3433, image_url: '/crisis/drought_marathwada.png', ai_analysis: { severity: 65, category: 'Medical', status: 'complete', confidence: 72 }, timestamp: { seconds: Date.now() / 1000 - 9000 }, cluster: 2 },
];

/* ═══════════════════════════════════════════════════════
   IST Clock
   ═══════════════════════════════════════════════════════ */
function useISTClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ═══════════════════════════════════════════════════════
   Leaflet Map — Light CARTO tiles
   ═══════════════════════════════════════════════════════ */
function TacticalMap({ reports, onSelect }) {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (mapInst.current) return;
    const init = async () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const l = document.createElement('link');
        l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(l);
      }
      const L = await import('leaflet');
      if (!mapRef.current || mapInst.current) return;
      const map = L.map(mapRef.current, { zoomControl: false }).setView([22.5, 79], 5);
      // Light tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '', maxZoom: 18 }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInst.current = map;
      
      // Fix for Leaflet rendering issues in flex/hidden containers
      setTimeout(() => {
        if (mapInst.current) {
          mapInst.current.invalidateSize();
          mapInst.current.setView([22.5, 79], 5);
        }
      }, 500);
    };
    init();
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInst.current) return;
    const update = async () => {
      const L = await import('leaflet');
      markers.current.forEach(m => m.remove());
      markers.current = [];
      reports.forEach(r => {
        if (!r.lat || !r.lng) return;
        const sev = r.ai_analysis?.severity || 50;
        const crit = sev > 80;
        const col = crit ? '#ef4444' : sev > 50 ? '#f97316' : '#10b981';
        const sz = crit ? 18 : 14;
        const icon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:${sz}px;height:${sz}px;">
            <div style="position:absolute;inset:0;background:${col};border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 8px ${col},0 0 20px ${col}40;"></div>
            ${crit ? `<div style="position:absolute;inset:-8px;border:2px solid ${col};border-radius:50%;opacity:0;animation:rippleOut 2s ease-out infinite;"></div><div style="position:absolute;inset:-8px;border:2px solid ${col};border-radius:50%;opacity:0;animation:rippleOut 2s ease-out 0.6s infinite;"></div>` : ''}
          </div>`,
          iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
        });
        const m = L.marker([r.lat, r.lng], { icon }).addTo(mapInst.current);
        m.on('click', () => onSelect?.(r));
        m.bindPopup(`<div style="font-family:'Noto Sans',sans-serif;min-width:160px;"><strong style="font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;color:#1a2f23;">${r.ai_analysis?.category || r.urgency_category}</strong><div style="margin:3px 0;font-size:11px;color:#666;">${(r.description || '').slice(0, 60)}…</div><div style="font-family:'Space Mono',monospace;font-size:12px;font-weight:700;color:${col};">SEV ${sev}/100</div></div>`);
        markers.current.push(m);
      });
    };
    const t = setTimeout(update, 300);
    return () => clearTimeout(t);
  }, [reports, onSelect]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#fafcfb' }} />;
}

/* ═══════════════════════════════════════════════════════
   AI Confidence Bar
   ═══════════════════════════════════════════════════════ */
function ConfidenceBar({ value = 0 }) {
  const col = value > 90 ? '#10b981' : value > 75 ? '#f97316' : '#ef4444';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: col }} />
      </div>
      <span className="text-[10px] font-bold font-mono" style={{ color: col }}>{value}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Incident Card
   ═══════════════════════════════════════════════════════ */
function IncidentCard({ r, onDispatch, dispatched }) {
  const ai = r.ai_analysis;
  const sev = ai?.severity || 0;
  const crit = sev > 80;
  const imgSrc = r.image_url || r.image_data;
  const borderCol = crit ? 'border-l-red-500' : 'border-l-emerald-500';

  return (
    <div className={`bg-white border border-[#e2f0e7] shadow-sm border-l-[4px] ${borderCol} rounded-2xl overflow-hidden hover:shadow-md transition-shadow`}>
      {/* Image strip */}
      {imgSrc && (
        <div className="h-28 w-full relative overflow-hidden">
          <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-[Rajdhani] uppercase tracking-wider ${crit ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
              {ai?.category || r.urgency_category}
            </span>
            {r.cluster && (
              <span className="px-1.5 py-0.5 rounded bg-white/30 backdrop-blur text-[10px] font-bold text-white font-mono">
                ×{r.cluster}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Severity */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold font-[Rajdhani] uppercase tracking-widest ${crit ? 'text-red-500' : 'text-emerald-600'}`}>
            {crit ? '⚠ CRITICAL' : 'MONITORED'} — {sev}/100
          </span>
          <span className="text-[9px] font-mono text-gray-500">
            {r.timestamp ? new Date(r.timestamp.seconds * 1000).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) : 'NOW'}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-700 leading-relaxed font-[Noto_Sans] line-clamp-2">{r.description}</p>

        {/* AI Confidence */}
        {ai?.confidence && (
          <div>
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">AI Confidence</span>
            <ConfidenceBar value={ai.confidence} />
          </div>
        )}

        {/* Coords */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <Crosshair className="w-3 h-3" />
          {r.lat && r.lng ? `${Number(r.lat).toFixed(4)}, ${Number(r.lng).toFixed(4)}` : 'NO FIX'}
        </div>

        {/* Dispatch */}
        <button
          onClick={() => { if (!dispatched) onDispatch?.(r.id); }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold font-[Rajdhani] uppercase tracking-wider transition-all ${dispatched
              ? 'bg-[#d4eedd] text-[#1a2f23] cursor-default'
              : 'bg-[#1a2f23] text-white hover:bg-[#2a4534] shadow-md shadow-[#1a2f23]/10 cursor-pointer active:scale-[0.98]'
            }`}
        >
          {dispatched ? <><CheckCircle className="w-3.5 h-3.5" /> DISPATCHED</> : <><Truck className="w-3.5 h-3.5" /> DISPATCH TEAM</>}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   COMMAND INSIGHTS — Light Theme
   ═══════════════════════════════════════════════════════ */
export default function CommandInsights({ goBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dispatched, setDispatched] = useState({});
  const [dispatchToast, setDispatchToast] = useState(false);
  const ist = useISTClock();

  useEffect(() => {
    setReports(SEED);
    setLoading(false);
    if (!db) return;
    let unsub;
    try {
      const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
      unsub = onSnapshot(q, snap => {
        const live = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setReports([...live, ...SEED]);
      }, () => { });
    } catch { }
    return () => { if (unsub) unsub(); };
  }, []);

  const handleResolve = async (id) => {
    if (id.startsWith('s')) { setReports(p => p.filter(r => r.id !== id)); return; }
    try { if (db) await deleteDoc(doc(db, 'reports', id)); } catch { }
  };

  const handleDispatch = (id) => {
    setDispatched(p => ({ ...p, [id]: true }));
    setDispatchToast(true);
    setTimeout(() => setDispatchToast(false), 2500);
  };

  const critCount = reports.filter(r => (r.ai_analysis?.severity || 0) > 80).length;
  const totalCluster = reports.reduce((s, r) => s + (r.cluster || 1), 0);

  /* ── STATS ── */
  const stats = [
    { label: 'ACTIVE INCIDENTS', value: reports.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
    { label: 'CRITICAL', value: critCount, icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
    { label: 'AFFECTED CLUSTERS', value: totalCluster, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
    { label: 'AVG CONFIDENCE', value: Math.round(reports.reduce((s, r) => s + (r.ai_analysis?.confidence || 0), 0) / reports.length) + '%', icon: Signal, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
    { label: 'RESPONSE RATE', value: '89%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-100' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col items-center justify-center text-[#1a2f23] gap-4 font-[Rajdhani]">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="text-sm font-bold uppercase tracking-[0.4em]">Initializing Map…</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#fafcfb] font-[Noto_Sans] text-[#111] flex flex-col overflow-hidden">

      {/* ═══ NAV BAR ═══ */}
      <nav className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1a2f23] text-white shrink-0 mx-2 mt-2 sm:mx-4 sm:mt-4 rounded-2xl shadow-xl shadow-[#1a2f23]/10 relative z-50">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-[Rajdhani] uppercase tracking-wider transition-all cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> EXIT
          </button>
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <div className="w-6 h-6 rounded bg-[#d4eedd] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-[#1a2f23]" />
            </div>
            <span className="text-sm font-bold font-[Rajdhani] uppercase tracking-[0.1em] text-white">KAVACH OPS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#d4eedd] animate-pulse" />
          <span className="text-sm font-bold font-[Rajdhani] uppercase tracking-[0.1em] text-[#d4eedd]">
            COMMAND CENTER
          </span>
        </div>

        <div className="flex items-center gap-5">
          <div className="hidden sm:block text-right">
            <p className="text-[9px] text-[#8ecf9f] uppercase tracking-widest font-bold font-[Rajdhani]">IST</p>
            <p className="text-sm font-bold font-mono text-white tabular-nums">{ist}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-[#8ecf9f] uppercase tracking-widest font-bold font-[Rajdhani]">STATUS</p>
            <p className="text-xs font-bold font-mono text-[#d4eedd]">● ONLINE</p>
          </div>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row p-2 sm:p-4 gap-4">

        {/* ── MAP PANEL ── */}
        <div className="flex-1 relative bg-white border border-[#e2f0e7] shadow-sm rounded-3xl overflow-hidden min-h-[400px] lg:min-h-0">
          <div className="absolute top-4 left-4 z-[400] flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur shadow-sm border border-[#e2f0e7]">
            <MapIcon className="w-4 h-4 text-[#1a2f23]" />
            <span className="text-[11px] font-bold font-[Rajdhani] uppercase tracking-[0.1em] text-[#1a2f23]">THREAT MAP</span>
            <span className="text-[9px] font-mono text-emerald-500 ml-1">● LIVE</span>
          </div>
          <TacticalMap reports={reports} onSelect={setSelected} />
        </div>

        {/* ── RIGHT COLUMN: STATS & QUEUE ── */}
        <div className="w-full lg:w-[420px] flex flex-col gap-4">

          {/* STATS BENTO */}
          <div className="bg-white rounded-3xl p-4 border border-[#e2f0e7] shadow-sm shrink-0">
            <h3 className="text-xs font-bold font-[Rajdhani] uppercase tracking-[0.15em] text-gray-500 mb-3 ml-1">Overview</h3>
            <div className="grid grid-cols-2 gap-2">
              {stats.slice(0, 4).map(s => (
                <div key={s.label} className={`flex items-center gap-3 p-3 rounded-2xl border ${s.bg}`}>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className={`text-lg font-bold font-[Rajdhani] ${s.color}`}>{s.value}</p>
                    <p className="text-[8px] text-gray-500 font-bold font-[Rajdhani] uppercase tracking-widest leading-none mt-0.5">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INCIDENT QUEUE */}
          <div className="flex-1 bg-white rounded-3xl border border-[#e2f0e7] shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#e2f0e7] flex items-center justify-between bg-[#fbfdfb] shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#1a2f23]" />
                <span className="text-sm font-bold font-[Rajdhani] uppercase tracking-[0.1em] text-[#1a2f23]">INCIDENT QUEUE</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#e2f0e7] text-[#1a2f23] px-2 py-0.5 rounded-full">{reports.length} ACTIVE</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f3f9f5]/30">
              {reports.map(r => (
                <IncidentCard
                  key={r.id}
                  r={r}
                  dispatched={!!dispatched[r.id]}
                  onDispatch={handleDispatch}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ═══ DISPATCH TOAST ═══ */}
      {dispatchToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-[slideUp_0.3s_ease-out]">
          <div className="flex items-center gap-3 px-5 py-3 bg-[#1a2f23] text-white rounded-2xl shadow-2xl">
            <CheckCircle className="w-5 h-5 text-[#d4eedd]" />
            <div>
              <p className="text-sm font-bold font-[Rajdhani] uppercase tracking-wider">Dispatch Sent</p>
              <p className="text-[11px] text-[#a3c9b3] font-[Noto_Sans]">Volunteer team has been notified.</p>
            </div>
          </div>
        </div>
      )}

      {/* ═══ KEYFRAMES ═══ */}
      <style>{`
        @keyframes rippleOut {
          0%   { transform:scale(1); opacity:0.6; }
          100% { transform:scale(2.5); opacity:0; }
        }
        @keyframes slideUp {
          from { opacity:0; transform:translate(-50%,20px); }
          to   { opacity:1; transform:translate(-50%,0); }
        }
        .line-clamp-2 {
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); border-radius:10px; }
        ::-webkit-scrollbar-thumb:hover { background:rgba(0,0,0,0.2); }
      `}</style>
    </div>
  );
}
