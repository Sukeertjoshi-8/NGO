import { useState } from 'react';
import {
  ArrowLeft,
  Map,
  Brain,
  Flame,
  Droplets,
  Ambulance,
  Users,
  AlertTriangle,
  Radio,
  Send,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Dummy incident data
   ═══════════════════════════════════════════════════════ */
const INCIDENTS = [
  {
    id: 1, emoji: '🔥', category: 'Fire/Smoke', icon: Flame,
    description: 'Warehouse fire reported near Sector 14. Multiple structures at risk.',
    confidence: 92,
    pillBg: 'bg-orange-500/15', pillText: 'text-orange-400',
  },
  {
    id: 2, emoji: '🌊', category: 'Flood/Water', icon: Droplets,
    description: 'Rising water levels at Yamuna Ghat. Evacuation needed for 200+ families.',
    confidence: 67,
    pillBg: 'bg-sky-500/15', pillText: 'text-sky-400',
  },
  {
    id: 3, emoji: '🚑', category: 'Medical Emergency', icon: Ambulance,
    description: 'Collapsed structure, 3 individuals trapped. First responders en route.',
    confidence: 45,
    pillBg: 'bg-rose-500/15', pillText: 'text-rose-400',
  },
];

function confidenceBadge(score) {
  if (score > 80) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'High' };
  if (score >= 50) return { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Medium' };
  return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Low' };
}

/* ═══════════════════════════════════════════════════════
   CommandInsights — Dark Theme
   ═══════════════════════════════════════════════════════ */
export default function CommandInsights({ goBack }) {
  const [dispatched, setDispatched] = useState({});
  const handleDispatch = (id) => setDispatched((prev) => ({ ...prev, [id]: true }));

  const darkBg = {
    backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  return (
    <div className="min-h-screen bg-slate-950 font-[Manrope,sans-serif] relative overflow-hidden" style={darkBg}>
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-8 pt-6 pb-2 max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <button id="btn-back-home" onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 font-semibold text-sm hover:bg-white/[0.1] active:scale-95 transition-all duration-200 cursor-pointer w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif] tracking-tight">
              Command Center:{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Live Heatmap & Dispatch
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Real-time incident monitoring and AI-prioritized dispatch queue.
            </p>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-10 px-4 sm:px-8 py-6 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT — Map */}
          <section className="lg:col-span-2">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden animate-[fadeInUp_0.45s_ease-out]">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                    <Map className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
                  </div>
                  <h2 className="text-base font-bold text-white font-[Plus_Jakarta_Sans,sans-serif]">Live Incident Map</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live</span>
                </div>
              </div>

              <div className="w-full bg-slate-900">
                <iframe
                  title="KAVACH Live Command Map" width="100%" height="550"
                  src="https://felt.com/embed/map/Untitled-Map-UnYjmuU6S7Cw5JqsRDOgFD?loc=12.9716%2C77.5946%2C14z&legend=1&cooperativeGestures=1&link=1&geolocation=0&zoomControls=1&scaleBar=1"
                  frameBorder="0" referrerPolicy="strict-origin-when-cross-origin" style={{ display: 'block' }}
                />
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
                {[
                  { value: '12', label: 'Active Incidents', icon: AlertTriangle, color: 'text-red-400' },
                  { value: '47', label: 'Volunteers Deployed', icon: Users, color: 'text-emerald-400' },
                  { value: '3', label: 'Critical Zones', icon: Radio, color: 'text-indigo-400' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-center gap-3 py-4 px-2">
                    <stat.icon className={`w-4 h-4 ${stat.color} shrink-0`} strokeWidth={2} />
                    <div className="text-center sm:text-left">
                      <p className="text-lg font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif] leading-none">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT — AI Queue */}
          <section className="lg:col-span-1">
            <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
              <div className="flex items-center gap-3 px-6 py-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
                </div>
                <h2 className="text-base font-bold text-white font-[Plus_Jakarta_Sans,sans-serif]">AI Priority Queue</h2>
              </div>

              <div className="overflow-y-auto max-h-[600px] px-4 pb-4 space-y-4 scroll-smooth">
                {INCIDENTS.map((incident, idx) => {
                  const badge = confidenceBadge(incident.confidence);
                  const isDispatched = dispatched[incident.id];
                  return (
                    <div key={incident.id}
                      className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.06] transition-colors duration-200 animate-[fadeInUp_0.4s_ease-out_both]"
                      style={{ animationDelay: `${(idx + 1) * 120}ms` }}>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${incident.pillBg} ${incident.pillText}`}>
                        <span>{incident.emoji}</span> {incident.category}
                      </span>
                      <p className="mt-3 text-sm text-slate-300 leading-relaxed">{incident.description}</p>
                      <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                          <span className="text-[10px] font-semibold uppercase tracking-wide">AI Confidence:</span> {incident.confidence}%
                        </div>
                        {isDispatched ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">✓ Dispatched</span>
                        ) : (
                          <button id={`btn-dispatch-${incident.id}`} onClick={() => handleDispatch(incident.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                            <Send className="w-3 h-3" /> Dispatch Volunteers
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-slate-600 tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">
          Powered by KAVACH Intelligence Engine v1.0
        </p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
