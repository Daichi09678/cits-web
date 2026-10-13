"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function ParticleNetwork({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];
    let isVisible = false;

    // Cap devicePixelRatio to avoid massive memory/composite lag on mobile retina
    const getDpr = () => Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      const dpr = getDpr();
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width === 0 || height === 0) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createParticles = () => {
      const isMobile = window.innerWidth < 768;
      // Drastically reduce particle count on mobile for smooth 60fps
      const maxCount = isMobile ? 22 : 55;
      const count = Math.min(
        Math.floor((canvas.offsetWidth * canvas.offsetHeight) / (isMobile ? 25000 : 18000)),
        maxCount
      );
      particles = Array.from({ length: Math.max(count, 12) }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
        vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.45),
        radius: Math.random() * 1.5 + 1,
      }));
    };

    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    const draw = () => {
      if (!isVisible) return;

      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const pLen = particles.length;
      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(242, 101, 34, 0.45)";
        ctx.fill();
      }

      // Draw connections using squared distance to avoid Math.sqrt on non-connected pairs
      for (let i = 0; i < pLen; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < pLen; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const dist = Math.sqrt(distSq);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(242, 101, 34, ${0.16 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    // Pause when not visible in viewport to prevent background CPU/GPU lag!
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            isVisible = true;
            cancelAnimationFrame(animationId);
            animationId = requestAnimationFrame(draw);
          }
        } else {
          isVisible = false;
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    resize();
    createParticles();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none will-change-transform ${className}`}
    />
  );
}
