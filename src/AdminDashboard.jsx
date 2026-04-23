import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
  ArrowLeft, Shield, UserCircle, Lock, AlertTriangle, Users,
  Radio, MapPin, Activity, Bell, CheckCircle, Loader2
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   AdminDashboard — Light Theme Admin Panel
   ═══════════════════════════════════════════════════════ */
const ADMIN_CREDS = [
  { email: 'admin@kavach.org', password: 'command2024' },
  { email: 'ngo@freehelp.in', password: 'relief99' },
];

const SEED_ALERTS = [
  { id: 'sa1', description: 'Massive flooding in residential colony near Yamuna banks', urgency_category: 'Flood/Water', lat: 28.6139, lng: 77.2090, image_url: '/crisis/flood_delhi.png', ai_analysis: { severity: 92, category: 'Flood', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 300 } },
  { id: 'sa2', description: 'Factory fire spreading to adjacent buildings in Surat industrial area', urgency_category: 'Fire/Smoke', lat: 21.1702, lng: 72.8311, image_url: '/crisis/fire_surat.png', ai_analysis: { severity: 88, category: 'Fire', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 900 } },
  { id: 'sa3', description: 'Building collapse after earthquake tremors in Bhuj', urgency_category: 'Structural Damage', lat: 23.2420, lng: 69.6669, image_url: '/crisis/collapse_bhuj.png', ai_analysis: { severity: 95, category: 'Accident', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 1500 } },
  { id: 'sa4', description: 'Train derailment near Balasore — multiple casualties', urgency_category: 'Medical Emergency', lat: 21.4934, lng: 86.9337, image_url: '/crisis/train_balasore.png', ai_analysis: { severity: 97, category: 'Accident', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 5400 } },
  { id: 'sa5', description: 'Chemical gas leak from refinery in Vizag industrial zone', urgency_category: 'Medical Emergency', lat: 17.6868, lng: 83.2185, image_url: '/crisis/gasleak_vizag.png', ai_analysis: { severity: 91, category: 'Medical', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 4200 } },
  { id: 'sa6', description: 'Cyclone damage — roofs torn off in Puri coastal village', urgency_category: 'Flood/Water', lat: 19.7983, lng: 85.8315, image_url: '/crisis/cyclone_puri.png', ai_analysis: { severity: 85, category: 'Flood', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 3600 } },
  { id: 'sa7', description: 'Flash floods washing away bridges in Wayanad', urgency_category: 'Flood/Water', lat: 11.6854, lng: 76.1320, image_url: '/crisis/flood_wayanad.png', ai_analysis: { severity: 83, category: 'Flood', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 6000 } },
  { id: 'sa8', description: 'Landslide blocking NH-5 highway near Shimla', urgency_category: 'Structural Damage', lat: 31.1048, lng: 77.1734, image_url: '/crisis/landslide_shimla.png', ai_analysis: { severity: 78, category: 'Accident', status: 'complete' }, timestamp: { seconds: Date.now()/1000 - 2100 } },
];

export default function AdminDashboard({ goBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [dispatched, setDispatched] = useState({});
  const [dispatchPopup, setDispatchPopup] = useState(null);
  
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAdminLogin = () => {
    const match = ADMIN_CREDS.find(c => c.email === email && c.password === password);
    if (match) { setIsLoggedIn(true); setLoginError(''); }
    else setLoginError('Invalid credentials. Try admin@kavach.org / command2024');
  };

  const handleDispatch = (id) => {
    setDispatched(prev => ({ ...prev, [id]: true }));
    setDispatchPopup(id);
    setTimeout(() => setDispatchPopup(null), 2500);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    setAlerts(SEED_ALERTS);
    setLoading(false);

    if (!db) return;

    let unsubscribe;
    try {
      const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        }));
        setAlerts([...data, ...SEED_ALERTS]);
      }, (err) => {
        console.warn('Firestore listen error:', err.message);
      });
    } catch (e) {
      console.warn('Firebase init error:', e);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [isLoggedIn]);

  /* ── Login Screen ────────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col font-[Noto_Sans] relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-[#d4eedd]/50 blur-[120px] rounded-full" />
        </div>

        {/* Back */}
        <div className="relative z-10 px-5 pt-5">
          <button
            id="btn-admin-login-back"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 text-sm font-bold font-[Rajdhani] text-gray-500 hover:text-[#1a2f23] transition-colors cursor-pointer uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Login card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <div className="bg-white border border-[#e2f0e7] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl p-8 w-full max-w-sm animate-[fadeInUp_0.45s_ease-out]">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#d4eedd] flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#1a2f23]" strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-bold text-[#1a2f23] text-center font-[Rajdhani]">
              Admin Login
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1 mb-6">
              NGO Command Center Access
            </p>

            {loginError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            {/* Email */}
            <label className="block mb-4" htmlFor="admin-email">
              <div className="flex items-center gap-3 bg-[#fbfdfb] border border-[#e2f0e7] rounded-xl px-4 py-3.5 focus-within:border-[#1a2f23]/40 transition-all">
                <UserCircle className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.6} />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-gray-400 font-medium"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block mb-6" htmlFor="admin-password">
              <div className="flex items-center gap-3 bg-[#fbfdfb] border border-[#e2f0e7] rounded-xl px-4 py-3.5 focus-within:border-[#1a2f23]/40 transition-all">
                <Lock className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.6} />
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-gray-400 font-medium"
                />
              </div>
            </label>

            <button
              id="btn-admin-authenticate"
              onClick={handleAdminLogin}
              className="w-full py-3.5 rounded-xl bg-[#1a2f23] text-white font-bold font-[Rajdhani] uppercase tracking-wider text-sm shadow-lg shadow-[#1a2f23]/20 hover:bg-[#2a4534] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              Access Command Center
            </button>

            <div className="mt-5 bg-[#f3f9f5] border border-[#e2f0e7] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold mb-2 font-[Rajdhani]">Demo Credentials</p>
              <div className="space-y-1.5 text-[11px] text-gray-600 font-mono text-center">
                <p>admin@kavach.org / command2024</p>
                <p>ngo@freehelp.in / relief99</p>
              </div>
            </div>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    );
  }

  /* ── Admin Dashboard ─────────────────────── */
  return (
    <div className="min-h-screen bg-[#fafcfb] font-[Noto_Sans] relative overflow-hidden">
      
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-8 pt-6 pb-4">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            id="btn-admin-back"
            onClick={goBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#e2f0e7] text-[#1a2f23] font-bold font-[Rajdhani] text-xs uppercase tracking-wider hover:bg-gray-50 transition-all duration-200 cursor-pointer w-fit shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4eedd] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#1a2f23]" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a2f23] font-[Rajdhani] tracking-tight">
                NGO Command Center
              </h1>
              <p className="text-sm text-gray-500 font-medium">Real-time alerts and volunteer management.</p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-8 pb-10 max-w-[1440px] mx-auto">
        {/* ── Stats Row ───────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { value: alerts.length.toString(), label: 'Active Alerts', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
            { value: '47', label: 'Volunteers On Duty', icon: Users, color: 'text-[#1a2f23]', bg: 'bg-[#d4eedd]' },
            { value: alerts.filter(a => a.ai_analysis?.severity > 80).length.toString(), label: 'Critical Zones', icon: Radio, color: 'text-orange-500', bg: 'bg-orange-50' },
            { value: '89%', label: 'Response Rate', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="bg-white border border-[#e2f0e7] rounded-3xl p-5 shadow-sm animate-[fadeInUp_0.4s_ease-out_both] flex items-center gap-4"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1a2f23] font-[Rajdhani]">{stat.value}</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest font-[Rajdhani]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alerts List ─────────────────────── */}
        <div className="bg-white border border-[#e2f0e7] rounded-3xl overflow-hidden shadow-sm animate-[fadeInUp_0.45s_ease-out_0.3s_both]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2f0e7] bg-[#fbfdfb]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-red-500" strokeWidth={1.8} />
              </div>
              <h2 className="text-lg font-bold text-[#1a2f23] font-[Rajdhani]">
                Nearby Alerts
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest font-[Rajdhani]">Live</span>
            </div>
          </div>

          <div className="divide-y divide-[#e2f0e7]">
            {loading ? (
              <div className="px-6 py-10 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1a2f23]" />
                <span className="font-[Rajdhani] font-bold text-xs tracking-widest uppercase">Syncing Intel...</span>
              </div>
            ) : alerts.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 font-[Rajdhani] font-bold text-sm tracking-widest uppercase">
                NO ACTIVE ALERTS
              </div>
            ) : alerts.map((alert) => {
              let imgSrc = alert.image_url || alert.image_data;
              if (imgSrc && !imgSrc.startsWith('data:') && !imgSrc.startsWith('/') && !imgSrc.startsWith('http')) {
                imgSrc = `data:image/jpeg;base64,${imgSrc}`;
              }

              const ai = alert.ai_analysis;
              let badgeColor = "bg-gray-100 text-gray-600 border border-gray-200";
              let badgeText = "AI Analyzing...";
              
              if (ai) {
                if (ai.severity > 80) {
                  badgeColor = "bg-red-50 text-red-600 border border-red-100";
                } else if (ai.severity > 50) {
                  badgeColor = "bg-orange-50 text-orange-600 border border-orange-100";
                } else {
                  badgeColor = "bg-emerald-50 text-emerald-600 border border-emerald-100";
                }
                badgeText = `${ai.category || alert.urgency_category} (${ai.severity}/100)`;
              }

              return (
                <div key={alert.id} className="px-6 py-5 hover:bg-[#fbfdfb] transition-colors duration-200">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-[#e2f0e7]">
                      {imgSrc ? (
                        <img src={imgSrc} alt="Disaster" className="w-full h-full object-cover" />
                      ) : (
                        <Bell className="w-6 h-6 text-gray-300" strokeWidth={1.8} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                      <p className="text-sm font-bold text-[#111] truncate w-full max-w-lg mb-2">
                        {alert.description || 'No description provided'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest font-[Rajdhani] ${badgeColor}`}>
                          {badgeText}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          <MapPin className="w-3 h-3 text-[#1a2f23]" />
                          {alert.lat && alert.lng ? `${alert.lat.toFixed(4)}, ${alert.lng.toFixed(4)}` : 'Unknown Location'}
                        </span>
                        <span className="font-mono bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          {alert.timestamp ? new Date(alert.timestamp.seconds * 1000).toLocaleTimeString() : 'Just now'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!dispatched[alert.id]) {
                          handleDispatch(alert.id);
                        }
                      }}
                      className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold font-[Rajdhani] uppercase tracking-wider shadow-sm transition-all duration-200 flex items-center gap-2 mt-2 ${
                        dispatched[alert.id]
                          ? 'bg-[#d4eedd] text-[#1a2f23] cursor-default'
                          : 'bg-[#1a2f23] text-white hover:bg-[#2a4534] hover:-translate-y-0.5 shadow-[#1a2f23]/10 cursor-pointer active:translate-y-0'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {dispatched[alert.id] ? 'Dispatched ✓' : 'Dispatch Team'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Dispatch Popup Toast */}
      {dispatchPopup && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-[fadeInUp_0.3s_ease-out]">
          <div className="bg-[#1a2f23] rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4eedd] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#1a2f23]" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-[Rajdhani] uppercase tracking-wider">Dispatch Sent!</p>
              <p className="text-xs text-gray-300">Message sent to the NGO to dispatch the volunteer.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-gray-400 tracking-widest uppercase font-bold font-[Rajdhani]">
          KAVACH Admin Panel v2.0
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
