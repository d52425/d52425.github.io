// === めんたいパーティクル宇宙 - v3 ===
(function() {
  'use strict';

  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return; // キャンバスがなければ何もしない

  const ctx = canvas.getContext('2d');
  const container = document.querySelector('.sim-canvas-wrap');

  let W = 0, H = 0;
  function resize() {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    W = rect.width;
    H = rect.height;
    if (W === 0 || H === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // リサイズ監視（コンテナサイズ変更時）
  const ro = new ResizeObserver(() => resize());
  if (container) ro.observe(container);
  window.addEventListener('resize', resize);
  // 初期化遅延（DOM描画後）
  setTimeout(resize, 100);

  // ゲームからのレート情報を反映するための参照
  let gameRef = null;

  const EMOJIS = {
    fish: ['🐟', '🌊', '🐠'],
    mentai: ['🔴', '🍣', '✨'],
    money: ['💰', '💎', '🪙'],
    auto: ['🦐', '⚙️', '🔧']
  };

  const MAX_NORMAL = 30;
  const MAX_BURST = 25;
  const CONNECT_DIST_SQ = 140 * 140;

  let particles = [];
  let lastTime = performance.now();
  let frameCount = 0;

  class Particle {
    constructor(x, y, type, isBurst) {
      this.x = x != null ? x : Math.random() * W;
      this.y = y != null ? y : Math.random() * H;
      const s = isBurst ? 3.5 : 0.5;
      this.vx = (Math.random() - 0.5) * s;
      this.vy = (Math.random() - 0.5) * s;
      this.size = Math.random() * 10 + 12;
      this.type = type || 'auto';
      this.emoji = (EMOJIS[this.type] || EMOJIS.auto)[(Math.random() * 3) | 0];
      this.isBurst = !!isBurst;
      this.life = isBurst ? 1.0 : 9999;
      this.decay = isBurst ? 0.02 : 0;
      this.phase = Math.random() * Math.PI * 2;
    }

    update(dt) {
      this.phase += dt;
      if (!this.isBurst) {
        this.vx += Math.sin(this.phase * 0.7) * 0.001;
        this.vy += Math.cos(this.phase * 0.5) * 0.001;
      }
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.998;
      this.vy *= 0.998;

      if (this.isBurst) {
        this.life -= this.decay;
        this.vy += 0.03;
      }

      if (this.x < -30) this.x = W + 30;
      if (this.x > W + 30) this.x = -30;
      if (this.y < -30) this.y = H + 30;
      if (this.y > H + 30) this.y = -30;
    }

    draw(ctx) {
      if (this.isBurst && this.life <= 0) return;
      ctx.globalAlpha = this.isBurst ? Math.max(this.life, 0) : 0.5;
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

  function spawnBurst(x, y, count, type) {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, type, true);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6 - 2;
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

  function updateNormalParticles() {
    if (!gameRef) return;
    // レートに応じて通常粒子の比率を調整
    const totalRate = gameRef.autoFishRate + gameRef.autoMakeRate + gameRef.autoSellRate;
    if (totalRate <= 0) return;

    const normal = particles.filter(p => !p.isBurst);
    const targetCounts = {
      fish: Math.round(MAX_NORMAL * (gameRef.autoFishRate / totalRate)),
      mentai: Math.round(MAX_NORMAL * (gameRef.autoMakeRate / totalRate)),
      money: Math.round(MAX_NORMAL * (gameRef.autoSellRate / totalRate)),
      auto: 0
    };

    for (const p of normal) {
      const r = Math.random();
      if (r < gameRef.autoFishRate / totalRate) p.type = 'fish';
      else if (r < (gameRef.autoFishRate + gameRef.autoMakeRate) / totalRate) p.type = 'mentai';
      else p.type = 'money';
      p.emoji = EMOJIS[p.type][(Math.random() * 3) | 0];
    }
  }

  let framePh = 0;
  function drawConnections() {
    const n = particles.filter(p => !p.isBurst);
    if (n.length < 2) return;

    ctx.lineWidth = 0.8;
    for (let i = 0; i < n.length; i++) {
      const p1 = n[i];
      for (let j = i + 1; j < n.length; j++) {
        const p2 = n[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < CONNECT_DIST_SQ) {
          const a = (1 - d2 / CONNECT_DIST_SQ) * 0.1;
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
    framePh += dt;

    if (!ctx || W === 0 || H === 0) {
      requestAnimationFrame(loop);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    // 接続線は3フレームに1回だけ計算
    if (frameCount % 3 === 0) {
      drawConnections();
    }

    // 2秒ごとに通常粒子の種類を更新
    if (framePh > 2) {
      framePh = 0;
      updateNormalParticles();
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

  // クリック連携（中央ペインがクリックされた場合）
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.clicker-zone, .resource-item, .upgrade-item:not(.disabled), .shop-tab');
    if (!t) return;

    let type = 'auto';
    if (t.classList.contains('fish-zone') || t.classList.contains('fish-res')) type = 'fish';
    else if (t.classList.contains('make-zone') || t.classList.contains('mentai-res')) type = 'mentai';
    else if (t.classList.contains('sell-zone') || t.classList.contains('money-res')) type = 'money';
    else if (t.classList.contains('upgrade-item')) type = 'auto';

    spawnBurst(e.clientX, e.clientY, 4, type);
    addRipple(e.clientX, e.clientY);
  });

  init();
  requestAnimationFrame(loop);

  window.MentaiViz = {
    burst: spawnBurst,
    ripple: addRipple,
    count: () => particles.length,
    setGame: (g) => { gameRef = g; }
  };
})();
