import { useState } from 'react';
import {
  UserCircle, Bell, AlertTriangle, ShieldCheck, Map, Shield,
  UserCog, HandHelping, Building2, X, ChevronRight, Zap, Radio
} from 'lucide-react';
import DisasterReportForm from './DisasterReportForm';
import CommandInsights from './CommandInsights';
import VolunteerPortal from './VolunteerPortal';
import AdminDashboard from './AdminDashboard';

const ALERTS = [
  { id:1, text:'Yamuna Flood — Delhi', severity:92, time:'5m ago' },
  { id:2, text:'Factory Fire — Surat', severity:88, time:'15m ago' },
  { id:3, text:'Building Collapse — Bhuj', severity:95, time:'25m ago' },
];

/* ═══ India Map (Light/Mint Aesthetic) ═══ */
import { useEffect, useRef } from 'react';

function LightIndiaMap() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);

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
      
      // Center on India, disable all interaction for a "display only" widget
      const map = L.map(mapRef.current, { 
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
      }).setView([22.5, 79], 4);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', { 
        attribution: '', maxZoom: 18 
      }).addTo(map);
      
      mapInst.current = map;

      // Fix for Leaflet rendering issues
      setTimeout(() => {
        if (mapInst.current) {
          mapInst.current.invalidateSize();
          mapInst.current.setView([22.5, 79], 4);
        }
      }, 500);

      // Add dummy hotspots
      const spots = [
        { lat: 28.6139, lng: 77.2090, color: '#ef4444' }, // Delhi (Red)
        { lat: 19.0760, lng: 72.8777, color: '#f97316' }, // Mumbai (Orange)
        { lat: 13.0827, lng: 80.2707, color: '#10b981' }, // Chennai (Green)
        { lat: 22.5726, lng: 88.3639, color: '#10b981' }  // Kolkata (Green)
      ];

      spots.forEach((s, i) => {
        const sz = s.color === '#ef4444' ? 16 : 12;
        const icon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:${sz}px;height:${sz}px;">
            <div style="position:absolute;inset:0;background:${s.color};border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 8px ${s.color};"></div>
            <div style="position:absolute;inset:-6px;border:2px solid ${s.color};border-radius:50%;opacity:0;animation:rippleOut 2s ease-out ${i * 0.5}s infinite;"></div>
          </div>`,
          iconSize: [sz, sz], iconAnchor: [sz / 2, sz / 2],
        });
        L.marker([s.lat, s.lng], { icon }).addTo(map);
      });
    };
    init();
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex flex-col bg-[#f3f9f5] rounded-3xl overflow-hidden border border-[#e2f0e7] shadow-inner">
      {/* The Map */}
      <div className="relative flex-1 w-full" style={{ minHeight: '300px' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#eaf5ef' }} />
        
        {/* Floating UI Elements over Map */}
        <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-sm border border-[#e2f0e7] flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-[#1a2f23]" />
          <span className="text-[10px] font-bold text-[#1a2f23] uppercase tracking-wider">Active Monitoring</span>
        </div>
        <div className="absolute bottom-4 right-4 z-[400] bg-[#1a2f23] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-white tracking-widest">4 ZONES</span>
        </div>
      </div>

      {/* Bar Graphs Section (Bottom) */}
      <div className="h-28 bg-white border-t border-[#e2f0e7] p-4 flex items-end justify-between gap-2 z-[400] relative">
        <div className="absolute top-2 left-4 text-[10px] font-bold font-[Rajdhani] uppercase tracking-wider text-gray-400">Response Metrics</div>
        {[40, 70, 45, 90, 60, 30, 80, 50, 85, 65, 35, 75, 55, 95].map((val, i) => (
          <div key={i} className="relative flex-1 flex flex-col justify-end items-center group h-full pt-4">
            <div className="w-full max-w-[12px] rounded-t-sm transition-all duration-500 ease-out hover:bg-emerald-400 cursor-pointer" 
                 style={{ height: val + '%', backgroundColor: val > 80 ? '#ef4444' : val > 50 ? '#f97316' : '#d4eedd' }} />
            {/* Tooltip on hover */}
            <div className="absolute -top-8 bg-[#1a2f23] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-mono z-[500]">
              {val} INC
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KavachShell() {
  const [activeView, setActiveView] = useState('home');

  if (activeView === 'public') return <DisasterReportForm onBack={() => setActiveView('home')} />;
  if (activeView === 'insights') return <CommandInsights goBack={() => setActiveView('home')} />;
  if (activeView === 'volunteer') return <VolunteerPortal goBack={() => setActiveView('home')} />;
  if (activeView === 'admin') return <AdminDashboard goBack={() => setActiveView('home')} />;

  return (
    <div className="min-h-screen bg-[#fafcfb] font-[Noto_Sans] text-[#111] overflow-hidden">
      <TopBar />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[Rajdhani] text-[#1a2f23] tracking-tight leading-[1.1]">
            Faster Response,<br />
            Bigger Impact
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-500 font-medium">
            AI-driven disaster management. Report emergencies, coordinate volunteers, and deploy resources faster than ever before.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
          
          {/* Card 1: Map / Command Insights */}
          <div className="bg-white rounded-3xl p-2 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e2f0e7] lg:row-span-2 flex flex-col group transition-transform hover:-translate-y-1 duration-300">
            <div className="p-6 pb-4">
              <h2 className="text-2xl font-bold font-[Rajdhani] text-[#1a2f23]">Command Insights</h2>
              <p className="text-sm text-neutral-500 mt-1">Real-time geographical tracking of disaster hotspots and volunteer deployments across India.</p>
            </div>
            <div className="flex-1 p-2 pt-0">
              <LightIndiaMap />
            </div>
            <div className="p-4 pt-2">
              <button onClick={() => setActiveView('insights')} className="w-full py-3 bg-[#d4eedd] hover:bg-[#c2e4ce] text-[#1a2f23] rounded-xl font-bold font-[Rajdhani] uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2">
                Open Dashboard <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Public Report */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#e2f0e7] flex flex-col justify-between group transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <AlertTriangle className="w-32 h-32 text-[#1a2f23]" />
            </div>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#d4eedd] flex items-center justify-center mb-5">
                <AlertTriangle className="w-6 h-6 text-[#1a2f23]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold font-[Rajdhani] text-[#1a2f23]">Emergency Report</h2>
              <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-sm">
                In danger? Submit a report immediately. No login required. AI automatically processes your image and location.
              </p>
            </div>
            <div className="mt-6">
              <button onClick={() => setActiveView('public')} className="px-6 py-3 bg-[#1a2f23] hover:bg-[#254231] text-white rounded-xl font-bold font-[Rajdhani] uppercase tracking-wider text-sm transition-colors shadow-lg shadow-[#1a2f23]/20">
                Report Now
              </button>
            </div>
          </div>

          {/* Card 3: NGO Access */}
          <div className="bg-[#1a2f23] rounded-3xl p-6 shadow-xl shadow-[#1a2f23]/10 flex flex-col justify-between text-white transition-transform hover:-translate-y-1 duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 text-[#d4eedd]" strokeWidth={2} />
              </div>
              <h2 className="text-2xl font-bold font-[Rajdhani]">NGO & Responders</h2>
              <p className="text-sm text-[#a3c9b3] mt-2 leading-relaxed">
                Log in to coordinate your team, accept dispatch requests, and manage ground operations.
              </p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setActiveView('admin')} className="flex-1 px-4 py-3 bg-[#d4eedd] hover:bg-white text-[#1a2f23] rounded-xl font-bold font-[Rajdhani] uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                <UserCog className="w-4 h-4" /> Admin Login
              </button>
              <button onClick={() => setActiveView('volunteer')} className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-bold font-[Rajdhani] uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2">
                <HandHelping className="w-4 h-4" /> Volunteer Login
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center py-8 text-neutral-400 text-xs font-bold font-[Rajdhani] tracking-widest uppercase">
        KAVACH v2.0 • Tactical Light Theme
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Top Bar (Dark Green style)
   ═══════════════════════════════════════════════════════ */
function TopBar() {
  const [showCreds, setShowCreds] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <nav className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-[#1a2f23] text-white mx-4 mt-4 rounded-2xl shadow-xl shadow-[#1a2f23]/10 relative z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#d4eedd] flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#1a2f23]" />
        </div>
        <span className="text-lg font-bold font-[Rajdhani] uppercase tracking-[0.1em]">KAVACH</span>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a3c9b3]">
        <span className="hover:text-white cursor-pointer transition-colors">Agencies</span>
        <span className="hover:text-white cursor-pointer transition-colors">Volunteers</span>
        <span className="hover:text-white cursor-pointer transition-colors">About</span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        
        {/* Alerts */}
        <div className="relative">
          <button onClick={() => { setShowAlerts(v=>!v); setShowCreds(false); }} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors relative cursor-pointer">
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full border border-[#1a2f23]" />
          </button>
          
          {showAlerts && (
            <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-slate-800">
              <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold font-[Rajdhani] text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Active Alerts
                </span>
                <button onClick={()=>setShowAlerts(false)} className="text-gray-400 hover:text-gray-800"><X className="w-4 h-4"/></button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {ALERTS.map(a => (
                  <div key={a.id} className="px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold">{a.text}</span>
                      <span className="text-[10px] font-mono bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">LVL {a.severity}</span>
                    </div>
                    <p className="text-xs text-gray-500">{a.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Credentials / Login */}
        <div className="relative">
          <button onClick={() => { setShowCreds(v=>!v); setShowAlerts(false); }} className="px-4 py-2.5 rounded-xl bg-[#d4eedd] hover:bg-[#c2e4ce] text-[#1a2f23] font-bold font-[Rajdhani] text-sm uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-[#d4eedd]/20">
            <UserCircle className="w-4 h-4" /> Demo Login
          </button>

          {showCreds && (
            <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 z-50 text-slate-800">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold font-[Rajdhani] text-sm uppercase tracking-wider text-gray-400">Test Accounts</span>
                <button onClick={()=>setShowCreds(false)} className="text-gray-400 hover:text-gray-800"><X className="w-4 h-4"/></button>
              </div>
              <div className="space-y-3">
                <div className="bg-[#f3f9f5] rounded-xl p-3 border border-[#e2f0e7]">
                  <p className="text-[10px] font-bold font-[Rajdhani] text-[#1a2f23] uppercase tracking-widest mb-1">Admin</p>
                  <p className="text-[11px] font-mono text-gray-600">admin@kavach.org<br/>command2024</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] font-bold font-[Rajdhani] text-gray-500 uppercase tracking-widest mb-1">Volunteer</p>
                  <p className="text-[11px] font-mono text-gray-600">VOL-001<br/>kavach2024</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
