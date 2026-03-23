import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 animate-gradient-shift" />

      {/* Flying Birds */}
      <div className="absolute top-20 left-0 w-12 h-12 opacity-40 animate-fly-across">
        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-800">
          <path
            d="M20,50 Q30,40 40,50 Q50,40 60,50"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Floating Mandala */}
      <div className="absolute top-24 left-12 w-32 opacity-25 animate-spin-slow">

        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-700">

          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>

        </svg>

      </div>


      {/* Floating Lotus */}
      <div className="absolute top-1/3 right-1/3 w-28 opacity-30 animate-float-medium">

        <svg viewBox="0 0 100 100" className="w-full h-full text-pink-700">

          <ellipse cx="50" cy="60" rx="10" ry="22" fill="currentColor" opacity="0.5"/>
          <ellipse cx="35" cy="60" rx="9" ry="20" fill="currentColor" opacity="0.5"/>
          <ellipse cx="65" cy="60" rx="9" ry="20" fill="currentColor" opacity="0.5"/>

          <circle cx="50" cy="60" r="6" fill="currentColor"/>

        </svg>

      </div>


      {/* Floating Diya */}
      <div className="absolute bottom-1/3 right-16 w-20 opacity-30 animate-sway">

        <svg viewBox="0 0 100 100" className="w-full h-full text-orange-700">

          <ellipse cx="50" cy="60" rx="30" ry="12" fill="currentColor"/>
          <ellipse cx="50" cy="58" rx="25" ry="10" fill="currentColor" opacity="0.7"/>

          <path
            d="M45,55 Q50,40 55,55"
            stroke="orange"
            strokeWidth="3"
            fill="none"
          />

        </svg>

      </div>


      {/* Rotating Rangoli Pattern */}
      <div className="absolute bottom-24 left-1/4 w-36 opacity-25 animate-spin-slow">

        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-700">

          {[...Array(12)].map((_,i)=>{

            const angle=(i*30*Math.PI)/180
            const x=50+40*Math.cos(angle)
            const y=50+40*Math.sin(angle)

            return <circle key={i} cx={x} cy={y} r="3" fill="currentColor"/>

          })}

        </svg>

      </div>


      {/* Temple Bells */}
      <div className="absolute top-1/2 right-10 w-20 opacity-25 animate-sway">

        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-700">

          <path
            d="M50 20 L70 60 H30 Z"
            fill="currentColor"
            opacity="0.6"
          />

          <circle cx="50" cy="65" r="5" fill="currentColor"/>

        </svg>

      </div>


      {/* Decorative Floating Dots */}
      <div className="absolute inset-0 opacity-15">

        <div className="absolute top-20 left-1/2 w-3 h-3 rounded-full bg-orange-700 animate-pulse"/>
        <div className="absolute top-1/3 left-1/4 w-3 h-3 rounded-full bg-pink-700 animate-pulse"/>
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-yellow-700 animate-pulse"/>

      </div>


      {/* Floating Leaf */}
      <div className="absolute bottom-1/4 left-10 w-16 opacity-30 animate-sway">

        <svg viewBox="0 0 100 100" className="w-full h-full text-green-700">

          <path
            d="M50,80 Q30,60 30,40 Q30,20 50,10 Q70,20 70,40 Q70,60 50,80"
            fill="currentColor"
            opacity="0.6"
          />

        </svg>

      </div>

    </div>
  );
}