/* ═══════════════════════════════════════════════════════════
   ABSOLUT RASPBERRI — SCROLL ANIMATION ENGINE
   Smooth frame-by-frame canvas rendering with RAF + lerp
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Config ──────────────────────────────────────────────────
  const TOTAL_FRAMES   = 240;
  const FRAMES_DIR     = './frames/';
  const LERP_FACTOR    = 0.12;   // Smoothing factor (lower = smoother/slower)
  const MIN_PRELOAD_MS = 600;    // Minimum preloader display time

  // ─── DOM refs ────────────────────────────────────────────────
  const preloader     = document.getElementById('preloader');
  const preloaderBar  = document.getElementById('preloaderBar');
  const preloaderCnt  = document.getElementById('preloaderCount');
  const canvas        = document.getElementById('frameCanvas');
  const ctx           = canvas.getContext('2d', { alpha: false });
  const scrollZone    = document.getElementById('scrollZone');
  const stickyFrame   = document.getElementById('stickyFrame');
  const progressFill  = document.getElementById('progressFill');
  const progressDot   = document.getElementById('progressDot');
  const frameNumEl    = document.getElementById('frameNum');


  // ─── State ───────────────────────────────────────────────────
  const images          = new Array(TOTAL_FRAMES);
  let   loadedCount     = 0;
  let   allLoaded       = false;

  let   scrollProgress  = 0;   // 0–1 mapped to scroll within zone
  let   targetFrame     = 0;   // The frame we want to be at
  let   currentFrame    = 0;   // The interpolated (lerped) frame
  let   rafId           = null;
  let   lastDrawnFrame  = -1;  // Avoid redundant redraws

  // ─── Frame path builder ──────────────────────────────────────
  function frameSrc(i) {
    // Frames are numbered 001 – 240
    const n = String(i + 1).padStart(3, '0');
    return `${FRAMES_DIR}ezgif-frame-${n}.jpg`;
  }

  // ─── Preload all frames ──────────────────────────────────────
  function preloadAll() {
    const startTime = Date.now();

    return new Promise((resolve) => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';

        img.onload = img.onerror = () => {
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          preloaderBar.style.width  = pct + '%';
          preloaderCnt.textContent  = pct + '%';

          if (loadedCount === TOTAL_FRAMES) {
            // Ensure minimum display time so it doesn't flash
            const elapsed = Date.now() - startTime;
            const delay   = Math.max(0, MIN_PRELOAD_MS - elapsed);
            setTimeout(resolve, delay);
          }
        };

        img.src    = frameSrc(i);
        images[i]  = img;
      }
    });
  }

  // ─── Canvas setup ────────────────────────────────────────────
  function setupCanvas() {
    const firstImg = images[0];
    canvas.width   = firstImg.naturalWidth  || 1280;
    canvas.height  = firstImg.naturalHeight || 720;
    drawFrame(0);
  }

  // ─── Draw a single frame ─────────────────────────────────────
  function drawFrame(frameIndex) {
    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastDrawnFrame = frameIndex;
  }

  // ─── Scroll progress calculation ─────────────────────────────
  function getScrollProgress() {
    const scrolled = window.scrollY;
    const introHeight = window.innerHeight * 3; // 300vh of scroll
    const totalHeight = scrollZone.offsetHeight - window.innerHeight;

    if (scrolled < introHeight) {
      return 0; // Keep bottle at frame 0 during the intro sequence
    }

    const animScrolled = scrolled - introHeight;
    const animHeight = totalHeight - introHeight;
    return Math.max(0, Math.min(1, animScrolled / animHeight));
  }

  // ─── Main animation loop ─────────────────────────────────────
  function animate() {
    rafId = requestAnimationFrame(animate);

    // Smoothly interpolate toward target frame
    currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;

    // Round to nearest integer for actual rendering
    const frameIndex = Math.round(currentFrame);
    const clampedIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));

    // Only redraw if frame actually changed
    if (clampedIdx !== lastDrawnFrame) {
      drawFrame(clampedIdx);

      // Update frame counter
      frameNumEl.textContent = String(clampedIdx + 1).padStart(3, '0');
    }

    // Update progress indicator
    const progressPct = clampedIdx / (TOTAL_FRAMES - 1);
    progressFill.style.height = (progressPct * 100) + '%';
    progressDot.style.top     = (progressPct * 100) + '%';
  }

  // ─── Scroll handler ──────────────────────────────────────────
  function onScroll() {
    scrollProgress = getScrollProgress();
    targetFrame    = scrollProgress * (TOTAL_FRAMES - 1);

    // Dynamic HUD visibility based on scroll position
    const scrolled = window.scrollY;
    const introHeight = window.innerHeight * 3; // 300vh
    const progressTrack = document.querySelector('.progress-track');
    const frameCounter = document.querySelector('.frame-counter');

    if (scrolled < introHeight) {
      if (progressTrack) progressTrack.style.opacity = '0';
      if (frameCounter) frameCounter.style.opacity = '0';
    } else {
      const fadeProgress = Math.min(1, (scrolled - introHeight) / (window.innerHeight * 0.5));
      if (progressTrack) progressTrack.style.opacity = String(fadeProgress);
      if (frameCounter) frameCounter.style.opacity = String(fadeProgress);
    }
  }

  // ─── Resize handler ──────────────────────────────────────────
  function onResize() {
    // Canvas resolution stays the same; CSS handles display sizing
    // Re-draw current frame to fill updated display
    drawFrame(Math.round(currentFrame));
  }

  // ─── Init ────────────────────────────────────────────────────
  async function init() {
    // Start preloading
    await preloadAll();
    allLoaded = true;

    // Setup canvas with first frame dimensions
    setupCanvas();

    // Hide preloader
    preloader.classList.add('hidden');

    // Dispatch loaded event for intro.js
    window.dispatchEvent(new CustomEvent('absolutLoaded'));

    // Wire events
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial scroll sync
    onScroll();

    // Start RAF loop
    animate();
  }

  // Expose to window for cooperation with intro.js
  window.AbsolutExperience = {
    getImages: () => images,
    getFirstImage: () => images[0],
    isLoaded: () => allLoaded,
    onLoaded: (cb) => {
      if (allLoaded) cb();
      else window.addEventListener('absolutLoaded', cb);
    }
  };

  // ─── Kick off ────────────────────────────────────────────────
  init();

})();
