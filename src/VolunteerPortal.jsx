import { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Power,
  Navigation,
  UserCircle,
  Lock,
  ClipboardList,
  MapPin,
  Brain,
  Clock,
  CheckCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════════════════ */
const MOCK_ALERT = {
  type: 'Medical Emergency',
  emoji: '🚑',
  description: 'Collapsed structure with trapped individuals near Yamuna Ghat area.',
  distance: '1.2 km',
  confidence: 95,
  eta: '~4 min by foot',
};

const MOCK_TASKS = [
  {
    id: 1,
    title: 'Debris Clearing - Sector 4',
    status: 'In Progress',
    statusColor: 'bg-amber-500/20 text-amber-400',
    assigned: '2h ago',
    volunteers: 3,
  },
];

/* ═══════════════════════════════════════════════════════
   VolunteerPortal — Dark Themed Field Operative Dashboard
   ═══════════════════════════════════════════════════════ */
export default function VolunteerPortal({ goBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [volunteerId, setVolunteerId] = useState('');
  const [password, setPassword] = useState('');
  const [alertAccepted, setAlertAccepted] = useState(false);
  const [alertPassed, setAlertPassed] = useState(false);

  const darkBg = {
    backgroundImage:
      'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  /* ── VIEW 1: Login ─────────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-[Manrope,sans-serif] relative overflow-hidden" style={darkBg}>
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 px-5 pt-5">
          <button id="btn-login-back" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 w-full max-w-sm animate-[fadeInUp_0.45s_ease-out]">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400" strokeWidth={1.8} />
            </div>

            <h1 className="text-xl font-extrabold text-white text-center font-[Plus_Jakarta_Sans,sans-serif]">
              KAVACH Field Operative
            </h1>
            <p className="text-sm text-slate-400 text-center mt-1 mb-6">
              Secure volunteer authentication
            </p>

            <label className="block mb-4" htmlFor="input-volunteer-id">
              <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3.5 focus-within:border-emerald-500/40 transition-all">
                <UserCircle className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.6} />
                <input id="input-volunteer-id" type="text" placeholder="Volunteer ID" value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 font-medium" />
              </div>
            </label>

            <label className="block mb-6" htmlFor="input-password">
              <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3.5 focus-within:border-emerald-500/40 transition-all">
                <Lock className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.6} />
                <input id="input-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 font-medium" />
              </div>
            </label>

            <button id="btn-authenticate" onClick={() => setIsLoggedIn(true)} className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer">
              Authenticate Securely
            </button>

            <p className="text-[11px] text-slate-500 text-center mt-4 leading-relaxed">
              Verified credentials only. Contact HQ for access.
            </p>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    );
  }

  /* ── VIEW 2: Field Dashboard ───────────────── */
  return (
    <div className="min-h-screen bg-slate-950 font-[Manrope,sans-serif] relative overflow-hidden" style={darkBg}>
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 px-5 pt-5 pb-2 flex items-center justify-between">
        <button id="btn-dashboard-back" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs font-bold tracking-widest uppercase text-slate-500 font-[Plus_Jakarta_Sans,sans-serif]" style={{ textShadow: '0 0 20px rgba(129,140,248,0.3)' }}>
          KAVACH
        </span>
      </header>

      <main className="relative z-10 px-5 pb-10 max-w-lg mx-auto">
        <div className="mb-6 animate-[fadeInUp_0.35s_ease-out]">
          <h1 className="text-xl font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif]">
            KAVACH Field Operative
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back, Operative.</p>
        </div>

        {/* Status Toggle */}
        <div className={`rounded-2xl p-5 mb-6 transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_0.05s_both] border ${
          isOnDuty ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.04] border-white/[0.08]'
        }`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${isOnDuty ? 'bg-emerald-500/20' : 'bg-white/[0.06]'}`}>
                <Power className={`w-6 h-6 transition-colors duration-300 ${isOnDuty ? 'text-emerald-400' : 'text-slate-500'}`} strokeWidth={2} />
              </div>
              <div>
                <p className={`text-sm font-extrabold font-[Plus_Jakarta_Sans,sans-serif] transition-colors duration-300 ${isOnDuty ? 'text-emerald-400' : 'text-white'}`}>
                  {isOnDuty ? 'ON DUTY' : 'Off Duty'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  {isOnDuty ? 'Tracking Location • Receiving Alerts' : 'Not receiving dispatch alerts'}
                </p>
              </div>
            </div>
            <button id="btn-duty-toggle" onClick={() => { setIsOnDuty(v => !v); setAlertAccepted(false); setAlertPassed(false); }}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer shrink-0 ${isOnDuty ? 'bg-emerald-500' : 'bg-slate-600'}`}
              aria-label="Toggle duty status">
              <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isOnDuty ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Dispatch Alert */}
        {isOnDuty && !alertAccepted && !alertPassed && (
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl border-l-4 border-l-red-500 p-5 mb-6 animate-[fadeInUp_0.4s_ease-out]">
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-400 font-[Plus_Jakarta_Sans,sans-serif]">
                Urgent Dispatch
              </span>
            </div>
            <p className="text-lg font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif] mb-1">
              {MOCK_ALERT.emoji} {MOCK_ALERT.type}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{MOCK_ALERT.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/[0.06] rounded-xl px-3 py-2.5 text-center">
                <MapPin className="w-4 h-4 text-indigo-400 mx-auto mb-1" strokeWidth={2} />
                <p className="text-xs font-bold text-white">{MOCK_ALERT.distance}</p>
                <p className="text-[10px] text-slate-500">Distance</p>
              </div>
              <div className="bg-emerald-500/10 rounded-xl px-3 py-2.5 text-center">
                <Brain className="w-4 h-4 text-emerald-400 mx-auto mb-1" strokeWidth={2} />
                <p className="text-xs font-bold text-emerald-400">{MOCK_ALERT.confidence}%</p>
                <p className="text-[10px] text-emerald-500">AI Confidence</p>
              </div>
              <div className="bg-white/[0.06] rounded-xl px-3 py-2.5 text-center">
                <Clock className="w-4 h-4 text-indigo-400 mx-auto mb-1" strokeWidth={2} />
                <p className="text-xs font-bold text-white">{MOCK_ALERT.eta}</p>
                <p className="text-[10px] text-slate-500">ETA</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button id="btn-accept-dispatch" onClick={() => setAlertAccepted(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer">
                <Navigation className="w-4 h-4" /> Accept & Route
              </button>
              <button id="btn-pass-dispatch" onClick={() => setAlertPassed(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 font-bold text-sm hover:bg-white/[0.1] active:scale-95 transition-all duration-200 cursor-pointer">
                Pass to Next
              </button>
            </div>
          </div>
        )}

        {/* Accepted */}
        {isOnDuty && alertAccepted && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mb-6 text-center animate-[fadeInUp_0.4s_ease-out]">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-400" strokeWidth={2} />
            </div>
            <p className="text-base font-extrabold text-emerald-400 font-[Plus_Jakarta_Sans,sans-serif]">Dispatch Accepted</p>
            <p className="text-sm text-emerald-500 mt-1">Routing to incident location… ETA {MOCK_ALERT.eta}.</p>
          </div>
        )}

        {/* Passed */}
        {isOnDuty && alertPassed && (
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 mb-6 text-center animate-[fadeInUp_0.4s_ease-out]">
            <p className="text-sm font-bold text-slate-400">Alert forwarded to the next available volunteer.</p>
          </div>
        )}

        {/* Active Tasks */}
        <div className="animate-[fadeInUp_0.45s_ease-out_0.15s_both]">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="w-5 h-5 text-indigo-400" strokeWidth={1.8} />
            <h2 className="text-sm font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif]">Current Assignments</h2>
          </div>
          {MOCK_TASKS.map((task) => (
            <div key={task.id} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 hover:bg-white/[0.06] transition-colors duration-200">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">{task.title}</p>
                  <p className="text-xs text-slate-400 mt-1">Assigned {task.assigned} • {task.volunteers} volunteers on-site</p>
                </div>
                <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-bold ${task.statusColor}`}>{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-[10px] text-slate-600 tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">KAVACH Field Network v1.0</p>
      </footer>
      <style>{keyframes}</style>
    </div>
  );
}

const keyframes = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
