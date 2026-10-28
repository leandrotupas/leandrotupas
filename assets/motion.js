/* Intentionally tiny, accessible progressive enhancement: one IntersectionObserver. */
(()=>{
  'use strict';
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('[data-reveal]');
  if(!targets.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
    });
  },{rootMargin:'0px 0px -5% 0px',threshold:0.025});
  document.documentElement.classList.add('motion-supported');
  document.body.classList.add('motion-ready');
  targets.forEach(el=>obs.observe(el));
})();
