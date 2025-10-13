import React from "react";

export default function CarLoader({ message = "Checking authentication..." }) {
  return (
    <div className="flex items-center justify-center h-screen backdrop-blur-sm z-[9999]">
      <div className="flex flex-col items-center">
        {/* Car */}
        <svg
          width="220"
          height="110"
          viewBox="0 0 220 110"
          className="drop-shadow-[0_8px_24px_rgba(250,204,21,0.35)]"
          style={{ animation: "car-bob 1.2s ease-in-out infinite" }}
        >
          {/* Car body */}
          <rect x="30" y="40" rx="12" ry="12" width="160" height="45" fill="#FACC15" />
          {/* Cabin */}
          <path d="M70 40 L120 40 L140 60 L60 60 Z" fill="#1f2937" />
          {/* Window split */}
          <line x1="100" y1="42" x2="100" y2="58" stroke="#111827" strokeWidth="2" />

          {/* Wheels (stationary yellow rings) */}
          <g>
            <circle cx="70" cy="90" r="16" fill="#0f172a" />
            <circle cx="70" cy="90" r="10" fill="none" stroke="#FACC15" strokeWidth="3" />
          </g>
          <g>
            <circle cx="160" cy="90" r="16" fill="#0f172a" />
            <circle cx="160" cy="90" r="10" fill="none" stroke="#FACC15" strokeWidth="3" />
          </g>
        </svg>

        {/* Road (full width of container) */}
        <div className="relative w-[280px] h-[4px] mt-3 overflow-hidden rounded-full bg-[#222]">
          <div
            className="absolute top-0 left-0 h-full w-full"
            style={{
              background:
                "repeating-linear-gradient(90deg, #FACC15 0 24px, transparent 24px 40px)",
              animation: "road-move 0.8s linear infinite",
            }}
          />
        </div>

        {/* Message */}
        <p className="mt-4 text-sm text-yellow-300 tracking-wide">{message}</p>
      </div>

      {/* Inline animations */}
      <style>{`
        @keyframes road-move {
          from { transform: translateX(0); }
          to { transform: translateX(-40px); }
        }
        @keyframes car-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
