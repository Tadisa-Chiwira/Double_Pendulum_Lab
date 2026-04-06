import React, { useEffect, useRef, useState } from "react";
import { PALETTE } from "./constants";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);
  
  // state for parameters
  const [gravity, setGravity] = useState(9.81);
  const [m1, setM1] = useState(1.0);
  const [m2, setM2] = useState(1.0);

  // parameter sync function
  const updateBackendParams = async (g: number, mass1: number, mass2: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/update_params?g=${g}&m1=${mass1}&m2=${mass2}`); 
    }
    catch (err) {
      console.error("Sync failed:", err);
    }
  }

  // 1. data Ingestion
  useEffect(() => {
    const fetchStep = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/step");
        const data = await response.json();
        setCoords(data);
        // track the path of the second bob
        setTrace((prev) => [...prev, { x: data.x2, y: data.y2 }].slice(-100));
      } 
      catch (err) {
        console.error("Feed interrupted:", err);
      }
    };
    const interval = setInterval(fetchStep, 16);
    return () => clearInterval(interval);
  }, []);

  // 2. rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x1, y1, x2, y2 } = coords;
    const scale = 150;
    
    const centerX = canvas.width/2;
    const centerY = canvas.height/2.5;

    // draw Background
    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw Trace (Historical Path)
    trace.forEach((point, i) => {
      ctx.beginPath();
      const alpha = i / trace.length;
      ctx.strokeStyle = `rgba(114, 15, 50, ${alpha})`; 
      ctx.lineWidth = 2;
      
      const prevPoint = trace[i - 1];
      if (prevPoint) {
        ctx.moveTo(centerX + prevPoint.x * scale, centerY - prevPoint.y * scale);
        ctx.lineTo(centerX + point.x * scale, centerY - point.y * scale);
        ctx.stroke();
      }
    });
    // draw pendulum rods
    ctx.beginPath();
    ctx.strokeStyle = PALETTE.pivot;
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x1 * scale, centerY - y1 * scale);
    ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale);
    ctx.stroke();

    // draw bobs
    ctx.fillStyle = PALETTE.arm1;
    ctx.beginPath();
    ctx.arc(centerX + x1 * scale, centerY - y1 * scale, 10, 0, Math.PI * 2);
    ctx.fill();
    // glow effect
    ctx.shadowBlur = 20;
    ctx.shadowColor = PALETTE.arm2;

    ctx.fillStyle = PALETTE.arm2;
    ctx.beginPath();
    ctx.arc(centerX + x2 * scale, centerY - y2 * scale, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // rest shadow so it doesn't blur everything else
  }, [coords, trace]);

  return (
    <div style={{ backgroundColor: "#020617", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ letterSpacing: "2px", color: PALETTE.pivot }}>DOUBLE PENDULUM | RK4 CHAOS</h2>
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
        <canvas ref={canvasRef} width={800} height={600} style={{ border: `1px solid ${PALETTE.pivot}`, borderRadius: '8px' }} />
        
        {/* Control Panel */}
        <div style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', width: '280px', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, color: PALETTE.arm2 }}>Parameters</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Gravity (G): {gravity}</label>
            <input type="range" min="0" max="30" step="0.1" value={gravity} style={{ width: '100%', accentColor: PALETTE.arm2 }}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setGravity(val);
                updateBackendParams(val, m1, m2);
              }} 
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>Mass 1 (M1): {m1}</label>
            <input type="range" min="0.1" max="10" step="0.1" value={m1} style={{ width: '100%', accentColor: PALETTE.arm1 }}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setM1(val);
                updateBackendParams(gravity, val, m2);
              }} 
            />
          </div>

          <button onClick={() => fetch("http://127.0.0.1:8000/reset")}
            style={{ width: '100%', padding: '12px', background: PALETTE.arm2, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Reset Simulation
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
