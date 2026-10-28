/* YANCY / V20 Interaction layer
   One-time progressive setup. No scroll listeners, no animation libraries. */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(reduce.matches) return;
  document.body.classList.add('motion-polish');
  // The existing observer handles these after main.js creates project content.
  const selectors = document.body.dataset.page==='home'
    ? ['.approach-heading','.approach-steps article','.manifesto-head','.manifesto-foot','.experience-bar', '.contact-header']
    : ['.story-body article','.case-study-details','.case-study-chapter-title','.gallery-title','.brand-system-heading'];
  for(const selector of selectors){
    document.querySelectorAll(selector).forEach(el=>{
      el.setAttribute('data-reveal','');
      el.classList.add('motion-chapter');
    });
  }
  // Animate the portfolio gallery ONLY when a user changes the filter/archive,
  // never on every scroll, and never delay the initial gallery paint.
  if(document.body.dataset.page==='home' && typeof Element.prototype.animate==='function'){
    const gallery=document.getElementById('projects');
    const controls=document.querySelector('.work-toolbar');
    const toggle=document.getElementById('archive-toggle');
    const animateVisible=()=>{
      const cards=Array.from(gallery?.querySelectorAll('.project-card:not([hidden])')||[]);
      cards.forEach((card,i)=>{
        // Limit the stagger so a full archive never takes a long time to appear.
        card.animate([
          {opacity:.55,transform:'translate3d(0,8px,0)'},
          {opacity:1,transform:'translate3d(0,0,0)'}
        ],{duration:300,delay:Math.min(i,8)*24,easing:'cubic-bezier(.2,.75,.25,1)'});
      });
    };
    const clickFilter=(e)=>{
      if(!e.target.closest('[data-filter],#archive-toggle')) return;
      requestAnimationFrame(animateVisible);
    };
    controls?.addEventListener('click',clickFilter);
    toggle?.addEventListener('click',clickFilter);
  }
})();
