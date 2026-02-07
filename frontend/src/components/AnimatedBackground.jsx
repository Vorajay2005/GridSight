export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900"></div>

      {/* Stars field */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => {
          const size = Math.random() * 2 + 1;
          return (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            ></div>
          );
        })}
      </div>

      {/* MASSIVE SUN - top right corner */}
      <div className="absolute -top-64 -right-64 w-[800px] h-[800px]">
        {/* Sun core */}
        <div className="absolute inset-0 bg-gradient-radial from-yellow-300 via-orange-400 to-transparent rounded-full animate-pulse-slow"></div>
        {/* Sun glow layers */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-400/60 via-yellow-500/30 to-transparent rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200/40 via-orange-300/20 to-transparent rounded-full blur-2xl animate-pulse-slow animation-delay-4000"></div>
        {/* Sun rays rotating */}
        <div className="absolute inset-0 animate-rotate-slow">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-96 bg-gradient-to-t from-transparent via-yellow-400/30 to-transparent"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-50%)`,
                transformOrigin: 'center'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Solar panels grid - bottom left */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20">
        <div className="grid grid-cols-12 gap-2 p-8 transform perspective-1000 rotate-x-60">
          {[...Array(48)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-blue-900 to-slate-800 rounded border border-cyan-500/30"
              style={{
                animation: `solar-panel-shine ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${(i % 4) * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Energy beams from sun */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          const startX = 85 + Math.random() * 10;
          const startY = 5 + Math.random() * 15;
          const endX = 10 + Math.random() * 80;
          const endY = 60 + Math.random() * 30;

          return (
            <svg key={i} className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
              <defs>
                <linearGradient id={`beam-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line
                x1={`${startX}%`}
                y1={`${startY}%`}
                x2={`${endX}%`}
                y2={`${endY}%`}
                stroke={`url(#beam-${i})`}
                strokeWidth="3"
                className="animate-beam"
                style={{
                  animationDelay: `${i * 0.5}s`
                }}
              />
            </svg>
          );
        })}
      </div>

      {/* Floating solar panel icons */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => {
          const size = 40 + Math.random() * 60;
          return (
            <div
              key={`panel-${i}`}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animation: `float-solar ${10 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400"/>
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400"/>
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-orange-400"/>
                <line x1="30" y1="10" x2="30" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400/50"/>
                <line x1="70" y1="10" x2="70" y2="90" stroke="currentColor" strokeWidth="1" className="text-orange-400/50"/>
                <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" strokeWidth="1" className="text-orange-400/50"/>
                <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" className="text-orange-400/50"/>
              </svg>
            </div>
          );
        })}
      </div>

      {/* Energy particles - rising upward like heat/energy */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => {
          const colors = ['bg-yellow-400', 'bg-orange-400', 'bg-amber-400'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={`particle-${i}`}
              className={`absolute w-2 h-2 ${color} rounded-full filter blur-sm`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${100 + Math.random() * 20}%`,
                opacity: 0.6,
                animation: `rise-up ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          );
        })}
      </div>

      {/* Light rays from bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-yellow-500/10 via-orange-500/5 to-transparent"></div>

      {/* Atmospheric depth - darker at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      {/* Tech grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMTAgNjAgTSAwIDEwIEwgNjAgMTAgTSAyMCAwIEwgMjAgNjAgTSAwIDIwIEwgNjAgMjAgTSAzMCAwIEwgMzAgNjAgTSAwIDMwIEwgNjAgMzAgTSA0MCAwIEwgNDAgNjAgTSAwIDQwIEwgNjAgNDAgTSA1MCAwIEwgNTAgNjAgTSAwIDUwIEwgNjAgNTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
    </div>
  )
}
