import { useEffect, useRef } from "react";

export default function NeuralNetworkAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      pulsePhase: number;
      active: boolean;
    }

    const NODE_COUNT = 24;
    let nodes: Node[] = [];

    const initNodes = () => {
      const W = canvas.width;
      const H = canvas.height;
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
        r: 2.2 + Math.random() * 2.8,
        pulsePhase: Math.random() * Math.PI * 2,
        active: Math.random() > 0.38,
      }));
    };
    initNodes();

    let time = 0;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      time += 0.018;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        if (Math.random() < 0.0018) n.active = !n.active;
      }

      // Draw edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.38;
            const bothActive = nodes[i].active && nodes[j].active;
            ctx.strokeStyle = bothActive
              ? `rgba(229, 195, 80, ${alpha * 0.85})`
              : `rgba(210, 160, 40, ${alpha * 0.28})`;
            ctx.lineWidth = bothActive ? 0.9 : 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Data particle along active edges
            if (bothActive && dist < 90) {
              const t2 = (time * 2.2 + i * 0.4) % 1;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t2;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t2;
              ctx.beginPath();
              ctx.arc(px, py, 1.8, 0, Math.PI * 2);
              ctx.fillStyle = "rgba(255, 215, 100, 0.9)";
              ctx.fill();
            }
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(time * 3 + n.pulsePhase) * 0.5 + 0.5;
        if (n.active) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
          grd.addColorStop(0, `rgba(229, 195, 80, ${0.65 + pulse * 0.35})`);
          grd.addColorStop(0.45, `rgba(229, 195, 80, ${0.18 + pulse * 0.1})`);
          grd.addColorStop(1, "rgba(229, 195, 80, 0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(229, 195, 80, ${0.82 + pulse * 0.18})`;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.65, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(175, 125, 28, ${0.28 + pulse * 0.18})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
