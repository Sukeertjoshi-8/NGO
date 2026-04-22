import { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  UserCircle,
  Lock,
  AlertTriangle,
  Users,
  Radio,
  MapPin,
  Activity,
  Bell,
  Flame,
  Droplets,
  Ambulance,
  CheckCircle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Mock data
   ═══════════════════════════════════════════════════════ */
const MOCK_ALERTS = [
  {
    id: 1,
    type: 'Fire/Smoke',
    emoji: '🔥',
    icon: Flame,
    location: 'Sector 14, Noida',
    distance: '2.3 km',
    severity: 'Critical',
    sevColor: 'bg-red-500/20 text-red-400',
    time: '3 min ago',
  },
  {
    id: 2,
    type: 'Flood/Water',
    emoji: '🌊',
    icon: Droplets,
    location: 'Yamuna Ghat, Delhi',
    distance: '5.1 km',
    severity: 'High',
    sevColor: 'bg-amber-500/20 text-amber-400',
    time: '12 min ago',
  },
  {
    id: 3,
    type: 'Medical Emergency',
    emoji: '🚑',
    icon: Ambulance,
    location: 'Laxmi Nagar, Delhi',
    distance: '1.8 km',
    severity: 'Medium',
    sevColor: 'bg-blue-500/20 text-blue-400',
    time: '28 min ago',
  },
];

/* ═══════════════════════════════════════════════════════
   AdminDashboard — Dark themed Admin Panel
   ═══════════════════════════════════════════════════════ */
export default function AdminDashboard({ goBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* ── Login Screen ────────────────────────── */
  if (!isLoggedIn) {
    return (
      <div
        className="min-h-screen bg-slate-950 flex flex-col font-[Manrope,sans-serif] relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Glow */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-blue-500/15 blur-[120px] rounded-full" />
        </div>

        {/* Back */}
        <div className="relative z-10 px-5 pt-5">
          <button
            id="btn-admin-login-back"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Login card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-8 w-full max-w-sm animate-[fadeInUp_0.45s_ease-out]">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-400" strokeWidth={1.8} />
            </div>

            <h1 className="text-xl font-extrabold text-white text-center font-[Plus_Jakarta_Sans,sans-serif]">
              Admin Login
            </h1>
            <p className="text-sm text-slate-400 text-center mt-1 mb-6">
              NGO Command Center Access
            </p>

            {/* Email */}
            <label className="block mb-4" htmlFor="admin-email">
              <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3.5 focus-within:border-blue-500/40 transition-all">
                <UserCircle className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.6} />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block mb-6" htmlFor="admin-password">
              <div className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 py-3.5 focus-within:border-blue-500/40 transition-all">
                <Lock className="w-5 h-5 text-slate-500 shrink-0" strokeWidth={1.6} />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-slate-500 font-medium"
                />
              </div>
            </label>

            <button
              id="btn-admin-authenticate"
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Access Command Center
            </button>

            <p className="text-[11px] text-slate-500 text-center mt-4 leading-relaxed">
              Authorized NGO administrators only.
            </p>
          </div>
        </main>

        <style>{keyframes}</style>
      </div>
    );
  }

  /* ── Admin Dashboard ─────────────────────── */
  return (
    <div
      className="min-h-screen bg-slate-950 font-[Manrope,sans-serif] relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-8 pt-6 pb-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            id="btn-admin-back"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 font-semibold text-sm hover:bg-white/[0.1] active:scale-95 transition-all duration-200 cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif] tracking-tight">
              Admin{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Real-time alerts and volunteer management.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-8 pb-10 max-w-[1440px] mx-auto">
        {/* ── Stats Row ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { value: '12', label: 'Active Alerts', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { value: '47', label: 'Volunteers On Duty', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { value: '3', label: 'Critical Zones', icon: Radio, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { value: '89%', label: 'Response Rate', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 animate-[fadeInUp_0.4s_ease-out_both]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.8} />
              </div>
              <p className="text-2xl font-extrabold text-white font-[Plus_Jakarta_Sans,sans-serif]">
                {stat.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Alerts List ─────────────────────── */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden animate-[fadeInUp_0.45s_ease-out_0.3s_both]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-400" strokeWidth={1.8} />
              </div>
              <h2 className="text-base font-bold text-white font-[Plus_Jakarta_Sans,sans-serif]">
                Nearby Alerts
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Live</span>
            </div>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {MOCK_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className="px-6 py-5 hover:bg-white/[0.03] transition-colors duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                    <alert.icon className="w-5 h-5 text-slate-400" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">
                        {alert.emoji} {alert.type}
                      </p>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${alert.sevColor}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span>•</span>
                      <span>{alert.distance}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                  <button className="shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
                    Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-slate-600 tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">
          KAVACH Admin Panel v1.0
        </p>
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
