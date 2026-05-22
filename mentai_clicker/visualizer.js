// === めんたい粒子空間 - 軽量版 ===
(function() {
  'use strict';

  const canvas = document.createElement('canvas');
  canvas.id = 'mentai-canvas';
  const ctx = canvas.getContext('2d');

  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0.35;';
  document.body.insertBefore(canvas, document.body.firstChild);

  let W = 0, H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const EMOJIS = ['🐟','🔴','💰','🍣','✨','🦐','🌊'];
  const MAX_NORMAL = 20;
  const MAX_BURST = 30;
  const CONNECT_DIST_SQ = 150 * 150; // 距離の二乗で比較（sqrt省略）

  let particles = [];
  let lastTime = performance.now();
  let frameCount = 0;

  class Particle {
    constructor(x, y, isBurst) {
      this.x = x != null ? x : Math.random() * W;
      this.y = y != null ? y : Math.random() * H;
      const s = isBurst ? 4 : 0.6;
      this.vx = (Math.random() - 0.5) * s;
      this.vy = (Math.random() - 0.5) * s;
      this.size = Math.random() * 10 + 14;
      this.emoji = EMOJIS[(Math.random() * EMOJIS.length) | 0];
      this.isBurst = !!isBurst;
      this.life = isBurst ? 1.0 : 9999;
      this.decay = isBurst ? 0.018 : 0;
      this.phase = Math.random() * Math.PI * 2;
    }

    update(dt) {
      this.phase += dt;
      if (!this.isBurst) {
        this.vx += Math.sin(this.phase * 0.7) * 0.0015;
        this.vy += Math.cos(this.phase * 0.5) * 0.0015;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.998;
      this.vy *= 0.998;

      if (this.isBurst) {
        this.life -= this.decay;
        this.vy += 0.04;
      }

      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw(ctx) {
      if (this.isBurst && this.life <= 0) return;
      ctx.globalAlpha = this.isBurst ? this.life : 0.35;
      ctx.font = this.size + 'px serif';
      ctx.fillText(this.emoji, this.x | 0, (this.y | 0) + 2);
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < MAX_NORMAL; i++) {
      particles.push(new Particle());
    }
  }

  function spawnBurst(x, y, count, emoji) {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, true);
      if (emoji) p.emoji = emoji;
      p.vx = (Math.random() - 0.5) * 7;
      p.vy = (Math.random() - 0.5) * 7 - 2;
      particles.push(p);
    }
    trimParticles();
  }

  function trimParticles() {
    const normal = particles.filter(p => !p.isBurst);
    const burst = particles.filter(p => p.isBurst);
    if (normal.length > MAX_NORMAL) {
      particles = burst.concat(normal.slice(normal.length - MAX_NORMAL));
    }
    if (burst.length > MAX_BURST) {
      const keep = burst.filter(p => p.life > 0.3).slice(-MAX_BURST);
      particles = keep.concat(normal);
    }
  }

  function drawConnections() {
    const n = particles.filter(p => !p.isBurst);
    if (n.length < 2) return;

    ctx.lineWidth = 1;
    for (let i = 0; i < n.length; i++) {
      const p1 = n[i];
      for (let j = i + 1; j < n.length; j++) {
        const p2 = n[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CONNECT_DIST_SQ) {
          const a = (1 - d2 / CONNECT_DIST_SQ) * 0.08;
          ctx.strokeStyle = 'rgba(255,107,107,' + a.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  let ripples = [];
  function addRipple(x, y) {
    ripples.push({ x, y, r: 5, a: 0.5 });
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    frameCount++;

    ctx.clearRect(0, 0, W, H);

    // 接続線は3フレームに1回だけ計算
    if (frameCount % 3 === 0) {
      drawConnections();
    }

    // リップル更新
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.r += 4;
      r.a -= 0.025;
      if (r.a <= 0) {
        ripples.splice(i, 1);
      } else {
        ctx.globalAlpha = r.a;
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 粒子更新＆描画
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update(dt);
      p.draw(ctx);
      if (p.isBurst && p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  // クリック連携
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.resource-box, .action-btn, .big-btn, .upgrade-item:not(.disabled), .tab-btn');
    if (!t) return;

    let emoji = '✨';
    if (t.classList.contains('fish-clickable') || t.id === 'btn-fish') emoji = '🐟';
    else if (t.classList.contains('mentai-clickable') || t.id === 'btn-make') emoji = '🔴';
    else if (t.classList.contains('money-clickable') || t.id === 'btn-sell' || t.id === 'btn-shop') emoji = '💰';
    else if (t.classList.contains('upgrade-item')) emoji = '⬆️';
    else if (t.classList.contains('tab-btn')) emoji = '🌊';

    spawnBurst(e.clientX, e.clientY, 5, emoji);
    addRipple(e.clientX, e.clientY);
  });

  init();
  requestAnimationFrame(loop);

  window.MentaiViz = {
    burst: spawnBurst,
    ripple: addRipple,
    count: () => particles.length
  };
})();
