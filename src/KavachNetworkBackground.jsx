import { useMemo } from 'react';

/* ═══════════════════════════════════════════════════════
   KavachNetworkBackground
   Animated SVG "Live Coordination Map" overlay
   ─ Topographic dot grid + pulsing incident nodes +
     animated dashed dispatch routes
   ═══════════════════════════════════════════════════════ */

/* Deterministic "random" from seed — avoids layout shift on re-render */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* Pre-generate stable node positions */
const rand = seededRandom(42);

const NODES = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  x: 8 + rand() * 84,
  y: 6 + rand() * 88,
  size: 1.2 + rand() * 1.0,       // viewBox-relative size
  delay: rand() * 4,
  intensity: 0.55 + rand() * 0.45,
}));

/* Connect some nodes (not all — keep it sparse & organic) */
const CONNECTIONS = [
  [0, 2], [1, 3], [2, 4], [3, 5],
  [4, 6], [0, 5], [1, 6],
];

export default function KavachNetworkBackground() {
  /* Memo prevents recalc — this component never changes props */
  const grid = useMemo(() => {
    const dots = [];
    const step = 40; // px between dots
    for (let x = 0; x <= 2000; x += step) {
      for (let y = 0; y <= 2000; y += step) {
        dots.push({ x, y });
      }
    }
    return dots;
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -10 }}
        aria-hidden="true"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Defs ─────────────────────────────── */}
          <defs>
            {/* Dot grid pattern */}
            <pattern
              id="kavach-dot-grid"
              x="0" y="0"
              width="40" height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(0.03)"
            >
              <circle cx="20" cy="20" r="1.2" fill="#9faec4" opacity="0.35" />
            </pattern>

            {/* Radial glow for pulsing nodes */}
            <radialGradient id="node-glow-red">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="node-glow-amber">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Base dot grid ───────────────────── */}
          <rect width="100" height="100" fill="url(#kavach-dot-grid)" opacity="0.28" />

          {/* ── Connection lines ─────────────────── */}
          {CONNECTIONS.map(([aIdx, bIdx], i) => {
            const a = NODES[aIdx];
            const b = NODES[bIdx];
            return (
              <line
                key={`conn-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#818cf8"
                strokeWidth="0.22"
                strokeDasharray="1.2 0.8"
                opacity="0.4"
                className="animate-[dashFlow_4s_linear_infinite]"
                style={{ animationDelay: `${i * 0.6}s` }}
              />
            );
          })}

          {/* ── Incident nodes ───────────────────── */}
          {NODES.map((node) => (
            <g key={node.id}>
              {/* Outer glow ring */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 2.5}
                fill={node.id % 3 === 0 ? 'url(#node-glow-amber)' : 'url(#node-glow-red)'}
                className="animate-[nodePulse_3s_ease-in-out_infinite]"
                style={{ animationDelay: `${node.delay}s` }}
              />
              {/* Core dot */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 0.55}
                fill={node.id % 3 === 0 ? '#f59e0b' : '#ef4444'}
                opacity={node.intensity}
                className="animate-[nodePulse_3s_ease-in-out_infinite]"
                style={{ animationDelay: `${node.delay}s` }}
              />
            </g>
          ))}
        </svg>
      </div>

      <style>{`
        @keyframes dashFlow {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -20; }
        }
        @keyframes nodePulse {
          0%, 100% { opacity: 0.3; transform-origin: center; r: inherit; }
          50%      { opacity: 0.85; }
        }
      `}</style>
    </>
  );
}
