import { useState } from 'react';
import {
  ArrowLeft, ShieldCheck, Power, Navigation, UserCircle, Lock,
  ClipboardList, MapPin, Brain, Clock, CheckCircle, AlertTriangle,
  Package, Truck, Users, Heart, Wrench
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   Fake Credentials
   ═══════════════════════════════════════════════════════ */
const VALID_CREDENTIALS = [
  { id: 'VOL-001', password: 'kavach2024', name: 'Arjun Sharma' },
  { id: 'VOL-002', password: 'field123',   name: 'Priya Nair' },
  { id: 'VOL-003', password: 'rescue99',   name: 'Rahul Verma' },
];

/* ═══════════════════════════════════════════════════════
   Mock Dispatch Alerts (rotated randomly)
   ═══════════════════════════════════════════════════════ */
const DISPATCH_ALERTS = [
  { type: 'Medical Emergency', emoji: '🚑', description: 'Collapsed structure with trapped individuals near Yamuna Ghat area.', distance: '1.2 km', confidence: 95, eta: '~4 min' },
  { type: 'Flood Rescue', emoji: '🌊', description: 'Family stranded on rooftop in Wayanad flash flood zone.', distance: '3.1 km', confidence: 88, eta: '~12 min' },
  { type: 'Fire Response', emoji: '🔥', description: 'Chemical fire at industrial unit — toxic fumes reported.', distance: '0.8 km', confidence: 92, eta: '~3 min' },
];

/* ═══════════════════════════════════════════════════════
   Active Tasks
   ═══════════════════════════════════════════════════════ */
const MOCK_TASKS = [
  { id: 1, title: 'Debris Clearing — Sector 4, Bhuj', icon: Wrench,   status: 'In Progress', statusColor: 'bg-orange-50 text-orange-600 border-orange-100', assigned: '2h ago', volunteers: 3, priority: 'High' },
  { id: 2, title: 'Medical Supply Delivery — Puri Camp', icon: Package, status: 'Pending Pickup', statusColor: 'bg-blue-50 text-blue-600 border-blue-100', assigned: '45m ago', volunteers: 1, priority: 'Medium' },
  { id: 3, title: 'Evacuee Head Count — Relief Camp 7', icon: Users,   status: 'In Progress', statusColor: 'bg-orange-50 text-orange-600 border-orange-100', assigned: '1h ago', volunteers: 5, priority: 'High' },
  { id: 4, title: 'Water Purification Setup — Marathwada', icon: Heart, status: 'Queued', statusColor: 'bg-gray-50 text-gray-600 border-gray-100', assigned: '3h ago', volunteers: 2, priority: 'Low' },
  { id: 5, title: 'Bridge Damage Assessment — NH-5', icon: AlertTriangle, status: 'Urgent', statusColor: 'bg-red-50 text-red-600 border-red-100', assigned: '20m ago', volunteers: 4, priority: 'Critical' },
  { id: 6, title: 'Food Kit Distribution — Vizag', icon: Truck, status: 'In Progress', statusColor: 'bg-orange-50 text-orange-600 border-orange-100', assigned: '5h ago', volunteers: 6, priority: 'Medium' },
];

/* ═══════════════════════════════════════════════════════
   VolunteerPortal - Light Theme
   ═══════════════════════════════════════════════════════ */
export default function VolunteerPortal({ goBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [volunteerId, setVolunteerId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [userName, setUserName] = useState('');
  const [alertAccepted, setAlertAccepted] = useState(false);
  const [alertPassed, setAlertPassed] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [currentAlert] = useState(DISPATCH_ALERTS[Math.floor(Math.random() * DISPATCH_ALERTS.length)]);

  const handleLogin = () => {
    const match = VALID_CREDENTIALS.find(c => c.id === volunteerId.toUpperCase() && c.password === password);
    if (match) { setIsLoggedIn(true); setUserName(match.name); setLoginError(''); }
    else setLoginError('Invalid credentials. Try VOL-001 / kavach2024');
  };

  const markComplete = (taskId) => { setCompletedTasks(prev => [...prev, taskId]); };

  /* ── LOGIN ──────────────────────────────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex flex-col font-[Noto_Sans] relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-[#d4eedd]/50 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 px-5 pt-5">
          <button id="btn-login-back" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-bold font-[Rajdhani] text-gray-500 hover:text-[#1a2f23] transition-colors cursor-pointer uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <main className="relative z-10 flex-1 flex items-center justify-center px-5 pb-12">
          <div className="bg-white border border-[#e2f0e7] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl p-8 w-full max-w-sm animate-[fadeInUp_0.45s_ease-out]">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#d4eedd] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#1a2f23]" strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-bold text-[#1a2f23] text-center font-[Rajdhani]">Field Operative</h1>
            <p className="text-sm text-gray-500 text-center mt-1 mb-6">Secure volunteer authentication</p>

            {loginError && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold text-center">
                {loginError}
              </div>
            )}

            <label className="block mb-4" htmlFor="input-volunteer-id">
              <div className="flex items-center gap-3 bg-[#fbfdfb] border border-[#e2f0e7] rounded-xl px-4 py-3.5 focus-within:border-[#1a2f23]/40 transition-all">
                <UserCircle className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.6} />
                <input id="input-volunteer-id" type="text" placeholder="Volunteer ID (e.g. VOL-001)" value={volunteerId} onChange={(e) => setVolunteerId(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-gray-400 font-medium" />
              </div>
            </label>

            <label className="block mb-6" htmlFor="input-password">
              <div className="flex items-center gap-3 bg-[#fbfdfb] border border-[#e2f0e7] rounded-xl px-4 py-3.5 focus-within:border-[#1a2f23]/40 transition-all">
                <Lock className="w-5 h-5 text-gray-400 shrink-0" strokeWidth={1.6} />
                <input id="input-password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-[#111] placeholder:text-gray-400 font-medium" />
              </div>
            </label>

            <button id="btn-authenticate" onClick={handleLogin} className="w-full py-3.5 rounded-xl bg-[#1a2f23] text-white font-bold text-sm shadow-lg shadow-[#1a2f23]/20 hover:bg-[#2a4534] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer font-[Rajdhani] uppercase tracking-wider">
              Authenticate Securely
            </button>

            <div className="mt-5 bg-[#f3f9f5] border border-[#e2f0e7] rounded-xl p-4">
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-bold mb-2 font-[Rajdhani]">Demo Credentials</p>
              <div className="space-y-1.5 text-[11px] text-gray-600 font-mono text-center">
                <p>VOL-001 / kavach2024</p>
                <p>VOL-002 / field123</p>
                <p>VOL-003 / rescue99</p>
              </div>
            </div>
          </div>
        </main>
        <style>{keyframes}</style>
      </div>
    );
  }

  /* ── DASHBOARD ──────────────────────────────── */
  const activeTasks = MOCK_TASKS.filter(t => !completedTasks.includes(t.id));

  return (
    <div className="min-h-screen bg-[#fafcfb] font-[Noto_Sans] relative overflow-hidden">
      <header className="relative z-10 px-5 pt-6 pb-2 flex items-center justify-between max-w-2xl mx-auto">
        <button id="btn-dashboard-back" onClick={goBack} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold font-[Rajdhani] uppercase tracking-wider text-[#1a2f23] bg-white border border-[#e2f0e7] rounded-lg shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs font-bold tracking-widest uppercase text-gray-400 font-[Rajdhani]">KAVACH</span>
      </header>

      <main className="relative z-10 px-5 pb-10 max-w-2xl mx-auto">
        <div className="mb-6 animate-[fadeInUp_0.35s_ease-out]">
          <h1 className="text-2xl font-bold text-[#1a2f23] font-[Rajdhani]">Field Operative</h1>
          <p className="text-sm text-gray-500 mt-0.5 font-medium">Welcome back, <span className="text-emerald-600 font-bold">{userName}</span>.</p>
        </div>

        {/* Status Toggle */}
        <div className={`rounded-3xl p-5 mb-6 shadow-sm transition-all duration-300 animate-[fadeInUp_0.4s_ease-out_0.05s_both] border ${isOnDuty ? 'bg-[#f3f9f5] border-[#d4eedd]' : 'bg-white border-[#e2f0e7]'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm ${isOnDuty ? 'bg-white text-emerald-500' : 'bg-gray-50 text-gray-400'}`}>
                <Power className="w-6 h-6" strokeWidth={2} />
              </div>
              <div>
                <p className={`text-lg font-bold font-[Rajdhani] transition-colors duration-300 ${isOnDuty ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {isOnDuty ? 'ON DUTY' : 'Off Duty'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug font-medium">
                  {isOnDuty ? 'Tracking Location • Receiving Alerts' : 'Not receiving dispatch alerts'}
                </p>
              </div>
            </div>
            <button id="btn-duty-toggle" onClick={() => { setIsOnDuty(v => !v); setAlertAccepted(false); setAlertPassed(false); }}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer shrink-0 shadow-inner ${isOnDuty ? 'bg-[#1a2f23]' : 'bg-gray-300'}`} aria-label="Toggle duty status">
              <span className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isOnDuty ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Dispatch Alert */}
        {isOnDuty && !alertAccepted && !alertPassed && (
          <div className="bg-white border border-[#e2f0e7] shadow-lg rounded-3xl border-l-[4px] border-l-red-500 p-6 mb-6 animate-[fadeInUp_0.4s_ease-out]">
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs font-bold font-[Rajdhani] uppercase tracking-widest text-red-500">Urgent Dispatch</span>
            </div>
            <p className="text-xl font-bold text-[#1a2f23] font-[Rajdhani] mb-2">{currentAlert.emoji} {currentAlert.type}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-5 font-medium">{currentAlert.description}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#fbfdfb] border border-[#e2f0e7] rounded-2xl px-3 py-3 text-center shadow-sm">
                <MapPin className="w-5 h-5 text-indigo-500 mx-auto mb-1" strokeWidth={2} />
                <p className="text-sm font-bold text-[#111]">{currentAlert.distance}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-[Rajdhani]">Distance</p>
              </div>
              <div className="bg-[#f3f9f5] border border-[#d4eedd] rounded-2xl px-3 py-3 text-center shadow-sm">
                <Brain className="w-5 h-5 text-emerald-600 mx-auto mb-1" strokeWidth={2} />
                <p className="text-sm font-bold text-emerald-600">{currentAlert.confidence}%</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest font-[Rajdhani]">AI Conf</p>
              </div>
              <div className="bg-[#fbfdfb] border border-[#e2f0e7] rounded-2xl px-3 py-3 text-center shadow-sm">
                <Clock className="w-5 h-5 text-indigo-500 mx-auto mb-1" strokeWidth={2} />
                <p className="text-sm font-bold text-[#111]">{currentAlert.eta}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest font-[Rajdhani]">ETA</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button id="btn-accept-dispatch" onClick={() => setAlertAccepted(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a2f23] text-white font-bold font-[Rajdhani] uppercase tracking-wider text-sm shadow-md hover:bg-[#2a4534] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">
                <Navigation className="w-4 h-4" /> Accept & Route
              </button>
              <button id="btn-pass-dispatch" onClick={() => setAlertPassed(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white border border-[#e2f0e7] text-gray-500 font-bold font-[Rajdhani] uppercase tracking-wider text-sm shadow-sm hover:bg-gray-50 hover:text-[#1a2f23] active:scale-95 transition-all duration-200 cursor-pointer">
                Pass to Next
              </button>
            </div>
          </div>
        )}

        {isOnDuty && alertAccepted && (
          <div className="bg-[#f3f9f5] border border-[#d4eedd] rounded-3xl p-6 mb-6 text-center animate-[fadeInUp_0.4s_ease-out] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <CheckCircle className="w-8 h-8 text-emerald-500" strokeWidth={2} />
            </div>
            <p className="text-lg font-bold text-emerald-600 font-[Rajdhani] uppercase tracking-wider">Dispatch Accepted</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Routing to incident location… ETA {currentAlert.eta}.</p>
          </div>
        )}

        {isOnDuty && alertPassed && (
          <div className="bg-white border border-[#e2f0e7] rounded-3xl p-5 mb-6 text-center animate-[fadeInUp_0.4s_ease-out] shadow-sm">
            <p className="text-sm font-medium text-gray-500">Alert forwarded to the next available volunteer.</p>
          </div>
        )}

        {/* Active Tasks */}
        <div className="animate-[fadeInUp_0.45s_ease-out_0.15s_both]">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#1a2f23]" strokeWidth={1.8} />
              <h2 className="text-lg font-bold text-[#1a2f23] font-[Rajdhani]">Current Assignments</h2>
            </div>
            <span className="text-[10px] font-bold font-[Rajdhani] text-[#1a2f23] bg-[#d4eedd] px-2.5 py-0.5 rounded-full uppercase tracking-widest">{activeTasks.length} Active</span>
          </div>
          <div className="space-y-3">
            {activeTasks.map((task) => {
              const IconComp = task.icon;
              return (
                <div key={task.id} className="bg-white border border-[#e2f0e7] shadow-sm rounded-2xl p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-[#e2f0e7]">
                      <IconComp className="w-5 h-5 text-gray-400" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-bold text-[#111]">{task.title}</p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold font-[Rajdhani] uppercase tracking-widest border ${task.statusColor}`}>{task.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">Assigned {task.assigned} • {task.volunteers} volunteers on-site</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-[10px] font-bold font-[Rajdhani] uppercase tracking-widest px-2 py-0.5 rounded-lg ${task.priority === 'Critical' ? 'bg-red-50 text-red-600' : task.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                          {task.priority} Priority
                        </span>
                        <button onClick={() => markComplete(task.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold font-[Rajdhani] uppercase tracking-wider text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors cursor-pointer">
                          <CheckCircle className="w-3.5 h-3.5" /> Mark Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {activeTasks.length === 0 && (
              <div className="text-center py-8 bg-white border border-[#e2f0e7] rounded-3xl shadow-sm">
                <p className="text-gray-400 font-[Rajdhani] font-bold text-xs uppercase tracking-widest">All tasks completed. Stand by.</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Count */}
        {completedTasks.length > 0 && (
          <div className="mt-6 text-center animate-[fadeInUp_0.3s_ease-out]">
            <p className="text-xs font-bold font-[Rajdhani] uppercase tracking-widest text-[#1a2f23] bg-[#d4eedd] rounded-2xl py-3 px-4 shadow-sm inline-block">
              ✅ {completedTasks.length} task{completedTasks.length > 1 ? 's' : ''} completed this session
            </p>
          </div>
        )}
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-[10px] text-gray-400 tracking-widest uppercase font-[Rajdhani] font-bold">KAVACH Field Network v2.0</p>
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
