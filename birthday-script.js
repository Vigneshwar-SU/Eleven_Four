// Birthday Page - Media Fullscreen Viewer
(function() {
  'use strict';

  // Get fullscreen elements
  const galleryFullscreen = document.getElementById('gallery-fullscreen');
  const galleryFullscreenImg = document.getElementById('gallery-fullscreen-img');
  const galleryFullscreenVideo = document.getElementById('gallery-fullscreen-video');
  const closeBtn = document.querySelector('.gallery-fullscreen-close');

  // Get all media items
  const allMediaItems = document.querySelectorAll('.media-item');

  // Function to open fullscreen with image
  function openFullscreenImage(imgElement) {
    if (!galleryFullscreen || !galleryFullscreenImg) return;

    galleryFullscreenImg.src = imgElement.src;
    galleryFullscreenImg.alt = imgElement.alt || 'Fullscreen Image';
    galleryFullscreenImg.style.display = 'block';
    galleryFullscreenVideo.style.display = 'none';
    
    // Pause video if it's playing
    if (galleryFullscreenVideo.pause) {
      galleryFullscreenVideo.pause();
    }

    galleryFullscreen.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Function to open fullscreen with video
  function openFullscreenVideo(videoElement) {
    if (!galleryFullscreen || !galleryFullscreenVideo) return;

    // Handle .webm files - convert to .mp4 for better compatibility
    let videoSrc = videoElement.src;
    if (videoSrc.endsWith('.webm')) {
      videoSrc = videoSrc.replace('.webm', '.mp4');
    }

    galleryFullscreenVideo.src = videoSrc;
    galleryFullscreenVideo.style.display = 'block';
    galleryFullscreenImg.style.display = 'none';
    
    galleryFullscreen.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Auto-play the video
    galleryFullscreenVideo.play().catch(err => {
      console.log('Video autoplay prevented:', err);
    });
  }

  // Function to close fullscreen
  function closeFullscreen() {
    if (!galleryFullscreen) return;

    galleryFullscreen.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Pause video when closing
    if (galleryFullscreenVideo.pause) {
      galleryFullscreenVideo.pause();
    }

    // Clear sources after animation
    setTimeout(() => {
      galleryFullscreenImg.src = '';
      galleryFullscreenVideo.src = '';
    }, 300);
  }

  // Add click listeners to all media items
  allMediaItems.forEach(mediaItem => {
    mediaItem.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (this.tagName === 'IMG') {
        openFullscreenImage(this);
      } else if (this.tagName === 'VIDEO') {
        openFullscreenVideo(this);
      }
    });

    // Add keyboard accessibility
    mediaItem.setAttribute('tabindex', '0');
    mediaItem.setAttribute('role', 'button');
    mediaItem.setAttribute('aria-label', 'Click to view fullscreen');

    mediaItem.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Close button click
  if (closeBtn) {
    closeBtn.addEventListener('click', closeFullscreen);
  }

  // Close on background click
  if (galleryFullscreen) {
    galleryFullscreen.addEventListener('click', function(e) {
      if (e.target === this) {
        closeFullscreen();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && galleryFullscreen.getAttribute('aria-hidden') === 'false') {
      closeFullscreen();
    }
  });

  // Prevent body scroll when fullscreen is open
  if (galleryFullscreen) {
    galleryFullscreen.addEventListener('wheel', function(e) {
      e.preventDefault();
    }, { passive: false });
  }

})();
