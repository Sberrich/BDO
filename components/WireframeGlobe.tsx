"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  /** Visual size in CSS pixels */
  size?: number;
  /** Spin direction */
  reverse?: boolean;
  /** Soften for reduced motion / decorative use */
  intensity?: number;
};

/** Red geodesic wireframe globe — inspired by tropheebdo.ma partnership hero. */
export function WireframeGlobe({
  className = "",
  size = 420,
  reverse = false,
  intensity = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let angle = reverse ? Math.PI * 0.35 : 0;
    let running = true;

    const resize = () => {
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const R = size * 0.42;
    const cx = size / 2;
    const cy = size / 2;
    const latStep = Math.PI / 10;
    const lonStep = (Math.PI * 2) / 18;

    type Pt = { x: number; y: number; z: number; u: number; v: number };
    const project = (p: Pt, rot: number) => {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const x1 = p.x * cos - p.z * sin;
      const z1 = p.x * sin + p.z * cos;
      const tilt = 0.38;
      const y1 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
      const persp = 1.35 / (1.35 + z2 / R);
      return {
        x: cx + x1 * persp,
        y: cy + y1 * persp,
        z: z2,
        a: 0.18 + 0.82 * ((z2 + R) / (2 * R)),
      };
    };

    const points: Pt[] = [];
    for (let i = 0; i <= 10; i++) {
      const lat = -Math.PI / 2 + i * latStep;
      const ring = Math.cos(lat);
      const y = Math.sin(lat) * R;
      for (let j = 0; j < 18; j++) {
        const lon = j * lonStep;
        points.push({
          x: Math.cos(lon) * ring * R,
          y,
          z: Math.sin(lon) * ring * R,
          u: i,
          v: j,
        });
      }
    }

    const edges: [number, number][] = [];
    const idx = (i: number, j: number) => i * 18 + (j % 18);
    for (let i = 0; i <= 10; i++) {
      for (let j = 0; j < 18; j++) {
        edges.push([idx(i, j), idx(i, j + 1)]);
        if (i < 10) edges.push([idx(i, j), idx(i + 1, j)]);
      }
    }

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, size, size);

      const glow = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.15);
      glow.addColorStop(0, `rgba(227, 6, 19, ${0.14 * intensity})`);
      glow.addColorStop(0.55, `rgba(227, 6, 19, ${0.05 * intensity})`);
      glow.addColorStop(1, "rgba(227, 6, 19, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
      ctx.fill();

      const projected = points.map((p) => project(p, angle));

      ctx.lineCap = "round";
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depth = (pa.a + pb.a) / 2;
        ctx.strokeStyle = `rgba(255, 72, 78, ${0.18 + 0.55 * depth * intensity})`;
        ctx.lineWidth = 0.7 + depth * 0.9;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      for (const p of projected) {
        const r = 1.1 + p.a * 1.8 * intensity;
        ctx.fillStyle = `rgba(255, 90, 95, ${0.35 + 0.65 * p.a * intensity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce) {
        angle += (reverse ? -1 : 1) * 0.0042;
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    if (reduce) {
      // still painted once
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [size, reverse, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`wire-globe ${className}`}
      aria-hidden="true"
    />
  );
}
