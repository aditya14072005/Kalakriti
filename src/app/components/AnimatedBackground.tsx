import React from 'react';

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 animate-gradient-shift" />
      
      {/* Flying Birds */}
      <div className="absolute top-20 left-0 w-12 h-12 opacity-40 animate-fly-across" style={{ animationDelay: '0s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-800">
          <path d="M20,50 Q30,40 40,50 Q50,40 60,50 M40,50 L40,60 M60,50 L60,60" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      
      <div className="absolute top-40 left-0 w-10 h-10 opacity-40 animate-fly-across" style={{ animationDelay: '8s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-pink-800">
          <path d="M25,50 Q35,42 45,50 Q55,42 65,50 M45,50 L45,58 M65,50 L65,58" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-60 left-0 w-14 h-14 opacity-35 animate-fly-diagonal" style={{ animationDelay: '5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-800">
          <path d="M20,50 Q30,38 40,50 Q50,38 60,50 M40,50 L40,62 M60,50 L60,62" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-1/3 left-0 w-11 h-11 opacity-40 animate-fly-across" style={{ animationDelay: '15s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-800">
          <path d="M22,50 Q32,43 42,50 Q52,43 62,50 M42,50 L42,59 M62,50 L62,59" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      
      {/* Darker floating mandala patterns */}
      <div className="absolute top-20 left-10 w-32 h-32 opacity-25 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-700" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-700" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-700" />
          <path d="M50,10 L50,90 M10,50 L90,50 M20,20 L80,80 M80,20 L20,80" stroke="currentColor" strokeWidth="1.5" className="text-orange-700" />
        </svg>
      </div>
      
      <div className="absolute top-1/4 right-20 w-40 h-40 opacity-25 animate-float-medium">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-700" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-700" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-700" />
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const x1 = 50 + 15 * Math.cos(angle);
            const y1 = 50 + 15 * Math.sin(angle);
            const x2 = 50 + 35 * Math.cos(angle);
            const y2 = 50 + 35 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.5" className="text-pink-700" />;
          })}
        </svg>
      </div>
      
      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 opacity-25 animate-float-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-700" />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            return <circle key={i} cx={x} cy={y} r="4" fill="currentColor" className="text-yellow-700" />;
          })}
        </svg>
      </div>

      <div className="absolute bottom-20 right-1/4 w-28 h-28 opacity-25 animate-float-medium">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M50,20 L60,40 L80,40 L65,55 L70,75 L50,60 L30,75 L35,55 L20,40 L40,40 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-700" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-700" />
        </svg>
      </div>

      {/* Additional Lotus flowers */}
      <div className="absolute top-1/3 right-1/3 w-32 h-32 opacity-30 animate-pulse-glow" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-pink-700">
          <ellipse cx="50" cy="60" rx="8" ry="20" fill="currentColor" opacity="0.5" />
          <ellipse cx="40" cy="60" rx="8" ry="18" fill="currentColor" opacity="0.5" transform="rotate(-20 40 60)" />
          <ellipse cx="60" cy="60" rx="8" ry="18" fill="currentColor" opacity="0.5" transform="rotate(20 60 60)" />
          <ellipse cx="35" cy="65" rx="7" ry="16" fill="currentColor" opacity="0.5" transform="rotate(-35 35 65)" />
          <ellipse cx="65" cy="65" rx="7" ry="16" fill="currentColor" opacity="0.5" transform="rotate(35 65 65)" />
          <circle cx="50" cy="60" r="5" fill="currentColor" />
        </svg>
      </div>

      {/* Paisley shapes - darker */}
      <div className="absolute top-1/2 left-1/3 w-24 h-24 opacity-30 animate-float-slow" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M30,50 Q30,20 50,20 Q70,20 70,50 Q70,70 50,80 Q40,75 30,50" fill="none" stroke="currentColor" strokeWidth="2" className="text-pink-700" />
          <path d="M35,50 Q35,30 50,30 Q65,30 65,50 Q65,65 50,72 Q42,68 35,50" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-pink-700" />
        </svg>
      </div>

      {/* Traditional Indian Diyas (lamps) */}
      <div className="absolute bottom-1/3 right-20 w-20 h-20 opacity-30 animate-sway">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-700">
          <ellipse cx="50" cy="60" rx="30" ry="12" fill="currentColor" />
          <ellipse cx="50" cy="58" rx="25" ry="10" fill="currentColor" opacity="0.7" />
          <path d="M45,55 Q50,40 55,55" stroke="currentColor" strokeWidth="2" fill="none" className="text-yellow-600" />
        </svg>
      </div>

      {/* Geometric patterns - triangles */}
      <div className="absolute top-1/2 right-10 w-24 h-24 opacity-25 animate-float-medium" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-purple-700">
          <polygon points="50,20 80,70 20,70" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,30 70,60 30,60" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,40 60,50 40,50" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Hexagonal patterns */}
      <div className="absolute top-3/4 left-1/2 w-28 h-28 opacity-25 animate-spin-slow" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-700">
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Decorative dots pattern - darker */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 left-1/2 w-3 h-3 rounded-full bg-orange-700 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-pink-700 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-yellow-700 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-20 left-1/3 w-3 h-3 rounded-full bg-orange-700 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-2/3 left-1/5 w-2 h-2 rounded-full bg-purple-700 animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-1/5 right-1/5 w-2 h-2 rounded-full bg-cyan-700 animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Swaying leaves */}
      <div className="absolute bottom-1/4 left-10 w-16 h-16 opacity-30 animate-sway" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full text-green-700">
          <path d="M50,80 Q30,60 30,40 Q30,20 50,10 Q70,20 70,40 Q70,60 50,80" fill="currentColor" opacity="0.5" />
          <path d="M50,10 L50,80" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}
