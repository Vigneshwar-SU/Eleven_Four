// Loading Screen with Progress Tracking
(function() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingProgress = document.querySelector('.loading-progress');
  const loadingPercentage = document.querySelector('.loading-percentage');
  
  // Get all images and videos
  const allMedia = [
    ...document.querySelectorAll('img'),
    ...document.querySelectorAll('video')
  ];
  
  let loadedCount = 0;
  const totalCount = allMedia.length;
  
  function updateProgress() {
    loadedCount++;
    const percentage = Math.round((loadedCount / totalCount) * 100);
    loadingProgress.style.width = percentage + '%';
    loadingPercentage.textContent = percentage + '%';
    
    // Hide loading screen when all media is loaded
    if (loadedCount >= totalCount) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = '';
      }, 500);
    }
  }
  
  // Prevent scrolling while loading
  document.body.style.overflow = 'hidden';
  
  // Track image loading
  allMedia.forEach(media => {
    if (media.tagName === 'IMG') {
      if (media.complete) {
        updateProgress();
      } else {
        media.addEventListener('load', updateProgress);
        media.addEventListener('error', updateProgress); // Count errors too
      }
    } else if (media.tagName === 'VIDEO') {
      media.addEventListener('loadeddata', updateProgress);
      media.addEventListener('error', updateProgress);
    }
  });
  
  // Fallback: hide loading screen after 10 seconds
  setTimeout(() => {
    if (!loadingScreen.classList.contains('hidden')) {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }, 10000);
})();

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

  // Touch swipe to close lightbox (mobile optimization)
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e)=>{
    touchStartY = e.touches[0].clientY;
  },{passive:true});
  
  lightbox.addEventListener('touchend', (e)=>{
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    // Swipe down to close
    if(diff < -80){
      closeLightbox();
    }
  },{passive:true});

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
    setTimeout(typeChar, 1200);
  }

  // reveal-on-scroll using IntersectionObserver with stagger
  const reveals = document.querySelectorAll('.reveal, .reveal-img');
  const obs = new IntersectionObserver((entries, o)=>{
    entries.forEach((e,idx)=>{
      if(e.isIntersecting){
        // Add stagger delay
        setTimeout(()=>{
          e.target.classList.add('show');
          // Random animation variant for variety
          const variants = ['slide-left','slide-right','zoom'];
          if(e.target.classList.contains('reveal') && Math.random() > 0.6){
            e.target.classList.add(variants[Math.floor(Math.random()*variants.length)]);
          }
        }, idx * 80);
        
        // staggered for images
        if(e.target.classList.contains('reveal-img')){
          e.target.style.transitionDelay = (idx * 120)+'ms';
          e.target.style.opacity = 1;
          e.target.style.transform = 'translateY(0) scale(1)';
        }
        o.unobserve(e.target);
      }
    })
  },{threshold:0.15, rootMargin:'0px 0px -50px 0px'});
  reveals.forEach(r=>obs.observe(r));

  // Parallax effects removed for better performance and cleaner experience

  // Surprise: confetti + heart burst + small animation
  const surpriseBtn = document.querySelector('.btn-surprise');
  if(surpriseBtn){
    surpriseBtn.addEventListener('click', (e)=>{
      // burst confetti if library loaded
      try{
        // Multiple confetti bursts with different colors
        confetti && confetti({
          particleCount: 100,
          spread: 160,
          origin: { y: 0.3 },
          colors: ['#1e40af','#3b82f6','#93c5fd','#dbeafe']
        });
        // second burst from different angle
        setTimeout(()=>confetti({
          particleCount: 80,
          angle: 60,
          spread:100,
          origin:{x:0.2, y:0.4},
          colors: ['#1e40af','#3b82f6','#93c5fd']
        }), 250);
        // third burst from other side
        setTimeout(()=>confetti({
          particleCount: 80,
          angle: 120,
          spread:100,
          origin:{x:0.8, y:0.4},
          colors: ['#3b82f6','#93c5fd','#dbeafe']
        }), 400);
      }catch(err){
        // fallback: animated button
        surpriseBtn.animate([
          {transform:'scale(1) rotate(0deg)'},
          {transform:'scale(1.15) rotate(3deg)'},
          {transform:'scale(0.95) rotate(-3deg)'},
          {transform:'scale(1) rotate(0deg)'}
        ],{duration:800,easing:'cubic-bezier(.2,.9,.2,1)'});
      }
      // animate hero content
      document.querySelector('.hero-content')?.animate([
        {transform:'scale(1) translateY(0)'},
        {transform:'scale(1.02) translateY(-10px)'},
        {transform:'scale(1) translateY(0)'}
      ],{duration:900,easing:'cubic-bezier(.2,.9,.2,1)'});
    });
  }

  // Auto-scroll for Your Peps section with ultra-smooth continuous scrolling
  const pepsGrid = document.querySelector('.peps-grid');
  if(pepsGrid) {
    let scrollPosition = 0;
    let scrollDirection = 1; // 1 for right, -1 for left
    const scrollSpeed = 1.8; // Increased speed for faster scrolling
    let isPaused = false;
    let animationFrame;

    function smoothAutoScroll() {
      if(!isPaused) {
        // Increment scroll position
        scrollPosition += scrollSpeed * scrollDirection;
        
        // Apply smooth scroll using scrollTo
        pepsGrid.scrollLeft = scrollPosition;

        // Check boundaries and reverse direction smoothly
        const maxScroll = pepsGrid.scrollWidth - pepsGrid.clientWidth;
        
        if(scrollPosition >= maxScroll && scrollDirection === 1) {
          scrollDirection = -1; // Reverse to left
          scrollPosition = maxScroll;
        } else if(scrollPosition <= 0 && scrollDirection === -1) {
          scrollDirection = 1; // Reverse to right
          scrollPosition = 0;
        }
      }
      animationFrame = requestAnimationFrame(smoothAutoScroll);
    }

    // Pause on hover (desktop)
    pepsGrid.addEventListener('mouseenter', ()=> { 
      isPaused = true; 
    });
    
    pepsGrid.addEventListener('mouseleave', ()=> { 
      isPaused = false;
      scrollPosition = pepsGrid.scrollLeft; // Sync position
    });

    // Pause on touch (mobile) and handle touch end
    let touchTimeout;
    pepsGrid.addEventListener('touchstart', ()=> { 
      isPaused = true;
      clearTimeout(touchTimeout);
    }, {passive: true});

    pepsGrid.addEventListener('touchend', ()=> { 
      scrollPosition = pepsGrid.scrollLeft; // Sync position
      // Resume after 2 seconds of no touch
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(()=> {
        isPaused = false;
        scrollPosition = pepsGrid.scrollLeft;
      }, 2000);
    }, {passive: true});

    // Sync scroll position when user manually scrolls
    let userScrollTimeout;
    pepsGrid.addEventListener('scroll', ()=> {
      if(isPaused) {
        scrollPosition = pepsGrid.scrollLeft;
      }
      
      // Auto-resume after 3 seconds of no interaction
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(()=> {
        isPaused = false;
        scrollPosition = pepsGrid.scrollLeft;
      }, 3000);
    }, {passive: true});

    // Start the smooth auto-scroll
    smoothAutoScroll();
  }

  // Pep Modal functionality
  const pepModal = document.getElementById('pep-modal');
  const pepModalImg = document.getElementById('pep-modal-img');
  const pepModalVideo = document.getElementById('pep-modal-video');
  const pepModalName = document.getElementById('pep-modal-name');
  const pepModalNote = document.getElementById('pep-modal-note');
  const pepModalClose = document.querySelector('.pep-modal-close');
  const pepCards = document.querySelectorAll('.pep-card');

  // Add read more buttons to each pep card
  pepCards.forEach(card => {
    const content = card.querySelector('.pep-content');
    if(content && !content.querySelector('.pep-read-more')) {
      const readMoreBtn = document.createElement('span');
      readMoreBtn.className = 'pep-read-more';
      readMoreBtn.textContent = 'Click to read more...';
      content.appendChild(readMoreBtn);
    }
  });

  // Open modal when pep card is clicked
  pepCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('.pep-image img');
      const video = card.querySelector('.pep-image video');
      const name = card.querySelector('.pep-name');
      const note = card.querySelector('.pep-note');

      if(name && note) {
        pepModalName.textContent = name.textContent;
        pepModalNote.textContent = note.textContent;
        
        if(video) {
          // Show video, hide image - use MP4 for modal (better quality)
          let videoSrc = video.src || video.currentSrc || '';
          
          // Convert .webm to .mp4 for fullscreen
          if(videoSrc.endsWith('.webm')) {
            videoSrc = videoSrc.replace('.webm', '.mp4');
          } else {
            // Try to get MP4 source from source elements
            const mp4Source = video.querySelector('source[type="video/mp4"]');
            if(mp4Source) {
              videoSrc = mp4Source.src;
            }
          }
          
          pepModalVideo.src = videoSrc;
          pepModalVideo.style.display = 'block';
          pepModalImg.style.display = 'none';
          pepModal.style.setProperty('--modal-bg-image', `url(${videoSrc})`);
        } else if(img) {
          // Show image, hide video
          pepModalImg.src = img.src;
          pepModalImg.alt = img.alt;
          pepModalImg.style.display = 'block';
          pepModalVideo.style.display = 'none';
          pepModal.style.setProperty('--modal-bg-image', `url(${img.src})`);
        }
        
        pepModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      }
    });
  });

  // Close modal functionality
  function closePepModal() {
    pepModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
  }

  if(pepModalClose) {
    pepModalClose.addEventListener('click', closePepModal);
  }

  // Close on background click
  if(pepModal) {
    pepModal.addEventListener('click', (e) => {
      if(e.target === pepModal) {
        closePepModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && pepModal.getAttribute('aria-hidden') === 'false') {
      closePepModal();
    }
    if(e.key === 'Escape' && fullscreenViewer.getAttribute('aria-hidden') === 'false') {
      closeFullscreen();
    }
  });

  // Fullscreen image viewer functionality
  const fullscreenViewer = document.getElementById('fullscreen-viewer');
  const fullscreenImg = document.getElementById('fullscreen-img');
  const fullscreenClose = document.querySelector('.fullscreen-close');
  const pepModalImage = document.querySelector('.pep-modal-image');

  // Open fullscreen when clicking the image in the modal
  if(pepModalImage) {
    pepModalImage.addEventListener('click', () => {
      const currentImg = document.getElementById('pep-modal-img');
      if(currentImg && currentImg.src) {
        fullscreenImg.src = currentImg.src;
        fullscreenImg.alt = currentImg.alt;
        fullscreenViewer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Close fullscreen functionality
  function closeFullscreen() {
    fullscreenViewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if(fullscreenClose) {
    fullscreenClose.addEventListener('click', closeFullscreen);
  }

  // Close on background click
  if(fullscreenViewer) {
    fullscreenViewer.addEventListener('click', (e) => {
      if(e.target === fullscreenViewer) {
        closeFullscreen();
      }
    });
  }

  // Wandering Gallery Fullscreen Functionality
  const galleryFullscreen = document.getElementById('gallery-fullscreen');
  const galleryFullscreenImg = document.getElementById('gallery-fullscreen-img');
  const galleryFullscreenVideo = document.getElementById('gallery-fullscreen-video');
  const galleryFullscreenClose = document.querySelector('.gallery-fullscreen-close');
  const wanderingItems = document.querySelectorAll('.wandering-item');

  wanderingItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const video = item.querySelector('video');
      
      if(img) {
        // Show image
        galleryFullscreenImg.src = img.src;
        galleryFullscreenImg.alt = img.alt;
        galleryFullscreenImg.style.display = 'block';
        galleryFullscreenVideo.style.display = 'none';
        galleryFullscreenVideo.pause();
      } else if(video) {
        // Show video - use MP4 for fullscreen (better quality)
        // Convert .webm back to .mp4 for fullscreen viewing
        let videoSrc = video.src || video.currentSrc || '';
        
        // Check if it's a webm file and convert to mp4
        if(videoSrc.endsWith('.webm')) {
          videoSrc = videoSrc.replace('.webm', '.mp4');
        } else {
          // If it has source elements, get the mp4 source
          const mp4Source = video.querySelector('source[type="video/mp4"]');
          if(mp4Source) {
            videoSrc = mp4Source.src;
          }
        }
        
        galleryFullscreenVideo.src = videoSrc;
        galleryFullscreenVideo.style.display = 'block';
        galleryFullscreenImg.style.display = 'none';
        galleryFullscreenVideo.play();
      }
      
      galleryFullscreen.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close gallery fullscreen
  function closeGalleryFullscreen() {
    galleryFullscreen.setAttribute('aria-hidden', 'true');
    galleryFullscreenImg.src = '';
    galleryFullscreenVideo.src = '';
    galleryFullscreenVideo.pause();
    document.body.style.overflow = '';
  }

  if(galleryFullscreenClose) {
    galleryFullscreenClose.addEventListener('click', closeGalleryFullscreen);
  }

  if(galleryFullscreen) {
    galleryFullscreen.addEventListener('click', (e) => {
      if(e.target === galleryFullscreen) {
        closeGalleryFullscreen();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && galleryFullscreen.getAttribute('aria-hidden') === 'false') {
      closeGalleryFullscreen();
    }
  });

  // Auto-play videos in wandering gallery
  const wanderingVideos = document.querySelectorAll('.wandering-item video');
  wanderingVideos.forEach(video => {
    video.play();
  });

  // Family Video Fullscreen Functionality
  const familyVideoItems = document.querySelectorAll('.video-family-item');
  
  familyVideoItems.forEach(item => {
    item.addEventListener('click', () => {
      const video = item.querySelector('video');
      
      if(video) {
        // Get MP4 source for fullscreen quality
        let videoSrc = video.src || video.currentSrc || '';
        
        // Convert .webm to .mp4 for fullscreen
        if(videoSrc.endsWith('.webm')) {
          videoSrc = videoSrc.replace('.webm', '.mp4');
        } else {
          const mp4Source = video.querySelector('source[type="video/mp4"]');
          if(mp4Source) {
            videoSrc = mp4Source.src;
          }
        }
        
        // Use the same fullscreen modal as gallery
        galleryFullscreenVideo.src = videoSrc;
        galleryFullscreenVideo.style.display = 'block';
        galleryFullscreenImg.style.display = 'none';
        galleryFullscreenVideo.play();
        
        galleryFullscreen.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Auto-play family videos
  const familyVideos = document.querySelectorAll('.video-family-item video');
  familyVideos.forEach(video => {
    video.play();
  });
});

