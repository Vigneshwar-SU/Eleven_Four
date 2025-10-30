// Basic interactions: smooth scroll, simple lightbox modal, and surprise button handler
document.addEventListener('DOMContentLoaded', ()=>{
  // smooth scroll for anchor links (if any remain)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
    })
  })

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lb-image');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose = document.getElementById('lb-close');

  function openLightbox(img){
    lbImage.src = img.src;
    lbImage.alt = img.alt || '';
    lbCaption.textContent = img.dataset.caption || img.alt || '';
    lightbox.setAttribute('aria-hidden','false');
    // prevent background scroll on mobile
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImage.src = '';
    document.body.style.overflow = '';
  }

  // click handlers for gallery images
  document.querySelectorAll('.gallery img, .grid img').forEach(img=>{
    img.addEventListener('click', ()=> openLightbox(img));
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

  // Surprise button (placeholder for confetti or audio)
  const surprise = document.getElementById('open-surprise');
  surprise && surprise.addEventListener('click', ()=>{
    alert('Surprise! Replace this with confetti, audio, or a hidden message.');
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if(navToggle && mainNav){
    navToggle.addEventListener('click', ()=>{
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    // close nav when a link is clicked
    mainNav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
      if(mainNav.classList.contains('open')){
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }
    }));
  }

  // Typed text effect (simple)
  const typedEl = document.getElementById('typed-msg');
  if(typedEl){
    const full = typedEl.dataset.text || typedEl.textContent || '';
    typedEl.textContent = '';
    let i = 0;
    const speed = 34; // ms per char
    function typeChar(){
      if(i <= full.length){
        typedEl.textContent = full.slice(0,i);
        i++;
        setTimeout(typeChar, speed + (i % 7 === 0 ? 40 : 0));
      }
    }
    // start typing after a short delay
    setTimeout(typeChar, 600);
  }

  // reveal-on-scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal, .reveal-img');
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('show');
        // staggered for images
        if(e.target.classList.contains('reveal-img')){
          e.target.style.transitionDelay = (Math.random()*300)+'ms';
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0) scale(1)';
        }
        o.unobserve(e.target);
      }
    })
  },{threshold:0.12});
  reveals.forEach(r=>obs.observe(r));

  // parallax hero photo subtle effect
  const heroPhoto = document.querySelector('.hero-photo img');
  if(heroPhoto){
    window.addEventListener('scroll', ()=>{
      const sc = window.scrollY;
      const y = Math.min(30, sc * 0.04);
      heroPhoto.style.transform = `translateY(${y}px) scale(${1 + Math.min(0.03, sc*0.0006)})`;
    },{passive:true});
  }

  // small extra: animate the big story title on load
  const storyTitle = document.querySelector('.story-title');
  if(storyTitle){
    storyTitle.animate([
      {opacity:0, transform:'translateY(12px) scale(0.98)'},
      {opacity:1, transform:'translateY(0) scale(1)'}
    ],{duration:900, easing:'cubic-bezier(.2,.9,.2,1)', fill:'forwards', delay:450});
  }

  // Surprise: confetti + heart burst + small animation
  const surpriseBtn = document.querySelector('.btn-surprise');
  if(surpriseBtn){
    surpriseBtn.addEventListener('click', (e)=>{
      // burst confetti if library loaded
      try{
        confetti && confetti({
          particleCount: 120,
          spread: 160,
          origin: { y: 0.3 }
        });
        // a second gentle burst
        setTimeout(()=>confetti({particleCount: 60,spread:100,origin:{y:0.35}}), 350);
      }catch(err){
        // fallback: small animation
        surpriseBtn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:700,easing:'cubic-bezier(.2,.9,.2,1)'});
      }
      // small visual pulse on the header
      document.querySelector('.site-header')?.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:700,easing:'ease-out'});
    });
  }
});
