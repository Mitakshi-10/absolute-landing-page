/* ═══════════════════════════════════════════════════════════
   ABSOLUT RASPBERRI — PREMIUM INTRO EXPERIENCE
   Interactive particle system and cinematic bottle outline
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Constants & Configuration ──────────────────────────────
  const GLOW_COLOR = 'rgba(200, 39, 63, 0.4)';
  const PARTICLES_DENSITY = 3; // Pixel step size (lower = more particles, higher = faster)

  // ─── DOM References ──────────────────────────────────────────
  const canvas = document.getElementById('introCanvas');
  const scrollHint = document.getElementById('introScrollHint');

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // ─── State Variables ─────────────────────────────────────────
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  let titleSize = 0;
  let eyebrowSize = 0;

  let particles = [];
  let lightStreaks = [];
  let bottleImage = null;
  let bottleSilhouette = null;
  let bottleGlow = null;

  let autoTime = 0;           // Timer for entrance sequence
  let scrollProgress = 0;     // 0 to 1 based on introSection scroll
  let hasScrolled = false;    // Toggle scroll control once scrolled
  let isLoaded = false;
  let isReady = false;        // Ready to animate after resources load

  // Animation parameters
  let glowOpacity = 0;
  let bottleOpacity = 0;
  let textEntranceOpacity = 0;

  // ─── Light Streak Definition ─────────────────────────────────
  class LightStreak {
    constructor() {
      this.reset(true);
    }

    reset(startRandom = false) {
      this.depth = Math.random() * 1.2 + 0.4; // Parallax factor
      this.length = (Math.random() * 200 + 100) * this.depth;
      this.width = (Math.random() * 1.5 + 0.5) * this.depth;
      
      // Start offscreen left
      this.x = startRandom ? Math.random() * width : -this.length;
      this.y = Math.random() * height;
      this.speed = (Math.random() * 1.2 + 0.4) * this.depth;
      this.maxOpacity = Math.random() * 0.35 + 0.1;
      this.opacity = 0;
      this.fadeState = 'in'; // 'in', 'active', 'out'
    }

    update(speedMultiplier) {
      this.x += this.speed * speedMultiplier;

      // Handle opacity lifecycle
      if (this.fadeState === 'in') {
        this.opacity += 0.01;
        if (this.opacity >= this.maxOpacity) {
          this.opacity = this.maxOpacity;
          this.fadeState = 'active';
        }
      } else if (this.fadeState === 'active') {
        if (this.x > width * 0.8) {
          this.fadeState = 'out';
        }
      } else if (this.fadeState === 'out') {
        this.opacity -= 0.01;
        if (this.opacity <= 0) {
          this.reset(false);
        }
      }

      // Safeguard boundaries
      if (this.x > width + 50) {
        this.reset(false);
      }
    }

    draw() {
      if (this.opacity <= 0) return;

      const grad = ctx.createLinearGradient(this.x, this.y, this.x + this.length, this.y);
      grad.addColorStop(0, 'rgba(232, 48, 74, 0)');
      grad.addColorStop(0.3, `rgba(232, 48, 74, ${this.opacity})`);
      grad.addColorStop(0.7, `rgba(232, 48, 74, ${this.opacity})`);
      grad.addColorStop(1, 'rgba(232, 48, 74, 0)');

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.length, this.y);
      ctx.lineWidth = this.width;
      ctx.strokeStyle = grad;
      ctx.stroke();
    }
  }

  // ─── Setup Offscreen Silhouettes for Bottle ─────────────────
  function setupBottleAssets() {
    if (!bottleImage) return;

    // 1. Create Solid Red Silhouette
    bottleSilhouette = document.createElement('canvas');
    bottleSilhouette.width = bottleImage.naturalWidth || 1280;
    bottleSilhouette.height = bottleImage.naturalHeight || 720;
    
    const sCtx = bottleSilhouette.getContext('2d');
    sCtx.drawImage(bottleImage, 0, 0);
    sCtx.globalCompositeOperation = 'source-in';
    sCtx.fillStyle = '#e8304a'; // Vibrant glowing brand red
    sCtx.fillRect(0, 0, bottleSilhouette.width, bottleSilhouette.height);

    // 2. Create Pre-blurred Glow Silhouette for performance
    bottleGlow = document.createElement('canvas');
    bottleGlow.width = bottleSilhouette.width;
    bottleGlow.height = bottleSilhouette.height;
    
    const gCtx = bottleGlow.getContext('2d');
    gCtx.filter = 'blur(15px)';
    gCtx.drawImage(bottleSilhouette, 0, 0);
    gCtx.filter = 'none';
  }

  // ─── Generate Text Particles ─────────────────────────────────
  function initTextParticles() {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = width;
    tempCanvas.height = height;

    // Font responsive scaling
    const scale = Math.min(width / 1440, 1.2);
    titleSize = Math.max(38, Math.round(84 * scale));
    eyebrowSize = Math.max(12, Math.round(20 * scale));

    tempCtx.textBaseline = 'middle';
    tempCtx.textAlign = 'center';

    // 1. Draw "BORN FROM" (Eyebrow)
    tempCtx.font = `200 ${eyebrowSize}px 'Outfit', sans-serif`;
    tempCtx.fillStyle = '#ffffff'; // White particles
    // Add letter spacing manually for HTML canvas
    const eyebrowText = "B O R N   F R O M";
    tempCtx.fillText(eyebrowText, width / 2, height / 2 - titleSize * 0.85);

    // 2. Draw "BOLD FLAVOR" (Main Title)
    tempCtx.font = `900 ${titleSize}px 'Anton', sans-serif`;
    tempCtx.fillStyle = '#ff003c'; // Crimson red particles
    tempCtx.fillText("BOLD FLAVOR", width / 2, height / 2 + titleSize * 0.1);

    // Extract pixels
    const imgData = tempCtx.getImageData(0, 0, width, height);
    const data = imgData.data;
    particles = [];

    const step = PARTICLES_DENSITY;

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];

        if (alpha > 140) {
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Differentiate white vs. red text particles
          let color = '#f5ede0'; // cream / white
          if (r > 200 && g < 100 && b < 100) {
            color = '#ff184c'; // brand raspberry red
          }

          // Spacing and physics variables
          particles.push({
            ox: x,
            oy: y,
            x: x,
            y: y,
            color: color,
            size: Math.random() * 1.5 + 0.6,
            alpha: 0,
            
            // Speed factor
            speed: Math.random() * 0.8 + 0.2,
            
            // Unique drift offsets
            dx: (Math.random() - 0.5) * width * 0.35,
            dy: (Math.random() - 0.7) * height * 0.45,
            
            // Swirl values for vortex sucking phase
            swirlRadius: Math.random() * 180 + 40,
            swirlSpeed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
            swirlOffset: Math.random() * Math.PI * 2
          });
        }
      }
    }
  }

  // ─── Resize Canvas ───────────────────────────────────────────
  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Regenerate text positions for new dimensions
    if (isReady) {
      initTextParticles();
    }
  }

  // ─── Initialize Streaks ──────────────────────────────────────
  function initStreaks() {
    lightStreaks = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      lightStreaks.push(new LightStreak());
    }
  }

  // ─── Scroll Calculations ─────────────────────────────────────
  function checkScroll() {
    const scrolled = window.scrollY;
    const introHeight = window.innerHeight * 3; // 300vh
    
    const currentProg = Math.max(0, Math.min(1, scrolled / introHeight));

    // Enable scroll overrides on user scroll action
    if (Math.abs(scrolled) > 15) {
      hasScrolled = true;
    }

    if (hasScrolled) {
      scrollProgress = currentProg;
    }
  }

  // ─── Main Animation Loop ─────────────────────────────────────
  function tick() {
    requestAnimationFrame(tick);

    if (!isReady) return;

    // Clear Canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Time increment for automatic entrance
    if (!hasScrolled) {
      autoTime += 0.016; // Approx 60fps
    }

    // ── Calculate Interpolated Transitions ──
    if (!hasScrolled) {
      // Phase 1: Automatic Entrance Timings (0s to 3s)
      glowOpacity = Math.min(0.4, autoTime / 1.5);
      bottleOpacity = Math.min(0.18, Math.max(0, (autoTime - 0.5) / 2));
      textEntranceOpacity = Math.min(1, Math.max(0, (autoTime - 1.2) / 1.2));
      scrollProgress = 0;
    } else {
      // Phase 2: Scroll-Driven Parameters
      // glowOpacity transitions smoothly based on scroll
      if (scrollProgress < 0.6) {
        glowOpacity = 0.4 + (scrollProgress / 0.6) * 0.2; // pulse slightly
        bottleOpacity = 0.18 + (scrollProgress / 0.6) * 0.22;
        textEntranceOpacity = 1;
      } else {
        // Sucking vortex and fade out near bottom
        const shrinkFactor = (1 - scrollProgress) / 0.4; // 1 down to 0
        glowOpacity = 0.6 * shrinkFactor;
        bottleOpacity = 0.4 * shrinkFactor;
        textEntranceOpacity = shrinkFactor;
      }
    }

    // ── 1. Draw Ambient Center Glow ──
    if (glowOpacity > 0) {
      const glowGrad = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width * 0.35, height * 0.5)
      );
      glowGrad.addColorStop(0, `rgba(200, 39, 63, ${glowOpacity * 0.75})`);
      glowGrad.addColorStop(0.35, `rgba(160, 24, 48, ${glowOpacity * 0.3})`);
      glowGrad.addColorStop(0.7, `rgba(200, 39, 63, ${glowOpacity * 0.06})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // ── 2. Draw Light Streaks ──
    const streakSpeedMultiplier = hasScrolled ? 1 + scrollProgress * 4 : 1;
    lightStreaks.forEach(streak => {
      streak.update(streakSpeedMultiplier);
      streak.draw();
    });

    // ── 3. Draw Bottle Silhouette Glow & Outline ──
    if (bottleOpacity > 0 && bottleImage) {
      // Scale silhouette match main canvas object-fit contain logic
      const viewportAspect = width / height;
      const imgAspect = 1280 / 720;
      
      let drawW, drawH, drawX, drawY;
      
      if (viewportAspect > imgAspect) {
        drawH = height;
        drawW = drawH * imgAspect;
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = drawW / imgAspect;
        drawX = 0;
        drawY = (height - drawH) / 2;
      }

      ctx.save();
      ctx.globalAlpha = bottleOpacity;

      // Draw blurred glow silhouette behind
      if (bottleGlow) {
        ctx.drawImage(bottleGlow, drawX, drawY, drawW, drawH);
      }

      // Draw sharp silhouette overlay
      if (bottleSilhouette) {
        ctx.globalAlpha = bottleOpacity * 0.6;
        ctx.drawImage(bottleSilhouette, drawX, drawY, drawW, drawH);
      }

      // Draw original bottle image at very low opacity to show reflections/texture details
      ctx.globalAlpha = bottleOpacity * 0.2;
      ctx.drawImage(bottleImage, drawX, drawY, drawW, drawH);

      ctx.restore();
    }

    // ── 4. Render and Animate Text/Particles ──
    const solidTextOpacity = Math.max(0, 1 - scrollProgress / 0.15) * textEntranceOpacity;

    // Draw crisp vector text initially (fades out as user scrolls)
    if (solidTextOpacity > 0) {
      ctx.save();
      ctx.globalAlpha = solidTextOpacity;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Eyebrow
      ctx.font = `200 ${eyebrowSize}px 'Outfit', sans-serif`;
      ctx.fillStyle = '#f5ede0';
      const eyebrowText = "B O R N   F R O M";
      ctx.fillText(eyebrowText, width / 2, height / 2 - titleSize * 0.85);

      // Title
      ctx.font = `900 ${titleSize}px 'Anton', sans-serif`;
      ctx.fillStyle = '#ff184c';
      ctx.fillText("BOLD FLAVOR", width / 2, height / 2 + titleSize * 0.1);
      ctx.restore();
    }

    // Draw dispersing particles (active when user scrolls)
    if (scrollProgress > 0 && textEntranceOpacity > 0 && particles.length > 0) {
      const scrollThreshold = 0.55; // point where sucking starts
      
      particles.forEach(p => {
        let x, y, alpha;

        if (scrollProgress < scrollThreshold) {
          // Dispersion phase: particles drift away outward
          const factor = scrollProgress / scrollThreshold;
          
          // Apply cubic easing to dispersion drift distance
          const easedFactor = Math.pow(factor, 1.8);
          
          x = p.ox + p.dx * easedFactor;
          y = p.oy + p.dy * easedFactor;
          
          // Particles fade in as solid text fades out
          const particleFadeIn = Math.min(1, scrollProgress / 0.1);
          alpha = textEntranceOpacity * particleFadeIn * (1 - factor * 0.35);
        } else {
          // Absorption vortex phase: particles accelerate to center
          const factor = (scrollProgress - scrollThreshold) / (1 - scrollThreshold); // 0 to 1
          
          const startX = p.ox + p.dx;
          const startY = p.oy + p.dy;
          const targetX = width / 2;
          const targetY = height / 2;

          // Blend position towards center with accelerating speed
          const pull = Math.pow(factor, 2.5); // cubic easing inward
          
          // Add swirl/vortex rotation around center
          const angle = p.swirlOffset + factor * 8 * p.swirlSpeed;
          const currentRadius = p.swirlRadius * (1 - pull);
          
          const rotX = targetX + Math.cos(angle) * currentRadius;
          const rotY = targetY + Math.sin(angle) * currentRadius;

          x = startX + (rotX - startX) * pull;
          y = startY + (rotY - startY) * pull;
          
          alpha = (1 - factor) * 0.85; // fade to zero as they reach center
        }

        if (alpha > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0; // reset
    }

    // Fade out entire intro canvas near the end of the intro scroll
    if (scrollProgress > 0.88) {
      const canvasAlpha = Math.max(0, (1 - scrollProgress) / 0.12);
      canvas.style.opacity = String(canvasAlpha);
      if (scrollHint) scrollHint.style.opacity = '0';
    } else {
      canvas.style.opacity = '1';
      // Scroll cue disappears immediately when user begins scrolling
      if (scrollHint) scrollHint.style.opacity = hasScrolled ? '0' : '1';
    }
  }

  // ─── Setup and Resource Syncing ──────────────────────────────
  function init() {
    isLoaded = true;

    // Fetch bottle image from global shared object
    if (window.AbsolutExperience) {
      bottleImage = window.AbsolutExperience.getFirstImage();
      setupBottleAssets();
      
      // If images were already preloaded, initialize immediately
      if (window.AbsolutExperience.isLoaded()) {
        onPreloaderFinished();
      } else {
        // Wait for preload finish event
        window.AbsolutExperience.onLoaded(() => {
          // Re-fetch in case pointer updated
          bottleImage = window.AbsolutExperience.getFirstImage();
          setupBottleAssets();
          onPreloaderFinished();
        });
      }
    } else {
      // Fallback: wait a bit and try
      setTimeout(init, 100);
    }
  }

  function onPreloaderFinished() {
    isReady = true;
    
    const startIntro = () => {
      resize();
      initStreaks();
      
      // Bind Scroll & Resize Events
      window.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', resize, { passive: true });
      
      // Check initial scroll position
      checkScroll();

      // Start rendering frame tick
      tick();
    };

    if (document.fonts) {
      document.fonts.ready.then(startIntro);
    } else {
      startIntro();
    }
  }

  // Kick off
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }

})();
