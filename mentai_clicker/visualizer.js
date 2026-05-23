// === めんたいパーティクル宇宙 - v3 重力＆堆積版 ===
(function() {
  'use strict';

  const canvas = document.getElementById('sim-canvas');
  if (!canvas) return;

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

  const ro = new ResizeObserver(() => resize());
  if (container) ro.observe(container);
  window.addEventListener('resize', resize);
  setTimeout(resize, 100);

  let gameRef = null;

  const EMOJIS = {
    fish: ['🐟', '🌊', '🐠'],
    mentai: ['🔴', '🍣', '✨'],
    money: ['💰', '💎', '🪙'],
    auto: ['🦐', '⚙️', '🔧']
  };

  // パラメータ
  const GRAVITY = 0.25;          // 重力加速度
  const BOUNCE = 0.55;           // 床の反発係数
  const WALL_BOUNCE = 0.6;       // 壁の反発係数
  const FRICTION = 0.985;        // 空気抵抗・摩擦
  const MAX_NORMAL = 8;          // 通常パーティクル数（軽量化のため大幅削減）
  const MAX_BURST = 12;          // バースト最大（軽量化のため削減）
  const CONNECT_DIST_SQ = 100 * 100;

  let particles = [];
  let lastTime = performance.now();
  let frameCount = 0;

  class Particle {
    constructor(x, y, type, isBurst) {
      this.x = x != null ? x : Math.random() * W;
      // 通常パーティクルは上から、バーストは指定位置から
      this.y = y != null ? y : (isBurst ? y : -Math.random() * 50 - 10);

      const s = isBurst ? 3.5 : (Math.random() * 2 + 1);
      this.vx = isBurst ? (Math.random() - 0.5) * s : (Math.random() - 0.5) * 1.5;
      this.vy = isBurst ? (Math.random() - 0.5) * s - 2 : Math.random() * 1;

      this.size = Math.random() * 10 + 12;
      this.type = type || 'auto';
      this.emoji = (EMOJIS[this.type] || EMOJIS.auto)[(Math.random() * 3) | 0];
      this.isBurst = !!isBurst;
      this.life = isBurst ? 1.0 : 9999;
      this.decay = isBurst ? 0.015 : 0;
      this.phase = Math.random() * Math.PI * 2;
      this.settled = false;      // 堆積（静止）フラグ
      this.settleTimer = 0;      // 静止判定用タイマー
    }

    update(dt) {
      this.phase += dt * 2;

      if (this.isBurst) {
        this.life -= this.decay;
        if (this.life <= 0) return;
      }

      if (!this.settled) {
        // 重力
        this.vy += GRAVITY;
        this.vx *= FRICTION;
        this.vy *= FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        // 壁判定（左右）
        if (this.x < this.size * 0.5) {
          this.x = this.size * 0.5;
          this.vx = Math.abs(this.vx) * WALL_BOUNCE;
        } else if (this.x > W - this.size * 0.5) {
          this.x = W - this.size * 0.5;
          this.vx = -Math.abs(this.vx) * WALL_BOUNCE;
        }

        // 床判定（底に積もる）
        const floorY = H - this.size * 0.5;
        if (this.y >= floorY) {
          this.y = floorY;
          this.vy = -this.vy * BOUNCE;

          // 十分に遅くなったら静止（堆積状態）
          if (Math.abs(this.vy) < 1.0 && Math.abs(this.vx) < 0.5) {
            this.settleTimer += dt;
            if (this.settleTimer > 0.8) {
              this.settled = true;
              this.vx = 0;
              this.vy = 0;
              // 少しランダムに位置をずらして自然な積もり感
              this.x = Math.max(this.size, Math.min(W - this.size, this.x + (Math.random() - 0.5) * 6));
            }
          } else {
            this.settleTimer = 0;
          }
        }

        // 天井判定（通常パーティクルが上に逃げないように）
        if (this.y < -this.size) {
          this.y = -this.size;
          this.vy = Math.abs(this.vy);
        }
      } else {
        // 堆積状態：微かな揺らぎだけ
        this.x += Math.sin(this.phase) * 0.15;
      }
    }

    draw(ctx) {
      if (this.isBurst && this.life <= 0) return;
      ctx.globalAlpha = this.isBurst ? Math.max(this.life, 0) * 0.8 : 0.75;
      ctx.font = this.size + 'px serif';
      ctx.fillText(this.emoji, this.x | 0, (this.y | 0) + 2);

      // 堆積したらちょっと影をつけて重なった感
      if (this.settled) {
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = '#000';
        ctx.fillText(this.emoji, (this.x | 0) + 1, (this.y | 0) + 3);
      }
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < MAX_NORMAL; i++) {
      const p = new Particle(Math.random() * W, -Math.random() * H, 'auto', false);
      // 初期生成時はぱっと全体にばらける（落下途中から始める）
      p.y = Math.random() * H * 0.9;
      p.vy = Math.random() * 2;
      particles.push(p);
    }
  }

  function spawnBurst(x, y, count, type) {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, type, true);
      p.vx = (Math.random() - 0.5) * 6;
      p.vy = (Math.random() - 0.5) * 6 - 3;
      particles.push(p);
    }
    trimParticles();
  }

  function spawnNormal(x, y, count, type, sizeScale = 1) {
    for (let i = 0; i < count; i++) {
      const p = new Particle(x, y, type, false);
      // 若干ばらつきを持たせて自然に落下
      p.vx = (Math.random() - 0.5) * 1.5;
      p.vy = Math.random() * 0.5;
      // 生産量に応じてサイズをスケール
      p.size = p.size * sizeScale;
      particles.push(p);
    }
    trimParticles();
  }

  function trimParticles() {
    // 通常パーティクルの上限管理
    const normal = particles.filter(p => !p.isBurst);
    const burst = particles.filter(p => p.isBurst);

    if (normal.length > MAX_NORMAL) {
      // 古い（indexが小さい）settledパーティクルを優先に削除
      const settled = normal.filter(p => p.settled);
      const active = normal.filter(p => !p.settled);
      const removeSettledCount = Math.max(0, normal.length - MAX_NORMAL);
      const keptSettled = settled.slice(removeSettledCount);
      particles = burst.concat(active).concat(keptSettled);
    }

    if (burst.length > MAX_BURST) {
      const keep = burst.filter(p => p.life > 0.3).slice(-MAX_BURST);
      const normalRest = particles.filter(p => !p.isBurst);
      particles = keep.concat(normalRest);
    }
  }

  // 堆積パーティクルの山の高さに応じて天井からの再出現を制御
  function managePileHeight() {
    const settled = particles.filter(p => !p.isBurst && p.settled);
    const avgY = settled.length > 0
      ? settled.reduce((s, p) => s + p.y, 0) / settled.length
      : H;
    // 平均位置が高すぎるなら通常パーティクルを減らす
    if (avgY < H * 0.35) {
      const normal = particles.filter(p => !p.isBurst);
      if (normal.length > 10) {
        // 一番上に近いパーティクルを削除
        normal.sort((a, b) => a.y - b.y);
        normal.shift();
        particles = particles.filter(p => p.isBurst).concat(normal);
      }
    }
  }

  function updateNormalParticles() {
    if (!gameRef) return;
    const totalRate = gameRef.autoFishRate + gameRef.autoMakeRate + gameRef.autoSellRate;
    if (totalRate <= 0) return;

    const normal = particles.filter(p => !p.isBurst);
    for (const p of normal) {
      const r = Math.random();
      if (r < gameRef.autoFishRate / totalRate) p.type = 'fish';
      else if (r < (gameRef.autoFishRate + gameRef.autoMakeRate) / totalRate) p.type = 'mentai';
      else p.type = 'money';
      p.emoji = EMOJIS[p.type][(Math.random() * 3) | 0];
    }
  }

  function drawConnections() {
    const n = particles.filter(p => !p.isBurst && !p.settled);
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

    if (!ctx || W === 0 || H === 0) {
      requestAnimationFrame(loop);
      return;
    }

    ctx.clearRect(0, 0, W, H);

    if (frameCount % 3 === 0) drawConnections();
    if (frameCount % 120 === 0) updateNormalParticles(); // 2秒ごと
    if (frameCount % 60 === 0) managePileHeight();

    // リップル
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

  document.addEventListener('click', (e) => {
    const t = e.target.closest('.clicker-zone, .resource-item, .upgrade-item:not(.disabled), .shop-tab');
    if (!t) return;

    let type = 'auto';
    if (t.classList.contains('fish-zone') || t.classList.contains('fish-res')) type = 'fish';
    else if (t.classList.contains('make-zone') || t.classList.contains('mentai-res')) type = 'mentai';
    else if (t.classList.contains('sell-zone') || t.classList.contains('money-res')) type = 'money';

    spawnBurst(e.clientX, e.clientY, 2, type);
    addRipple(e.clientX, e.clientY);
  });

  init();
  requestAnimationFrame(loop);

  window.MentaiViz = {
    burst: spawnBurst,
    normal: spawnNormal,
    ripple: addRipple,
    count: () => particles.length,
    setGame: (g) => { gameRef = g; }
  };
})();
