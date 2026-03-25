import { useEffect, useState } from "react"

const letters = ["K", "A", "L", "A", "K", "R", "I", "T", "I"]

// Unique SVG decorations per letter index
const decorations = [
  // K - lotus petals
  <svg key="k" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[0,60,120,180,240,300].map((r, i) => (
      <ellipse key={i} cx="50" cy="50" rx="6" ry="18" fill="#f97316" opacity="0.35"
        transform={`rotate(${r} 50 50) translate(0 -28)`} />
    ))}
  </svg>,
  // A - rangoli diamond grid
  <svg key="a1" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[[50,20],[30,50],[50,80],[70,50],[50,20]].map(([x,y],i,a) => i < a.length-1 &&
      <line key={i} x1={x} y1={y} x2={a[i+1][0]} y2={a[i+1][1]} stroke="#f97316" strokeWidth="1.5" opacity="0.5"/>
    )}
    {[50,30,70,50].map((cx,i) => <circle key={i} cx={[50,30,70,50][i]} cy={[20,50,50,80][i]} r="3" fill="#f97316" opacity="0.6"/>)}
  </svg>,
  // L - peacock feather arcs
  <svg key="l" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[0,1,2,3].map(i => (
      <path key={i} d={`M50,50 Q${50+20+i*8},${30-i*5} ${50+10+i*6},${20-i*4}`}
        stroke="#f97316" strokeWidth="1.2" opacity={0.6 - i*0.1} fill="none"/>
    ))}
    <circle cx="50" cy="50" r="4" fill="#f97316" opacity="0.5"/>
  </svg>,
  // A2 - star burst
  <svg key="a2" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[0,45,90,135].map((r,i) => (
      <line key={i} x1="50" y1="50" x2={50+28*Math.cos(r*Math.PI/180)} y2={50+28*Math.sin(r*Math.PI/180)}
        stroke="#f97316" strokeWidth="1.5" opacity="0.45"/>
    ))}
    {[0,45,90,135].map((r,i) => (
      <line key={i+4} x1="50" y1="50" x2={50-28*Math.cos(r*Math.PI/180)} y2={50-28*Math.sin(r*Math.PI/180)}
        stroke="#fbbf24" strokeWidth="1" opacity="0.35"/>
    ))}
    <circle cx="50" cy="50" r="5" fill="#f97316" opacity="0.4"/>
  </svg>,
  // K2 - concentric circles (mandala)
  <svg key="k2" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[12,20,28].map((r,i) => <circle key={i} cx="50" cy="50" r={r} stroke="#f97316" strokeWidth="1" opacity={0.5-i*0.1} strokeDasharray="4 3"/>)}
    {[0,90,180,270].map((r,i) => <circle key={i+3} cx={50+22*Math.cos(r*Math.PI/180)} cy={50+22*Math.sin(r*Math.PI/180)} r="3" fill="#f97316" opacity="0.5"/>)}
  </svg>,
  // R - wave lines
  <svg key="r" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[35,50,65].map((y,i) => (
      <path key={i} d={`M20,${y} Q35,${y-10} 50,${y} Q65,${y+10} 80,${y}`}
        stroke="#f97316" strokeWidth="1.5" fill="none" opacity={0.6-i*0.1}/>
    ))}
  </svg>,
  // I - vertical dots
  <svg key="i1" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[20,35,50,65,80].map((y,i) => <circle key={i} cx="50" cy={y} r={i===2?5:3} fill="#f97316" opacity={i===2?0.7:0.4}/>)}
    <line x1="50" y1="20" x2="50" y2="80" stroke="#f97316" strokeWidth="0.8" opacity="0.2"/>
  </svg>,
  // T - cross with corner dots
  <svg key="t" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    <line x1="20" y1="50" x2="80" y2="50" stroke="#f97316" strokeWidth="1.5" opacity="0.45"/>
    <line x1="50" y1="20" x2="50" y2="80" stroke="#f97316" strokeWidth="1.5" opacity="0.45"/>
    {[[25,25],[75,25],[25,75],[75,75]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="3" fill="#f97316" opacity="0.4"/>)}
  </svg>,
  // I2 - radiating lines
  <svg key="i2" className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((r,i) => (
      <line key={i} x1="50" y1="50"
        x2={50+25*Math.cos(r*Math.PI/180)} y2={50+25*Math.sin(r*Math.PI/180)}
        stroke="#f97316" strokeWidth="1" opacity="0.35"/>
    ))}
    <circle cx="50" cy="50" r="5" fill="#f97316" opacity="0.5"/>
  </svg>,
]

export default function IntroAnimation({ onDone }) {
  const [visible, setVisible] = useState(0) // how many letters shown
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (visible < letters.length) {
      const t = setTimeout(() => setVisible(v => v + 1), visible === 0 ? 300 : 180)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setFadeOut(true), 900)
      const t2 = setTimeout(() => onDone(), 1600)
      return () => { clearTimeout(t); clearTimeout(t2) }
    }
  }, [visible])

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#fff7ed] transition-opacity duration-700 ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      {/* subtle background mandala */}
      <svg className="absolute opacity-10 w-[500px] h-[500px]" viewBox="0 0 200 200" fill="none">
        {[20,35,50,65,80].map((r,i) => <circle key={i} cx="100" cy="100" r={r} stroke="#f97316" strokeWidth="0.8" strokeDasharray="5 4"/>)}
        {[0,45,90,135,180,225,270,315].map((r,i) => (
          <line key={i} x1="100" y1="100"
            x2={100+85*Math.cos(r*Math.PI/180)} y2={100+85*Math.sin(r*Math.PI/180)}
            stroke="#f97316" strokeWidth="0.5"/>
        ))}
      </svg>

      <div className="flex items-end gap-1 sm:gap-2">
        {letters.map((letter, i) => (
          <div
            key={i}
            className="relative flex items-center justify-center"
            style={{
              width: "clamp(36px, 8vw, 80px)",
              height: "clamp(48px, 10vw, 100px)",
              opacity: i < visible ? 1 : 0,
              transform: i < visible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.6)",
              transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              transitionDelay: `${i * 0.04}s`,
            }}
          >
            {/* decoration behind letter */}
            <div className="absolute inset-0 opacity-0" style={{ opacity: i < visible ? 1 : 0, transition: "opacity 0.5s ease", transitionDelay: `${i * 0.04 + 0.2}s` }}>
              {decorations[i]}
            </div>
            <span
              className="relative z-10 font-['Prata'] text-[#b86000] select-none"
              style={{ fontSize: "clamp(32px, 7vw, 72px)", lineHeight: 1 }}
            >
              {letter}
            </span>
          </div>
        ))}
      </div>

      {/* tagline fades in after all letters */}
      <p
        className="absolute bottom-[20%] font-['Outfit'] text-[#f97316] tracking-[0.3em] uppercase text-sm"
        style={{
          opacity: visible >= letters.length ? 1 : 0,
          transform: visible >= letters.length ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        Art &amp; Craft Marketplace
      </p>
    </div>
  )
}
