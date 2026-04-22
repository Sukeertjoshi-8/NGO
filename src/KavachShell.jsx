import { useState } from 'react';
import {
  UserCircle,
  Bell,
  AlertTriangle,
  ShieldCheck,
  Map,
  Shield,
  UserCog,
  HandHelping,
  Building2,
} from 'lucide-react';
import DisasterReportForm from './DisasterReportForm';
import CommandInsights from './CommandInsights';
import VolunteerPortal from './VolunteerPortal';
import AdminDashboard from './AdminDashboard';

/* ═══════════════════════════════════════════════════════
   KAVACH — Master App Shell / Landing Page
   Dark Command Center — India Map Background
   ═══════════════════════════════════════════════════════ */

export default function KavachShell() {
  const [activeView, setActiveView] = useState('home');

  /* ── Portal views ────────────────────────── */
  if (activeView === 'public')
    return <DisasterReportForm onBack={() => setActiveView('home')} />;
  if (activeView === 'insights')
    return <CommandInsights goBack={() => setActiveView('home')} />;
  if (activeView === 'volunteer')
    return <VolunteerPortal goBack={() => setActiveView('home')} />;
  if (activeView === 'admin')
    return <AdminDashboard goBack={() => setActiveView('home')} />;

  /* ── Home / Landing view ───────────────────── */
  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col font-[Manrope,sans-serif] relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* India map watermark */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <img
          src="/india-map.png"
          alt=""
          className="w-[700px] h-auto opacity-[0.06] select-none"
          draggable={false}
        />
      </div>

      {/* Radial glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[600px] h-[600px] bg-indigo-500/15 blur-[120px] rounded-full" />
      </div>

      <DarkNavBar />

      {/* ── Hero ───────────────────────────────── */}
      <section className="relative z-10 pt-28 sm:pt-36 pb-6 text-center px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-[Plus_Jakarta_Sans,sans-serif] leading-tight">
          Disaster Response,{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Reimagined.
          </span>
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Choose your portal to report, respond, or command.
        </p>
      </section>

      {/* ── Portal Cards ───────────────────────── */}
      <section className="relative z-10 flex-1 px-4 sm:px-8 pb-16 pt-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* ── CARD 1: Public Emergency Report ──── */}
          <button
            id="card-public"
            onClick={() => setActiveView('public')}
            className="group relative text-left rounded-2xl p-8
              bg-white/[0.04] backdrop-blur-md border border-white/[0.08]
              hover:bg-white/[0.08] hover:-translate-y-1.5 hover:border-red-500/50
              hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]
              active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer
              animate-[fadeInUp_0.5s_ease-out_both]"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <AlertTriangle className="w-7 h-7 text-red-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-[Plus_Jakarta_Sans,sans-serif]">
              Public Emergency Report
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              No login required. Report immediate danger and auto-fetch GPS.
            </p>
            <span className="text-sm font-semibold text-red-400 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
              Report Now
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          {/* ── CARD 2: NGO Login ───────────────── */}
          <div
            className="group relative text-left rounded-2xl p-8
              bg-white/[0.04] backdrop-blur-md border border-white/[0.08]
              animate-[fadeInUp_0.5s_ease-out_0.1s_both]"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-blue-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-[Plus_Jakarta_Sans,sans-serif]">
              NGO Login
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Secure access for verified NGO personnel.
            </p>

            {/* Admin button */}
            <button
              id="btn-login-admin"
              onClick={() => setActiveView('admin')}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl
                bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm
                shadow-lg shadow-blue-500/20
                hover:shadow-xl hover:scale-[1.02] hover:from-blue-500 hover:to-indigo-500
                active:scale-[0.98] transition-all duration-200 cursor-pointer mb-3"
            >
              <UserCog className="w-4 h-4" />
              Login as Admin
            </button>

            {/* Volunteer button */}
            <button
              id="btn-login-volunteer"
              onClick={() => setActiveView('volunteer')}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl
                bg-white/[0.06] border border-white/[0.12] text-slate-200 font-semibold text-sm
                hover:bg-white/[0.1] hover:border-blue-500/40
                active:scale-[0.98] transition-all duration-200 cursor-pointer mb-4"
            >
              <HandHelping className="w-4 h-4" />
              Login as Volunteer
            </button>

            {/* Register NGO */}
            <button
              id="btn-register-ngo"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold
                text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              Register your NGO
            </button>
          </div>

          {/* ── CARD 3: Command Insights ─────────── */}
          <button
            id="card-insights"
            onClick={() => setActiveView('insights')}
            className="group relative text-left rounded-2xl p-8
              bg-white/[0.04] backdrop-blur-md border border-white/[0.08]
              hover:bg-white/[0.08] hover:-translate-y-1.5 hover:border-indigo-500/50
              hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]
              active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer
              animate-[fadeInUp_0.5s_ease-out_0.2s_both]"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <Map className="w-7 h-7 text-indigo-400" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-[Plus_Jakarta_Sans,sans-serif]">
              Command Insights
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              NGO Dashboard: AI priority heatmaps, verified data, and live volunteer tracking.
            </p>
            <span className="text-sm font-semibold text-indigo-400 inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
              Enter Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-slate-600 tracking-widest uppercase font-[Plus_Jakarta_Sans,sans-serif]">
          KAVACH v1.0 — Built for Resilience
        </p>
      </footer>

      <style>{sharedKeyframes}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DarkNavBar
   ═══════════════════════════════════════════════════════ */
function DarkNavBar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8 bg-white/[0.04] backdrop-blur-[32px] border-b border-white/[0.08]">
      <button id="btn-user-avatar" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer" aria-label="Account">
        <UserCircle className="w-5 h-5 text-slate-300" strokeWidth={1.6} />
      </button>
      <div className="flex items-center gap-2.5">
        <Shield className="w-5 h-5 text-indigo-400" strokeWidth={2} />
        <span className="text-sm font-extrabold tracking-[0.2em] uppercase text-white font-[Plus_Jakarta_Sans,sans-serif]" style={{ textShadow: '0 0 20px rgba(129,140,248,0.4)' }}>
          KAVACH
        </span>
      </div>
      <button id="btn-alerts" className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors cursor-pointer" aria-label="Alerts">
        <Bell className="w-5 h-5 text-slate-300" strokeWidth={1.6} />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-950 animate-pulse" />
      </button>
    </nav>
  );
}

const sharedKeyframes = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
