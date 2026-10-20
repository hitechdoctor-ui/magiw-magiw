"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  alpha: number;
  twinkle: number;
  twinkleSpeed: number;
  color: string;
};

const PARTICLE_COUNT = 110;
const CHAMPAGNE = ["#D4AF37", "#FFF8DC"];

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.4 + 0.35,
    speedY: -(Math.random() * 0.32 + 0.06),
    speedX: (Math.random() - 0.5) * 0.22,
    alpha: Math.random() * 0.5 + 0.12,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.018 + 0.006,
    color: CHAMPAGNE[Math.random() > 0.45 ? 0 : 1]!,
  };
}

export function ChampagneParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationId = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(width, height),
      );
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        particle.y += particle.speedY;
        particle.x += particle.speedX;
        particle.twinkle += particle.twinkleSpeed;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        const flicker =
          particle.alpha * (0.6 + Math.sin(particle.twinkle) * 0.4);

        context.globalAlpha = flicker;
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3.2,
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "transparent");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius * 3.2,
          0,
          Math.PI * 2,
        );
        context.fill();
        context.globalAlpha = 1;
      }

      animationId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
