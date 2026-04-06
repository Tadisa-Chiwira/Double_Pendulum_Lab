import React, { useEffect, useRef, useState } from "react";
import { PALETTE } from "./constants";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [trace, setTrace] = useState<{ x: number; y: number }[]>([]);

  // 1. data Ingestion
  useEffect(() => {
    const fetchStep = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/step");
        const data = await response.json();
        setCoords(data);
        // track the path of the second bob
        setTrace((prev) => [...prev, { x: data.x2, y: data.y2 }].slice(-100));
      } catch (err) {
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
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2.5;

    // draw Background
    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw Trace (Historical Path)
    ctx.beginPath();
    ctx.lineWidth = 1;
    trace.forEach((point, i) => {
      const tx = centerX + point.x * scale;
      const ty = centerY - point.y * scale;
      const alpha = i/trace.length; // dynamic fading <3
      ctx.strokeStyle = `rgba(114, 15, 50, ${alpha})`;

      if (i === 0) ctx.moveTo(tx, ty);
      else { 
        ctx.lineTo(tx, ty);
        ctx.stroke(); // stroke each segment to apply unique alpha
        ctx.beginPath(); // start new path for next segment
        ctx.moveTo(tx, ty);
      }  
    });
    ctx.stroke();

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
    <div style={{ backgroundColor: "#020617", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "white", fontFamily: "Inter, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", letterSpacing: "1px" }}>DOUBLE PENDULUM | RK4 INTEGRATION</h2>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: `1px solid ${PALETTE.pivot}`, borderRadius: "8px" }} />
      <p style={{ marginTop: "15px", color: "#64748b" }}>Backend: Python (FastAPI) | Frontend: React (TypeScript)</p>
    </div>
  );
};

export default App;