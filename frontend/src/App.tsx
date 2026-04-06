import React, { useEffect, useRef, useState} from "react";
import { PALETTE } from "./constants";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coords, setCoords] = useState({ x1: 0, y1: 0, x2: 0, y2: 0});

  // fetch data ffrom my FastAPI "Market Feed"
  const fetchStep = async () => {
    const response = await fetch("http://127.0.0.1:8000/step");
    const data = await response.json();
    setCoords(data);
  };

  useEffect(() => {
    const interval = setInterval(fetchStep, 16); //60fps...probably
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // drawing logic
    const {x1, y1, x2, y2} = coords;
    const scale = 150; // scale the 1.0 unit lengths to pixels
    const centerX = canvas.width/2;
    const centerY = canvas.height/3;

    // 1. clear canvas
    ctx.fillStyle = PALETTE.background;
    ctx.fillRect(0, 0,  canvas.width, canvas.height);

    // 2. draw arms
    ctx.strokeStyle = PALETTE.pivot;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x1 * scale, centerY - y1 * scale);
    ctx.lineTo(centerX + x2 * scale, centerY - y2 * scale);
    ctx.stroke();

    // 3. draw bobs
    ctx.fillStyle = PALETTE.arm1;
    ctx.beginPath();
    ctx.arc(centerX + x1 * scale, centerY - y1 * scale, 8, 0, Math.PI *2);
    ctx.fill();

    ctx.fillStyle = PALETTE.arm2;
    ctx.beginPath();
    ctx.arc(centerX + x2 * scale, centerY - y2 * scale, 8, 0, Math.PI *2);
    ctx.fill();
  }, [coords]);

  return (
    <div style={{backgroundColor: PALETTE.background, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <canvas ref={canvasRef} width={800} height={600} style={{border: `1px solid ${PALETTE.pivot}`}}/>
    </div>
  );

};

export default App;