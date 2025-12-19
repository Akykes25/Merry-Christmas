"use strict";

/**
 * PARTICLES CANVAS
 * - Puntos suaves que flotan y se conectan con líneas tenues al acercarse.
 * - No usa librerías: liviano y funciona en móvil.
 */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d", { alpha: true });

let w = 0, h = 0, dpr = 1;
let particles = [];
let rafId = null;

const CONFIG = {
  countDesktop: 70,
  countMobile: 42,
  maxSpeed: 0.35,
  linkDist: 130,
  dotRadius: [0.9, 2.2],
  // Colores en sutil gradiente, inspirados en tu paleta
  colors: ["#04A4D6", "#5F0E9C", "#AD301D", "rgba(255,255,255,.65)"],
};

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function isMobile() {
  return matchMedia("(max-width: 800px)").matches;
}

function resize() {
  dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  w = Math.floor(window.innerWidth);
  h = Math.floor(window.innerHeight);

  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  initParticles();
}

function initParticles() {
  const targetCount = isMobile() ? CONFIG.countMobile : CONFIG.countDesktop;
  particles = [];

  for (let i = 0; i < targetCount; i++) {
    particles.push({
      x: rand(0, w),
      y: rand(0, h),
      vx: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
      vy: rand(-CONFIG.maxSpeed, CONFIG.maxSpeed),
      r: rand(CONFIG.dotRadius[0], CONFIG.dotRadius[1]),
      c: CONFIG.colors[Math.floor(rand(0, CONFIG.colors.length))],
    });
  }
}

function step() {
  ctx.clearRect(0, 0, w, h);

  // dots
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // rebote suave
    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.c;
    ctx.globalAlpha = 0.70;
    ctx.fill();
  }

  // links
  ctx.globalAlpha = 1;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < CONFIG.linkDist) {
        const t = 1 - dist / CONFIG.linkDist;
        ctx.strokeStyle = "rgba(255,255,255," + (0.14 * t).toFixed(3) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  rafId = requestAnimationFrame(step);
}

/**
 * UI: scroll suave al botón "Leer despacio"
 */
const scrollHint = document.getElementById("scrollHint");
scrollHint?.addEventListener("click", () => {
  document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth", block: "start" });
});


