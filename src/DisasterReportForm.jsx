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
   DisasterReportForm — Light Theme
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

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!canSubmit) return;
    setSubmitPulse(true);

    const payload = {
      urgency_category: urgencyCategory,
      description: description,
      lat: location.lat,
      lng: location.lng,
      base64_image: imageBase64
    };

    try {
      const response = await fetch('http://localhost:3000/submitReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setTimeout(() => setSubmitted(true), 350);
      } else {
        console.error("Submission failed: Backend returned an error", response.status);
        setSubmitPulse(false);
      }
    } catch (error) {
      console.error("Submission failed: Network error", error);
      setSubmitPulse(false);
    }
  };

  const resetForm = () => {
    setUrgencyCategory(''); setDescription(''); setLocation(null); setLocationStatus('idle');
    setLocationError(''); setImageBase64(null); setImageName(''); setImageCompressing(false);
    setSubmitted(false); setSubmitPulse(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* ── Success Screen ──────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafcfb] flex items-center justify-center px-4 font-[Noto_Sans] relative overflow-hidden">
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
          <div className="w-[500px] h-[500px] bg-[#d4eedd]/50 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 bg-white border border-[#e2f0e7] shadow-lg rounded-3xl p-10 max-w-md w-full text-center animate-[fadeInUp_0.5s_ease-out]">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[#f3f9f5] border border-[#d4eedd] flex items-center justify-center animate-[scaleBounce_0.6s_ease-out]">
            <CheckCircle className="w-10 h-10 text-emerald-600" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold text-[#1a2f23] mb-2 font-[Rajdhani]">Report Submitted</h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-sm">
            Your disaster report has been logged and is currently <span className="font-bold text-orange-500">Pending</span> review. Help is on the way.
          </p>
          <button id="btn-new-report" onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#1a2f23] text-white font-bold font-[Rajdhani] uppercase tracking-wider text-sm shadow-md shadow-[#1a2f23]/10 hover:bg-[#2a4534] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            Submit Another Report
          </button>

          {onBack && (
            <button id="btn-back-after-submit" onClick={onBack}
              className="mt-5 block mx-auto text-sm font-bold font-[Rajdhani] uppercase tracking-widest text-gray-500 hover:text-[#1a2f23] transition-colors cursor-pointer">
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
    <div className="min-h-screen bg-[#fafcfb] font-[Noto_Sans] relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 text-center">
          {onBack && (
            <button id="btn-back-to-shell" type="button" onClick={onBack}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold font-[Rajdhani] uppercase tracking-widest text-gray-500 bg-white border border-[#e2f0e7] shadow-sm px-3 py-1.5 rounded-lg hover:text-[#1a2f23] hover:bg-gray-50 transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          )}
          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-8 h-8 text-red-500" strokeWidth={2.2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2f23] tracking-tight font-[Rajdhani]">
            Emergency Report
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto font-medium">
            Your report helps responders act fast. Every detail matters.
          </p>
        </header>

        {/* Form card */}
        <form onSubmit={handleSubmit}
          className={`bg-white border border-[#e2f0e7] shadow-sm rounded-3xl p-6 sm:p-8 space-y-6 transition-transform duration-300 ${submitPulse ? 'scale-95 opacity-80' : ''}`}>

          {/* 1 — Urgency */}
          <fieldset>
            <label htmlFor="select-urgency" className="flex items-center gap-2 text-sm font-bold text-[#1a2f23] mb-2 font-[Rajdhani] uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Urgency Category
            </label>
            <div className="relative">
              <select id="select-urgency" value={urgencyCategory} onChange={(e) => setUrgencyCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#e2f0e7] bg-[#fbfdfb] px-4 py-3.5 pr-10 text-sm font-medium text-[#111] transition-all duration-200 outline-none cursor-pointer focus:border-[#1a2f23]/40 shadow-sm">
                <option value="" className="text-gray-400">Select an urgency level…</option>
                <option value="Medical Emergency">🚑 Medical Emergency</option>
                <option value="Structural Damage">🏚️ Structural Damage</option>
                <option value="Flood/Water">🌊 Flood / Water</option>
                <option value="Fire/Smoke">🔥 Fire / Smoke</option>
                <option value="Resource Shortage">📦 Resource Shortage</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </fieldset>

          {/* 2 — Description */}
          <fieldset>
            <label htmlFor="textarea-description" className="flex items-center gap-2 text-sm font-bold text-[#1a2f23] mb-2 font-[Rajdhani] uppercase tracking-wider">
              <span className="text-base">📝</span> Description
            </label>
            <textarea id="textarea-description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the situation…"
              className="w-full rounded-xl border border-[#e2f0e7] bg-[#fbfdfb] px-4 py-3.5 text-sm text-[#111] placeholder:text-gray-400 resize-none transition-all duration-200 outline-none focus:border-[#1a2f23]/40 shadow-sm" />
            <p className="mt-1 text-xs text-gray-400 font-bold font-mono text-right">{description.length} chars</p>
          </fieldset>

          {/* 3 — Location */}
          <fieldset>
            <label className="flex items-center gap-2 text-sm font-bold text-[#1a2f23] mb-2 font-[Rajdhani] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-500" /> Location
            </label>
            {locationStatus === 'idle' && (
              <button id="btn-get-location" type="button" onClick={handleGetLocation}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3.5 text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition-all duration-200 cursor-pointer shadow-sm">
                <MapPin className="w-4 h-4" /> Get My Location
              </button>
            )}
            {locationStatus === 'loading' && (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-[#e2f0e7] bg-gray-50 py-3.5 text-sm font-bold text-gray-500 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin" /> Fetching GPS coordinates…
              </div>
            )}
            {locationStatus === 'success' && location && (
              <div className="flex items-center gap-3 rounded-xl border border-[#e2f0e7] bg-[#fbfdfb] px-4 py-3 shadow-sm animate-[fadeInUp_0.35s_ease-out]">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#111]">Location Secured</p>
                  <p className="text-xs text-emerald-600 font-mono mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</p>
                </div>
              </div>
            )}
            {locationStatus === 'error' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 shadow-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {locationError}
                </div>
                <button type="button" onClick={handleGetLocation} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">Try again</button>
              </div>
            )}
          </fieldset>

          {/* 4 — Media */}
          <fieldset>
            <label className="flex items-center gap-2 text-sm font-bold text-[#1a2f23] mb-2 font-[Rajdhani] uppercase tracking-wider">
              <Camera className="w-4 h-4 text-orange-500" /> Attach Photo <span className="font-bold text-gray-400 text-[10px] ml-1 tracking-normal uppercase">(optional)</span>
            </label>
            <input ref={fileInputRef} id="input-image" type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
            {!imageBase64 && !imageCompressing && (
              <button id="btn-attach-photo" type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-3.5 text-sm font-bold text-orange-600 hover:bg-orange-100 transition-all duration-200 cursor-pointer shadow-sm">
                <ImagePlus className="w-4 h-4" /> Choose or Capture Image
              </button>
            )}
            {imageCompressing && (
              <div className="flex items-center justify-center gap-3 rounded-xl border border-[#e2f0e7] bg-gray-50 py-3.5 text-sm font-bold text-gray-500 shadow-sm">
                <Loader2 className="w-5 h-5 animate-spin" /> Compressing image…
              </div>
            )}
            {imageBase64 && !imageCompressing && (
              <div className="relative rounded-xl border border-[#e2f0e7] overflow-hidden shadow-sm animate-[fadeInUp_0.35s_ease-out]">
                <img src={imageBase64} alt="Preview" className="w-full max-h-52 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-white/90 backdrop-blur-sm border-t border-[#e2f0e7] px-4 py-2 flex items-center justify-between">
                  <span className="text-xs text-[#111] font-bold truncate max-w-[70%]">{imageName}</span>
                  <button id="btn-remove-image" type="button" onClick={removeImage}
                    className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </fieldset>

          {/* Divider */}
          <div className="border-t border-[#e2f0e7] pt-6" />

          {/* Submit */}
          <button id="btn-submit-report" type="submit" disabled={!canSubmit}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold font-[Rajdhani] uppercase tracking-wider transition-all duration-200
              ${canSubmit
                ? 'bg-[#1a2f23] text-white shadow-md shadow-[#1a2f23]/10 hover:bg-[#2a4534] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}>
            <Send className="w-4 h-4" /> Submit Report
          </button>

          {!canSubmit && (
            <p className="text-center text-xs font-bold text-gray-400 -mt-2">
              {!urgencyCategory && 'Select an urgency category • '}
              {!description.trim() && 'Add a description • '}
              {locationStatus !== 'success' && 'Fetch your location'}
            </p>
          )}
        </form>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs font-bold text-gray-400 font-[Rajdhani] tracking-widest uppercase">
          <p>End-to-End Encrypted • Data Protected</p>
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
