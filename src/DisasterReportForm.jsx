import { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ChevronDown,
  Send,
  ShieldAlert,
  ImagePlus,
  X,
  ArrowLeft,
} from 'lucide-react';

/* ───────────────────────────────────────────────────────
   Image Compression Utility
   ─────────────────────────────────────────────────────── */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/* ───────────────────────────────────────────────────────
   DisasterReportForm — Dark Theme
   ─────────────────────────────────────────────────────── */
export default function DisasterReportForm({ onBack }) {
  const [urgencyCategory, setUrgencyCategory] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [locationError, setLocationError] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [imageCompressing, setImageCompressing] = useState(false);
  const [imageName, setImageName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitPulse, setSubmitPulse] = useState(false);
  const fileInputRef = useRef(null);

  const canSubmit = locationStatus === 'success' && description.trim().length > 0 && urgencyCategory !== '';

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocationStatus('error'); setLocationError('Geolocation not supported.'); return; }
    setLocationStatus('loading'); setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus('success'); },
      (err) => { setLocationStatus('error'); setLocationError(err.message || 'Unable to fetch location.'); },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    try { setImageCompressing(true); setImageName(file.name); setImageBase64(await compressImage(file)); }
    catch { setImageBase64(null); setImageName(''); }
    finally { setImageCompressing(false); }
  };

  const removeImage = () => { setImageBase64(null); setImageName(''); if (fileInputRef.current) fileInputRef.current.value = ''; };

  const handleSubmit = (e) => {
    e.preventDefault(); if (!canSubmit) return;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(), urgency_category: urgencyCategory, description: description.trim(),
      location: { lat: location.lat, lng: location.lng },
      media: { has_image: imageBase64 !== null, image_base64: imageBase64 ?? null }, status: 'Pending',
    }, null, 2));
    setSubmitPulse(true);
    setTimeout(() => setSubmitted(true), 350);
  };

  const resetForm = () => {
    setUrgencyCategory(''); setDescription(''); setLocation(null); setLocationStatus('idle');
    setLocationError(''); setImageBase64(null); setImageName(''); setImageCompressing(false);
    setSubmitted(false); setSubmitPulse(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const darkBg = {
    backgroundImage: 'linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  /* ── Success Screen ──────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 font-[Manrope,sans-serif] relative overflow-hidden" style={darkBg}>
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-10 max-w-md w-full text-center animate-[fadeInUp_0.5s_ease-out]">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-[scaleBounce_0.6s_ease-out]">
            <CheckCircle className="w-10 h-10 text-emerald-400" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Your disaster report has been logged and is currently <span className="font-semibold text-amber-400">Pending</span> review. Help is on the way.
          </p>
          <button id="btn-new-report" onClick={resetForm}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer">
            Submit Another Report
          </button>

          {onBack && (
            <button id="btn-back-after-submit" onClick={onBack}
              className="mt-4 block mx-auto text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
              ← Back to Home
            </button>
          )}
        </div>
        <style>{kf}</style>
      </div>
    );
  }

  /* ── Main Form ───────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-950 font-[Manrope,sans-serif] relative overflow-hidden" style={darkBg}>
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[500px] h-[500px] bg-red-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Top accent */}
      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-amber-500 to-orange-500" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          {onBack && (
            <button id="btn-back-to-shell" type="button" onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          )}
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-[Plus_Jakarta_Sans,sans-serif]">
            Disaster Report
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto">
            Your report helps responders act fast. Every detail matters.
          </p>
        </header>

        {/* Form card */}
        <form onSubmit={handleSubmit}
          className={`bg-white/[0.04] backdrop-blur-md border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 transition-transform duration-300 ${submitPulse ? 'scale-95 opacity-80' : ''}`}>

          {/* 1 — Urgency */}
          <fieldset>
            <label htmlFor="select-urgency" className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Urgency Category
            </label>
            <div className="relative">
              <select id="select-urgency" value={urgencyCategory} onChange={(e) => setUrgencyCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-3 pr-10 text-sm font-medium text-white transition-all duration-200 outline-none cursor-pointer focus:border-red-500/50">
                <option value="" className="bg-slate-900 text-slate-400">Select an urgency level…</option>
                <option value="Medical Emergency" className="bg-slate-900">🚑 Medical Emergency</option>
                <option value="Structural Damage" className="bg-slate-900">🏚️ Structural Damage</option>
                <option value="Flood/Water" className="bg-slate-900">🌊 Flood / Water</option>
                <option value="Fire/Smoke" className="bg-slate-900">🔥 Fire / Smoke</option>
                <option value="Resource Shortage" className="bg-slate-900">📦 Resource Shortage</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            </div>
          </fieldset>

          {/* 2 — Description */}
          <fieldset>
            <label htmlFor="textarea-description" className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <span className="text-base">📝</span> Description
            </label>
            <textarea id="textarea-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the situation…"
              className="w-full rounded-xl border border-white/[0.1] bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-slate-500 resize-none transition-all duration-200 outline-none focus:border-red-500/50" />
            <p className="mt-1 text-xs text-slate-500 text-right">{description.length} characters</p>
          </fieldset>

          {/* 3 — Location */}
          <fieldset>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Location
            </label>
            {locationStatus === 'idle' && (
              <button id="btn-get-location" type="button" onClick={handleGetLocation}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 py-3.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/60 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <MapPin className="w-4 h-4" /> Get My Location
              </button>
            )}
            {locationStatus === 'loading' && (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-3.5 text-sm font-medium text-emerald-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Fetching GPS coordinates…
              </div>
            )}
            {locationStatus === 'success' && location && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 animate-[fadeInUp_0.35s_ease-out]">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Location Secured</p>
                  <p className="text-xs text-emerald-500 font-mono mt-0.5">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              </div>
            )}
            {locationStatus === 'error' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {locationError}
                </div>
                <button type="button" onClick={handleGetLocation} className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer">Try again</button>
              </div>
            )}
          </fieldset>

          {/* 4 — Media */}
          <fieldset>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
              <Camera className="w-4 h-4 text-amber-400" /> Attach Photo <span className="font-normal text-slate-500">(optional)</span>
            </label>
            <input ref={fileInputRef} id="input-image" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
            {!imageBase64 && !imageCompressing && (
              <button id="btn-attach-photo" type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 py-3.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/60 active:scale-[0.98] transition-all duration-200 cursor-pointer">
                <ImagePlus className="w-4 h-4" /> Choose or Capture Image
              </button>
            )}
            {imageCompressing && (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 py-3.5 text-sm font-medium text-amber-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Compressing image…
              </div>
            )}
            {imageBase64 && !imageCompressing && (
              <div className="relative rounded-xl border border-white/[0.1] overflow-hidden animate-[fadeInUp_0.35s_ease-out]">
                <img src={imageBase64} alt="Preview" className="w-full max-h-52 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-white/90 truncate max-w-[70%]">{imageName}</span>
                  <button id="btn-remove-image" type="button" onClick={removeImage}
                    className="w-7 h-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            )}
          </fieldset>

          {/* Divider */}
          <div className="border-t border-white/[0.06]" />

          {/* Submit */}
          <button id="btn-submit-report" type="submit" disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold tracking-wide transition-all duration-200
              ${canSubmit
                ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:scale-[1.03] active:scale-[0.97] cursor-pointer'
                : 'bg-white/[0.06] text-slate-500 cursor-not-allowed'
              }`}>
            <Send className="w-4 h-4" /> Submit Report
          </button>

          {!canSubmit && (
            <p className="text-center text-xs text-slate-500 -mt-2">
              {!urgencyCategory && 'Select an urgency category • '}
              {!description.trim() && 'Add a description • '}
              {locationStatus !== 'success' && 'Fetch your location'}
            </p>
          )}
        </form>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-slate-500">
          <p>All reports are encrypted end-to-end. Your data is safe.</p>
        </footer>
      </div>

      <style>{kf}</style>
    </div>
  );
}

const kf = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleBounce {
    0%   { transform: scale(0); }
    60%  { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;
