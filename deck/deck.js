// Voit Proof deck: keyboard navigation and the slide counter.
// Classic script (the deck is opened from file://, where module scripts are blocked).
// Node tests load it with require() through the shim at the bottom.
(function (global) {
  'use strict';

  function nextIndex(current, key, count) {
    const last = count - 1;
    switch (key) {
      case 'ArrowDown': case 'ArrowRight': case 'PageDown': case ' ': return Math.min(last, current + 1);
      case 'ArrowUp': case 'ArrowLeft': case 'PageUp': return Math.max(0, current - 1);
      case 'Home': return 0;
      case 'End': return last;
      default: return current;
    }
  }

  function mountDeck(doc) {
    const slides = Array.from(doc.querySelectorAll('.slide'));
    const counter = doc.getElementById('counter');
    const pad = (n) => String(n).padStart(2, '0');
    let current = 0;

    const show = (i) => {
      current = i;
      counter.textContent = `${pad(i + 1)} / ${pad(slides.length)}`;
      doc.body.dataset.ground = slides[i].dataset.ground;
    };

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) show(slides.indexOf(e.target));
    }, { threshold: 0.6 });
    slides.forEach((s) => io.observe(s));

    doc.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('textarea, input, button')) return;
      const i = nextIndex(current, e.key, slides.length);
      if (i !== current) { e.preventDefault(); slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });

    show(0);

    const embed = doc.getElementById('embed');
    if (embed) {
      if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) embed.classList.add('drawn');
      else new IntersectionObserver((es, obs) => {
        if (es.some((e) => e.isIntersecting)) { embed.classList.add('drawn'); obs.disconnect(); }
      }, { threshold: 0.5 }).observe(embed);
    }
  }

  const api = { nextIndex, mountDeck };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.VoitDeck = api;
  if (typeof document !== 'undefined' && !(typeof module !== 'undefined' && module.exports)) {
    document.addEventListener('DOMContentLoaded', () => mountDeck(document));
  }
})(typeof window !== 'undefined' ? window : globalThis);
