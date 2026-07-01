import React from "react";

const Starfield: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#0F1419]">
      {/* Nebula / Galaxy Glows - Very subtle */}
      <div 
        className="absolute top-[-20%] left-[-10%] w-[80%] h-[70%] rounded-[100%] opacity-[0.04] blur-[120px] animate-pulse"
        style={{ 
          background: "radial-gradient(ellipse at center, #0088cc 0%, transparent 70%)",
          animationDuration: "20s",
          transform: "rotate(-15deg)"
        }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] rounded-[100%] opacity-[0.03] blur-[100px]"
        style={{ 
          background: "radial-gradient(ellipse at center, #a855f7 0%, transparent 70%)",
          animation: "float 30s ease-in-out infinite",
          transform: "rotate(20deg)"
        }}
      />
      
      {/* Stars Layer 1 (Small & Distant) */}
      <div className="absolute inset-0">
        {[...Array(150)].map((_, i) => (
          <div
            key={`star-s-${i}`}
            className="absolute bg-white rounded-full"
            style={{
              width: (Math.random() * 1 + 0.5) + "px",
              height: (Math.random() * 1 + 0.5) + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.3 + 0.1,
              animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Stars Layer 2 (Brighter & Closer) */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-m-${i}`}
            className="absolute bg-[#0088cc] rounded-full blur-[0.2px]"
            style={{
              width: (Math.random() * 2 + 1) + "px",
              height: (Math.random() * 2 + 1) + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.4 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Shooting Star - Rare effect */}
      <div 
        className="absolute top-[-5%] left-[-5%] w-[2px] h-[100px] bg-gradient-to-b from-white to-transparent opacity-0"
        style={{
          animation: "shooting-star 15s linear infinite",
          animationDelay: "5s",
          transform: "rotate(45deg)"
        }}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes shooting-star {
          0% { transform: translate(0, 0) rotate(45deg); opacity: 0; }
          5% { opacity: 0.5; }
          10% { transform: translate(500px, 500px) rotate(45deg); opacity: 0; }
          100% { transform: translate(500px, 500px) rotate(45deg); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default Starfield;
