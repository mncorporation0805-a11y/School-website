document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. CINEMATIC OPENING EXPERIENCE CONTROLLER
     ========================================== */
  const expOverlay = document.getElementById('opening-experience');
  const appContent = document.getElementById('app-content');
  const logoWrapper = document.querySelector('.logo-wrapper');
  const creditToast = document.getElementById('mn-credit');
  const scrollLocks = new Set();
  let audioCtx = null;
  let synthPlayed = false;

  // Several independent overlays can be open at the same time. Keep their
  // scroll locks isolated so closing one never re-enables page scrolling for
  // another that is still open.
  function setPageScrollLocked(source, isLocked) {
    if (isLocked) {
      scrollLocks.add(source);
    } else {
      scrollLocks.delete(source);
    }
    document.body.style.overflow = scrollLocks.size ? 'hidden' : '';
  }

  // Synthesize Cinematic Sound (Deep Bass rumble + high frequency chime)
  function playCinematicSound() {
    // Cinematic sound synthesis disabled
  }

  // Generate circular sine wave path helper
  function generateCircularWavePath(cx, cy, r, amplitude, frequency, phase = 0) {
    let points = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      const currentRadius = r + Math.sin(theta * frequency + phase) * amplitude;
      const x = cx + currentRadius * Math.cos(theta);
      const y = cy + currentRadius * Math.sin(theta);
      if (i === 0) {
        points.push(`M ${x.toFixed(2)},${y.toFixed(2)}`);
      } else {
        points.push(`L ${x.toFixed(2)},${y.toFixed(2)}`);
      }
    }
    return points.join(' ') + ' Z';
  }

  // Setup the timeline sequence
  if (expOverlay && appContent && logoWrapper) {
    setPageScrollLocked('opening-experience', true);

    const openLogo = document.querySelector('.official-logo-img');
    const waveRingGrp = document.getElementById('wave-ring-group');

    if (waveRingGrp) {
      const path1 = generateCircularWavePath(100, 100, 82, 2.2, 10, 0);
      const path2 = generateCircularWavePath(100, 100, 85, 1.5, 8, Math.PI / 4);
      const path3 = generateCircularWavePath(100, 100, 79, 1.8, 12, Math.PI / 3);

      waveRingGrp.innerHTML = `
        <path class="wave-path" d="${path1}" />
        <path class="wave-path" d="${path2}" />
        <path class="wave-path" d="${path3}" />
      `;
    }

    // Click/Touch fallback to unlock blocked audio policies on gesture
    const triggerAudioOnInteraction = () => {
      try {
        if (!synthPlayed) {
          playCinematicSound();
        }
      } catch (err) {
        console.warn("Audio Context resumption deferred:", err);
      }
      document.removeEventListener('click', triggerAudioOnInteraction);
      document.removeEventListener('touchstart', triggerAudioOnInteraction);
    };
    document.addEventListener('click', triggerAudioOnInteraction);
    document.addEventListener('touchstart', triggerAudioOnInteraction);

    // 0.5s: Schoollogo fades in
    setTimeout(() => {
      if (openLogo) openLogo.style.opacity = '1';
    }, 500);

    // 1.0s: Circular wave ring gradually appears
    setTimeout(() => {
      if (waveRingGrp) waveRingGrp.style.opacity = '1';
    }, 1000);

    // 1.2s: Wave ring begins one slow clockwise rotation
    setTimeout(() => {
      if (waveRingGrp) waveRingGrp.classList.add('rotating');
    }, 1200);

    // 4.2s: Wave ring expands, ripples travel, and homepage is revealed
    setTimeout(() => {
      expOverlay.classList.add('transitioning');
      appContent.classList.add('revealed');
      
      if (waveRingGrp) {
        waveRingGrp.style.transform = 'scale(18)';
        waveRingGrp.style.opacity = '0';
        waveRingGrp.style.transition = 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 1.5s ease-out';
      }
      
      if (openLogo) {
        openLogo.style.opacity = '0';
        openLogo.style.transform = 'scale(0.95)';
        openLogo.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      }
    }, 4200);

    // 5.8s: Fade out overlay
    setTimeout(() => {
      expOverlay.style.opacity = '0';
      expOverlay.style.transition = 'opacity 1.2s ease-in-out';
    }, 5800);

    // 7.0s: Clean up display and show credit toast
    setTimeout(() => {
      expOverlay.style.display = 'none';
      setPageScrollLocked('opening-experience', false);
      
      // Trigger credit toast bottom center
      if (creditToast) {
        creditToast.classList.add('visible');
        setTimeout(() => {
          creditToast.classList.remove('visible');
        }, 2200);
      }
    }, 7000);
  }

  /* ==========================================
     2. THEME & ACCESSIBILITY MANAGEMENT
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('svg') : null;

  // Initialize Theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else {
      themeIcon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  }

  // Accessibility Panel Toggle inside Mobile Menu
  const accessibilityToggle = document.getElementById('accessibility-toggle');
  const accessibilityPanel = document.querySelector('.mobile-accessibility-panel');
  const accFontInc = document.getElementById('acc-font-increase');
  const accFontDec = document.getElementById('acc-font-decrease');
  const accDyslexic = document.getElementById('acc-dyslexic');

  if (accessibilityToggle && accessibilityPanel) {
    accessibilityToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      accessibilityPanel.classList.toggle('active');
    });
  }

  // Font Scaling Logic
  let currentScale = parseFloat(localStorage.getItem('fontScale')) || 1.0;
  document.documentElement.style.setProperty('--font-scale', currentScale);

  if (accFontInc) {
    accFontInc.addEventListener('click', () => {
      if (currentScale < 1.3) {
        currentScale += 0.1;
        updateFontScale(currentScale);
      }
    });
  }
  if (accFontDec) {
    accFontDec.addEventListener('click', () => {
      if (currentScale > 0.8) {
        currentScale -= 0.1;
        updateFontScale(currentScale);
      }
    });
  }

  function updateFontScale(scale) {
    document.documentElement.style.setProperty('--font-scale', scale);
    localStorage.setItem('fontScale', scale);
  }

  // Dyslexic Mode logic
  let dyslexicMode = localStorage.getItem('dyslexicMode') === 'true';
  if (dyslexicMode) {
    document.documentElement.setAttribute('data-accessibility', 'dyslexic');
    if (accDyslexic) accDyslexic.classList.add('active');
  }

  if (accDyslexic) {
    accDyslexic.addEventListener('click', () => {
      dyslexicMode = !dyslexicMode;
      if (dyslexicMode) {
        document.documentElement.setAttribute('data-accessibility', 'dyslexic');
        accDyslexic.classList.add('active');
      } else {
        document.documentElement.removeAttribute('data-accessibility');
        accDyslexic.classList.remove('active');
      }
      localStorage.setItem('dyslexicMode', dyslexicMode);
    });
  }

  /* ==========================================
     3. FLOATING GLASS NAVBAR & MOBILE MENU
     ========================================== */
  const siteHeader = document.getElementById('site-header');
  const menuTriggers = document.querySelectorAll('.hamburger-menu-trigger');
  const menuClose = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  let lastScrollY = window.scrollY;
  let isHeaderTicking = false;
  let isScrollSpyTicking = false;

  window.addEventListener('scroll', () => {
    if (!isHeaderTicking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Header scrolled background toggle instantly upon scroll to prevent transparent text overlap
        if (currentScrollY > 10) {
          if (siteHeader && !siteHeader.classList.contains('scrolled')) {
            siteHeader.classList.add('scrolled');
          }
        } else {
          if (siteHeader && siteHeader.classList.contains('scrolled')) {
            siteHeader.classList.remove('scrolled');
          }
        }

        // Smart Hide/Show Behavior (Scroll Down -> Hide, Scroll Up with 10px delta threshold -> Show)
        if (currentScrollY > 180 && currentScrollY > lastScrollY) {
          if (siteHeader && !siteHeader.classList.contains('header-hidden')) {
            siteHeader.classList.add('header-hidden');
          }
        } else if (currentScrollY <= 180 || currentScrollY < lastScrollY - 10) {
          if (siteHeader && siteHeader.classList.contains('header-hidden')) {
            siteHeader.classList.remove('header-hidden');
          }
        }

        lastScrollY = currentScrollY;
        isHeaderTicking = false;
      });
      isHeaderTicking = true;
    }
  }, { passive: true });

  menuTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileMenu) {
        mobileMenu.classList.add('active');
        setPageScrollLocked('mobile-menu', true);
      }
    });
  });

  if (menuClose) {
    menuClose.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
        setPageScrollLocked('mobile-menu', false);
      }
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
        setPageScrollLocked('mobile-menu', false);
      }
    });
  });

  // Scroll Spy Active Link Indicator (for the scrolled menu header)
  const sections = document.querySelectorAll('section[id]');
  const headerLinks = document.querySelectorAll('.header-link');

  function updateActiveLinkOnScroll() {
    let activeSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 85; // Offset header Y height
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        activeSectionId = section.getAttribute('id');
      }
    });

    headerLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${activeSectionId}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    if (!isScrollSpyTicking) {
      window.requestAnimationFrame(() => {
        updateActiveLinkOnScroll();
        isScrollSpyTicking = false;
      });
      isScrollSpyTicking = true;
    }
  }, { passive: true });
  updateActiveLinkOnScroll();

  /* ==========================================
     4. MOUSE FOLLOW AMBIENT GLOW
     ========================================== */
  const mouseGlow = document.getElementById('mouse-glow');
  if (mouseGlow) {
    let mouseGlowTicking = false;
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (mouseGlowTicking) return;
      mouseGlowTicking = true;
      window.requestAnimationFrame(() => {
        mouseGlow.style.left = `${mouseX}px`;
        mouseGlow.style.top = `${mouseY}px`;
        mouseGlowTicking = false;
      });
    });
  }

  /* ==========================================
     5. SCROLL REVEAL (IntersectionObserver)
     ========================================== */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });

  /* ==========================================
     6. ABOUT SECTION TAB SWITCHER
     ========================================== */
  const aboutTabs = document.querySelectorAll('.about-tab-btn');
  const aboutPanes = document.querySelectorAll('.about-tab-pane');

  aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');

      aboutTabs.forEach(btn => btn.classList.remove('active'));
      aboutPanes.forEach(pane => pane.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ==========================================
     7. ACADEMICS SECTION TIMELINE TABS
     ========================================== */
  const academicNavBtns = document.querySelectorAll('.academics-nav-btn');
  const academicPanes = document.querySelectorAll('.academics-pane');

  academicNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPaneId = btn.getAttribute('data-pane');

      academicNavBtns.forEach(nav => nav.classList.remove('active'));
      academicPanes.forEach(pane => pane.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  /* ==========================================
     8. PINTEREST MASONRY & GALLERY LIGHTBOX
     ========================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

  // Gallery Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Toggle display of items
      masonryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCat === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal Triggers
  masonryItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      const img = item.querySelector('img');
      const title = item.querySelector('.masonry-title')?.textContent || '';
      
      if (img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = title;
        lightbox.classList.add('active');
        setPageScrollLocked('lightbox', true);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      setPageScrollLocked('lightbox', false);
    }
  }

  /* ==========================================
     9. ACTIVITIES HORIZONTAL Snap SLIDER
     ========================================== */
  const slider = document.querySelector('.activities-slider');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (slider && prevBtn && nextBtn) {
    const scrollAmount = 380; // card width (350) + gap (30)

    nextBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    prevBtn.addEventListener('click', () => {
      slider.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================
     10. ACHIEVEMENTS MILESTONE ANIMATED COUNTERS
     ========================================== */
  const counters = document.querySelectorAll('.counter-num');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-target-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          counter.textContent = `${Math.floor(target * progress)}${suffix}`;
          if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = `${target}${suffix}`;
          }
        }

        window.requestAnimationFrame(updateCounter);

        counterObserver.unobserve(counter);
      }
    });
  }, {
    threshold: 0.8
  });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  /* ==========================================
     11. TESTIMONIALS SLIDER CAROUSEL
     ========================================== */
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const indicators = document.querySelectorAll('.indicator-dot');
  let currentIndex = 0;
  let autoSlideTimer;

  function updateTestimonials(index) {
    if (!track || slides.length === 0) return;
    
    // Bounds check
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentIndex = index;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Indicators highlight
    indicators.forEach((ind, i) => {
      if (i === currentIndex) {
        ind.classList.add('active');
      } else {
        ind.classList.remove('active');
      }
    });
  }

  function startAutoSlide() {
    if (autoSlideTimer) return;
    autoSlideTimer = setInterval(() => {
      updateTestimonials(currentIndex + 1);
    }, 6000); // Slide every 6 seconds
  }

  function stopAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }

  if (track && slides.length > 0) {
    startAutoSlide();

    // Hover pauses slider
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Indicator dots click
    indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        updateTestimonials(index);
        startAutoSlide();
      });
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoSlide();
      else startAutoSlide();
    });
  }

  /* ==========================================
     12. ADMISSIONS STEP-BY-STEP PROGRESS STEPPER
     ========================================== */
  const steps = document.querySelectorAll('.step-node');
  const stepPanes = document.querySelectorAll('.step-pane');

  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      const paneId = step.getAttribute('data-step');

      // Update stepper styling states
      steps.forEach((s, idx) => {
        s.classList.remove('active');
        if (idx < index) {
          s.classList.add('completed');
        } else {
          s.classList.remove('completed');
        }
      });
      step.classList.add('active');

      // Update detail panel pane display
      stepPanes.forEach(pane => pane.classList.remove('active'));
      const targetPane = document.getElementById(paneId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Simulated PDF brochure download animation
  const brochureBtn = document.getElementById('brochure-download-btn');
  if (brochureBtn) {
    brochureBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (brochureBtn.classList.contains('loading')) return;

      brochureBtn.classList.add('loading');
      const textSpan = brochureBtn.querySelector('.brochure-btn-text');
      const initialText = textSpan.textContent;
      textSpan.textContent = 'Generating PDF Package...';

      // The bar width is animated via CSS transition, we just wait for it.
      setTimeout(() => {
        textSpan.textContent = 'Download Complete!';
        // Simulating trigger download
        const dummyLink = document.createElement('a');
        dummyLink.href = '#';
        dummyLink.innerHTML = 'brochure';
        
        alert('Welcome Package Brochure PDF has been generated and downloaded to your computer!');
        
        // Reset state
        setTimeout(() => {
          brochureBtn.classList.remove('loading');
          textSpan.textContent = initialText;
        }, 2000);
      }, 2500);
    });
  }

  /* ==========================================
     13. MINI SCHOOL CALENDAR EVENT TRIGGERS
     ========================================== */
  const calDays = document.querySelectorAll('.cal-day.event');
  const calEventDesc = document.getElementById('cal-event-desc');
  const calEventTime = document.getElementById('cal-event-time');

  calDays.forEach(day => {
    day.addEventListener('click', () => {
      // Toggle selected day highlighting
      document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
      day.classList.add('active');

      // Pull metadata fields
      const eventTitle = day.getAttribute('data-event-title');
      const eventTime = day.getAttribute('data-event-time');

      if (calEventDesc) calEventDesc.textContent = eventTitle;
      if (calEventTime) calEventTime.textContent = eventTime;
    });
  });

  /* ==========================================
     14. VIDEO TOUR MODAL PLAYER
     ========================================== */
  const videoPlayFrame = document.getElementById('video-play-frame');
  const videoModal = document.getElementById('video-modal');
  const videoModalClose = document.getElementById('video-modal-close');
  const videoIframe = document.getElementById('video-iframe');

  if (videoPlayFrame && videoModal && videoIframe && videoModalClose) {
    videoPlayFrame.addEventListener('click', () => {
      // Simulating a high-end educational cinematic trailer using an embeddable Vimeo/YouTube link.
      // We use a high quality educational architectural showcase.
      videoIframe.src = "https://www.youtube.com/embed/T6eUfH_k9b4?autoplay=1&mute=1"; // Aesthetic Harvard campus drone footage
      videoModal.classList.add('active');
      setPageScrollLocked('video-modal', true);
    });

    videoModalClose.addEventListener('click', () => {
      videoModal.classList.remove('active');
      videoIframe.src = ""; // Stops playback
      setPageScrollLocked('video-modal', false);
    });

    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        videoModal.classList.remove('active');
        videoIframe.src = "";
        setPageScrollLocked('video-modal', false);
      }
    });
  }

  /* ==========================================
     15. FAQ ACCORDION TRANSITION HANDLERS
     ========================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordion = header.closest('.faq-accordion');
      const isActive = accordion.classList.contains('active');

      // Collapse all accordions first
      document.querySelectorAll('.faq-accordion').forEach(acc => {
        acc.classList.remove('active');
        acc.querySelector('.faq-body').style.maxHeight = null;
      });

      // Toggle this accordion
      if (!isActive) {
        accordion.classList.add('active');
        const body = accordion.querySelector('.faq-body');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================
     16. INTERACTIVE SVG MAP TOOLTIPS
     ========================================== */
  const mapPins = document.querySelectorAll('.map-pin');
  const mapTooltip = document.getElementById('map-tooltip');

  mapPins.forEach(pin => {
    pin.addEventListener('mouseenter', () => {
      if (!mapTooltip) return;
      const buildingName = pin.getAttribute('data-building');
      const details = pin.getAttribute('data-details');
      
      mapTooltip.innerHTML = `<span>📍</span> <strong>${buildingName}</strong>: ${details}`;
      mapTooltip.style.opacity = '1';
    });

    pin.addEventListener('mouseleave', () => {
      if (mapTooltip) mapTooltip.style.opacity = '0';
    });
  });

  /* ==========================================
     17. INQUIRY FORM FLOATING LOGIC & SUBMIT
     ========================================== */
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inq-name').value;
      const email = document.getElementById('inq-email').value;

      if (name && email) {
        alert(`Thank you, ${name}! Your inquiry has been registered. An admissions officer will contact you within 24 hours.`);
        inquiryForm.reset();
        // Reset label positions
        document.querySelectorAll('.form-input').forEach(input => {
          input.value = '';
        });
      }
    });
  }

  // Newsletter Submit Animation
  const newsForm = document.querySelector('.footer-news-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsForm.querySelector('.footer-news-input').value;
      if (email) {
        alert(`Welcome to our newsletter! Weekly updates will be sent to: ${email}`);
        newsForm.reset();
      }
    });
  }

  /* ==========================================
     18. FLOATING BACK TO TOP BUTTON
     ========================================== */
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  /* ==========================================
     19. CENTER-MODE CAROUSEL CONTROLLER (Section 2)
     ========================================== */
  const centerTrack = document.querySelector('.center-carousel-track');
  const centerCards = document.querySelectorAll('.center-card');
  const centerPrevBtn = document.querySelector('.center-prev');
  const centerNextBtn = document.querySelector('.center-next');
  const centerViewport = document.querySelector('.center-carousel-viewport');

  if (centerTrack && centerCards.length > 0) {
    let activeIndex = 0; // Default active center card index
    let autoSlideTimer = null;
    let isDragging = false;
    let startX = 0;

    function updateCenterCarousel() {
      const card = centerCards[activeIndex];
      const viewportWidth = centerViewport.offsetWidth;
      const cardWidth = card.offsetWidth;
      const cardLeft = card.offsetLeft;

      // Position track so active card is centered in the 95vw viewport
      const offset = (viewportWidth / 2) - (cardLeft + cardWidth / 2);
      centerTrack.style.transform = `translateX(${offset}px)`;

      centerCards.forEach((c, idx) => {
        if (idx === activeIndex) {
          c.classList.add('is-active');
        } else {
          c.classList.remove('is-active');
        }
      });
    }

    function nextCenterSlide() {
      activeIndex = (activeIndex + 1) % centerCards.length;
      updateCenterCarousel();
    }

    function prevCenterSlide() {
      activeIndex = (activeIndex - 1 + centerCards.length) % centerCards.length;
      updateCenterCarousel();
    }

    if (centerNextBtn) centerNextBtn.addEventListener('click', nextCenterSlide);
    if (centerPrevBtn) centerPrevBtn.addEventListener('click', prevCenterSlide);

    // Clicking side card activates it directly
    centerCards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        if (idx !== activeIndex) {
          activeIndex = idx;
          updateCenterCarousel();
        }
      });
    });

    // Keyboard navigation (Left / Right arrow keys)
    document.addEventListener('keydown', (e) => {
      const sectionElem = document.getElementById('about');
      if (!sectionElem) return;
      const rect = sectionElem.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowRight') nextCenterSlide();
        if (e.key === 'ArrowLeft') prevCenterSlide();
      }
    });

    // Drag / Touch Swipe Support
    centerViewport.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      stopAutoPlay();
    }, { passive: true });

    centerViewport.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 40) nextCenterSlide();
      else if (diff < -40) prevCenterSlide();
      startAutoPlay();
    }, { passive: true });

    // Autoplay every 5.5 seconds, pause on hover
    function startAutoPlay() {
      if (!autoSlideTimer) {
        autoSlideTimer = setInterval(nextCenterSlide, 5500);
      }
    }

    function stopAutoPlay() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    if (centerViewport.parentElement) {
      centerViewport.parentElement.addEventListener('mouseenter', stopAutoPlay);
      centerViewport.parentElement.addEventListener('mouseleave', startAutoPlay);
    }

    // Initial positioning
    setTimeout(() => {
      updateCenterCarousel();
      startAutoPlay();
    }, 150);

    window.addEventListener('resize', updateCenterCarousel);
  }

  /* ==========================================
     20. FLOATING CHAT ASSISTANT CONTROLLER
     ========================================== */
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatActionBtns = document.querySelectorAll('.chat-action-btn');

  if (chatToggleBtn && chatWindow) {
    chatToggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });
  }

  if (chatCloseBtn && chatWindow) {
    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  if (chatActionBtns) {
    chatActionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        let targetId = '';
        if (action === 'admissions' || action === 'fees' || action === 'visit') targetId = '#admissions';
        else if (action === 'transport') targetId = '#infrastructure';
        else if (action === 'meals') targetId = '#cafeteria';
        else if (action === 'contact') targetId = '#contact';

        if (targetId) {
          const targetElem = document.querySelector(targetId);
          if (targetElem) {
            targetElem.scrollIntoView({ behavior: 'smooth' });
            chatWindow.classList.remove('active');
          }
        } else if (action === 'search') {
          alert('Search tool activated.');
          chatWindow.classList.remove('active');
        }
      });
    });
  }

  /* ==========================================
     21. TRANSITION SECTION CINEMATIC ANIMATION
     ========================================== */
  const transitionTextElems = document.querySelectorAll('.transition-animate-words');
  transitionTextElems.forEach((elem) => {
    if (elem.classList.contains('words-processed')) return;
    elem.classList.add('words-processed');

    const text = elem.innerText.trim();
    if (!text) return;

    const delayStep = 0.10; // 100ms delay between words

    const words = text.split(/\s+/);
    elem.innerHTML = '';

    words.forEach((word, index) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'transition-word-wrap';

      const wordNode = document.createElement('span');
      wordNode.className = 'transition-word-node';
      wordNode.textContent = word;
      wordNode.style.transitionDelay = `${index * delayStep}s`;

      wordWrap.appendChild(wordNode);
      elem.appendChild(wordWrap);
      elem.appendChild(document.createTextNode(' '));
    });
  });

  /* ==========================================
     22. WORD-BY-WORD STAGGERED SCROLL ANIMATIONS
     ========================================== */
  const leafTextElems = document.querySelectorAll('.section-tag, .section-title, .story-headline, .story-eyebrow, h2.animate-words');
  
  leafTextElems.forEach((elem) => {
    if (elem.classList.contains('words-processed')) return;
    elem.classList.add('words-processed');

    const text = elem.innerText.trim();
    if (!text) return;

    const isHeading = elem.tagName.startsWith('H') || elem.classList.contains('section-title') || elem.classList.contains('story-headline');
    const delayStep = isHeading ? 0.07 : 0.05; // 70ms cinematic stagger for headings, 50ms for body text

    const words = text.split(/\s+/);
    elem.innerHTML = '';

    words.forEach((word, index) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'word-wrap';

      const wordNode = document.createElement('span');
      wordNode.className = 'word-node';
      wordNode.textContent = word;
      wordNode.style.transitionDelay = `${index * delayStep}s`;

      wordWrap.appendChild(wordNode);
      elem.appendChild(wordWrap);
      elem.appendChild(document.createTextNode(' '));
    });
  });

  // IntersectionObserver for 60 FPS viewport triggers
  const observerOptions = {
    root: null,
    rootMargin: '100px 0px 100px 0px',
    threshold: 0.01
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, observerOptions);

  /* ==========================================
     REGISTER INTERSECTION OBSERVER TARGETS
     ========================================== */
  const transWords = document.querySelectorAll('.section-typography-transition .trans-word');
  transWords.forEach((word, index) => {
    word.style.transitionDelay = `${index * 0.15}s`;
  });

  document.querySelectorAll('.section-typography-transition, .section-typography-transition .trans-word, .animate-words, .typography-transition-container, .trans-line, .section-header, .story-content, .highlight-reveal, .highlight-card-anim, .stat-card-anim, .inspiring-left, .inspiring-header-box, .inspiring-video-frame, .animate-img, .reveal').forEach(target => {
    scrollObserver.observe(target);
  });

  // Safety fallback: Force reveal all animation elements if they haven't loaded yet after 1 second
  setTimeout(() => {
    document.querySelectorAll('.section-typography-transition, .section-typography-transition .trans-word, .animate-words, .typography-transition-container, .trans-line, .section-header, .story-content, .highlight-reveal, .highlight-card-anim, .stat-card-anim, .inspiring-left, .inspiring-header-box, .inspiring-video-frame, .animate-img, .reveal').forEach(target => {
      target.classList.add('in-view');
    });
  }, 1000);

  /* ==========================================
     NUMBER COUNTER ANIMATION FOR STATS DIFFERENCE (INTERSECTION OBSERVER DRIVEN)
     ========================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsSection = document.getElementById('stats-difference');

  if (statsSection && statNumbers.length > 0) {
    let counted = false;

    function runStatsCounter() {
      if (counted) return;
      counted = true;

      statNumbers.forEach(elem => {
        const target = parseInt(elem.getAttribute('data-target'), 10) || 0;
        const suffix = elem.getAttribute('data-suffix') || '';
        const duration = 2000; // 2 seconds
        const startTimestamp = performance.now();

        function step(now) {
          const progress = Math.min((now - startTimestamp) / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeProgress * target);
          elem.textContent = `${currentVal}${suffix}`;

          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            elem.textContent = `${target}${suffix}`;
          }
        }

        window.requestAnimationFrame(step);
      });
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCounter();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================
     STATS DIFFERENCE CAROUSEL CONTROLLER
     ========================================== */
  const statsTrack = document.querySelector('.stats-track');
  const statCards = document.querySelectorAll('#stats-difference .stat-card');
  const statsPrevBtn = document.querySelector('.stats-prev');
  const statsNextBtn = document.querySelector('.stats-next');
  const statsViewport = document.querySelector('.stats-viewport');

  if (statsTrack && statCards.length > 0) {
    let statsIndex = 0;

    function getStatsPerPage() {
      if (window.innerWidth <= 550) return 1;
      if (window.innerWidth <= 768) return 2;
      if (window.innerWidth <= 1100) return 3;
      return 4; // Exactly 4 cards visible at a time on desktop!
    }

    function updateStatsCarousel() {
      const perPage = getStatsPerPage();
      const maxIndex = Math.max(0, statCards.length - perPage);
      statsIndex = Math.min(statsIndex, maxIndex);
      const cardWidth = statCards[0].offsetWidth;
      const offset = -(statsIndex * cardWidth);
      statsTrack.style.transform = `translateX(${offset}px)`;
    }

    function nextStat() {
      const perPage = getStatsPerPage();
      const maxIndex = Math.max(0, statCards.length - perPage);
      if (statsIndex < maxIndex) {
        statsIndex++;
      } else {
        statsIndex = 0; // Infinite loop back to start
      }
      updateStatsCarousel();
    }

    function prevStat() {
      const perPage = getStatsPerPage();
      const maxIndex = Math.max(0, statCards.length - perPage);
      if (statsIndex > 0) {
        statsIndex--;
      } else {
        statsIndex = maxIndex; // Infinite loop to end
      }
      updateStatsCarousel();
    }

    if (statsNextBtn) statsNextBtn.addEventListener('click', nextStat);
    if (statsPrevBtn) statsPrevBtn.addEventListener('click', prevStat);

    // Touch Swipe Support
    let isStatsDragging = false;
    let statsStartX = 0;

    if (statsViewport) {
      statsViewport.addEventListener('touchstart', (e) => {
        isStatsDragging = true;
        statsStartX = e.touches[0].clientX;
      }, { passive: true });

      statsViewport.addEventListener('touchend', (e) => {
        if (!isStatsDragging) return;
        isStatsDragging = false;
        const diff = statsStartX - e.changedTouches[0].clientX;
        if (diff > 40) nextStat();
        else if (diff < -40) prevStat();
      }, { passive: true });
    }

    window.addEventListener('resize', updateStatsCarousel, { passive: true });
    updateStatsCarousel();
  }

  /* ==========================================
     INSPIRING VIDEO PLAY/PAUSE TOGGLE CONTROLLER
     ========================================== */
  const inspiringVideo = document.getElementById('inspiring-school-video');
  const inspiringToggleBtn = document.getElementById('inspiring-video-toggle');

  if (inspiringVideo && inspiringToggleBtn) {
    const pauseIcon = inspiringToggleBtn.querySelector('.icon-pause');
    const playIcon = inspiringToggleBtn.querySelector('.icon-play');

    function syncVideoToggle() {
      const isPaused = inspiringVideo.paused;
      pauseIcon.classList.toggle('hidden', isPaused);
      playIcon.classList.toggle('hidden', !isPaused);
      inspiringToggleBtn.setAttribute('aria-label', isPaused ? 'Play video' : 'Pause video');
    }

    inspiringVideo.addEventListener('play', syncVideoToggle);
    inspiringVideo.addEventListener('pause', syncVideoToggle);
    syncVideoToggle();

    inspiringToggleBtn.addEventListener('click', () => {
      if (inspiringVideo.paused) {
        inspiringVideo.play().catch(syncVideoToggle);
      } else {
        inspiringVideo.pause();
      }
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      window.dispatchEvent(new Event('resize'));
    });
  }

  /* ==========================================
     23. SCROLL-LINKED PARALLAX MOTION FOR SECTION 3 IMAGES
     ========================================== */
  const storySection = document.getElementById('story');
  if (storySection) {
    const leftCutout = storySection.querySelector('.cutout-left');
    const rightCutout = storySection.querySelector('.cutout-right');
    let ticking = false;

    function onScrollParallax() {
      const rect = storySection.getBoundingClientRect();
      const winHeight = window.innerHeight;

      if (rect.top < winHeight && rect.bottom > 0) {
        const progress = (winHeight - rect.top) / (winHeight + rect.height);
        const parallaxY = (progress - 0.5) * 30; // 30px smooth motion range strictly within Section 3 bounds

        if (leftCutout) {
          leftCutout.style.transform = `translate3d(0, ${-parallaxY}px, 0)`;
        }
        if (rightCutout) {
          rightCutout.style.transform = `translate3d(0, ${parallaxY * 0.85}px, 0)`;
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScrollParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================
     24. RECENT HIGHLIGHTS CAROUSEL CONTROLLER
     ========================================== */
  const highlightsTrack = document.querySelector('.highlights-track');
  const highlightCards = document.querySelectorAll('.highlight-card');
  const highlightsPrevBtn = document.querySelector('.highlights-prev');
  const highlightsNextBtn = document.querySelector('.highlights-next');
  const highlightsViewport = document.querySelector('.highlights-viewport');

  if (highlightsTrack && highlightCards.length > 0) {
    let highlightIndex = 0;

    function getItemsPerPage() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    function updateHighlightsCarousel() {
      const cardWidth = highlightCards[0].offsetWidth;
      const perPage = getItemsPerPage();
      const maxIndex = Math.max(0, highlightCards.length - perPage);
      highlightIndex = Math.min(highlightIndex, maxIndex);
      const gap = parseFloat(window.getComputedStyle(highlightsTrack).gap) || 0;
      const offset = -(highlightIndex * (cardWidth + gap));
      highlightsTrack.style.transform = `translateX(${offset}px)`;
    }

    function nextHighlight() {
      const perPage = getItemsPerPage();
      const maxIndex = highlightCards.length - perPage;
      if (highlightIndex < maxIndex) {
        highlightIndex++;
      } else {
        highlightIndex = 0; // Loop back
      }
      updateHighlightsCarousel();
    }

    function prevHighlight() {
      const perPage = getItemsPerPage();
      const maxIndex = highlightCards.length - perPage;
      if (highlightIndex > 0) {
        highlightIndex--;
      } else {
        highlightIndex = maxIndex;
      }
      updateHighlightsCarousel();
    }

    if (highlightsNextBtn) highlightsNextBtn.addEventListener('click', nextHighlight);
    if (highlightsPrevBtn) highlightsPrevBtn.addEventListener('click', prevHighlight);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const hlElem = document.getElementById('highlights');
      if (!hlElem) return;
      const rect = hlElem.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (e.key === 'ArrowRight') nextHighlight();
        if (e.key === 'ArrowLeft') prevHighlight();
      }
    });

    // Touch Swipe Support
    let isHLDragging = false;
    let hlStartX = 0;

    if (highlightsViewport) {
      highlightsViewport.addEventListener('touchstart', (e) => {
        isHLDragging = true;
        hlStartX = e.touches[0].clientX;
      }, { passive: true });

      highlightsViewport.addEventListener('touchend', (e) => {
        if (!isHLDragging) return;
        isHLDragging = false;
        const diff = hlStartX - e.changedTouches[0].clientX;
        if (diff > 40) nextHighlight();
        else if (diff < -40) prevHighlight();
      }, { passive: true });
    }

    window.addEventListener('resize', updateHighlightsCarousel);
  }

  /* ==========================================
     ACADEMY EVENTS DATA LIST (JSON FORMAT)
     ========================================== */
  const ACADEMY_EVENTS = [
    { id: 1, date: "2026-08-10", title: "Parent Teacher Meeting", time: "09:00 AM - 01:00 PM", category: "Academic", icon: "👥", desc: "Interactive performance reviews and academic roadmap alignment." },
    { id: 2, date: "2026-08-12", title: "Annual Sports Practice", time: "07:30 AM - 09:30 AM", category: "Athletics", icon: "🏃", desc: "Championship practice trials and track team speed drills." },
    { id: 3, date: "2026-08-15", title: "Independence Day Celebration", time: "08:00 AM - 11:30 AM", category: "Cultural", icon: "🇮🇳", desc: "Flag hoisting ceremony, patriotic choir songs, and theater showcases." },
    { id: 4, date: "2026-08-18", title: "Debate Competition", time: "10:30 AM - 01:30 PM", category: "Co-Curricular", icon: "🎙️", desc: "Annual inter-house declamation contest and rhetorical debate." },
    { id: 5, date: "2026-08-20", title: "Robotics Workshop", time: "02:00 PM - 04:30 PM", category: "Innovation", icon: "🤖", desc: "Hands-on microcontroller programming and autonomous robot assembly." },
    { id: 6, date: "2026-08-22", title: "Music & Choir Performance", time: "05:00 PM - 07:00 PM", category: "Cultural", icon: "🎵", desc: "Orchestral symphonic gala presenting classical and contemporary works." },
    { id: 7, date: "2026-08-25", title: "Science Exhibition", time: "09:00 AM - 03:00 PM", category: "Academic", icon: "🔬", desc: "Student showcase of STEM experiments, lab research, and environmental setups." },
    { id: 8, date: "2026-08-28", title: "Admission Counselling Session", time: "11:00 AM - 01:00 PM", category: "Admissions", icon: "🎓", desc: "One-on-one counseling and campus tour for prospective academy parents." },
    { id: 9, date: "2026-08-31", title: "End of Term Holiday", time: "All Day", category: "Logistics", icon: "📅", desc: "Academic break before the next term commences." }
  ];

  function parseDateString(dateStr) {
    // Avoid timezone offset shift issues by splitting manually
    const parts = dateStr.split('-');
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      month: months[d.getMonth()].toUpperCase(),
      dayNum: d.getDate(),
      dayName: days[d.getDay()].toUpperCase(),
      fullMonthName: months[d.getMonth()],
      year: d.getFullYear(),
      rawMonth: d.getMonth()
    };
  }

  // 3x3 Calendar Date Grid controller
  const eventsDateGrid = document.getElementById('events-date-grid');
  const eventsDetailsPanel = document.getElementById('events-details-panel');

  if (eventsDateGrid && eventsDetailsPanel) {
    function renderEventsGrid() {
      eventsDateGrid.innerHTML = '';
      ACADEMY_EVENTS.forEach((ev, idx) => {
        const dateMeta = parseDateString(ev.date);
        const card = document.createElement('div');
        card.className = `event-date-card${idx === 0 ? ' active' : ''}`;
        card.setAttribute('data-event-id', ev.id);
        
        card.innerHTML = `
          <div class="card-circle-highlight"></div>
          <div class="card-content-wrap">
            <span class="card-month">${dateMeta.month}</span>
            <span class="card-day-num">${dateMeta.dayNum}</span>
            <span class="card-day-name">${dateMeta.dayName}</span>
          </div>
        `;

        card.addEventListener('click', () => {
          document.querySelectorAll('.event-date-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          showEventDetails(ev);
        });

        eventsDateGrid.appendChild(card);
      });

      if (ACADEMY_EVENTS.length > 0) {
        showEventDetails(ACADEMY_EVENTS[0]);
      }
    }

    function showEventDetails(ev) {
      eventsDetailsPanel.classList.add('panel-animating');
      setTimeout(() => {
        const dateMeta = parseDateString(ev.date);
        
        // Ordinal suffix mapping
        const getOrdinal = (n) => {
          const s = ["th", "st", "nd", "rd"];
          const v = n % 100;
          return n + (s[(v - 20) % 10] || s[v] || s[0]);
        };

        const dayNameText = dateMeta.dayName;
        const monthText = dateMeta.month;
        const dayNumText = getOrdinal(dateMeta.dayNum).toUpperCase();
        const formattedHeading = `${dayNameText} ${monthText} ${dayNumText}`;

        eventsDetailsPanel.innerHTML = `
          <div class="events-panel-heading">
            <span>${formattedHeading}</span>
          </div>
          <div class="panel-event-item">
            <h3 class="panel-event-title">${ev.title}</h3>
            <div class="panel-meta-row">
              <div class="panel-meta-item">
                <span>${ev.time}</span>
              </div>
              <span class="category-badge cat-${ev.category.toLowerCase()}">${ev.category}</span>
            </div>
            <p class="panel-event-desc">${ev.desc}</p>
          </div>
        `;
        eventsDetailsPanel.classList.remove('panel-animating');
      }, 150);
    }

    renderEventsGrid();
  }

  // Monthly Calendar Modal controller
  const calendarModal = document.getElementById('calendar-modal');
  const viewFullCalendarBtn = document.getElementById('view-full-calendar-btn');
  const calendarModalClose = document.getElementById('calendar-modal-close');
  const modalMonthTitle = document.getElementById('modal-month-title');
  const modalEventsMonthLabel = document.getElementById('modal-events-month-label');
  const modalCalendarDays = document.getElementById('modal-calendar-days');
  const modalEventsList = document.getElementById('modal-events-list');
  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');

  if (calendarModal && viewFullCalendarBtn) {
    let currentMonth = 7; // August 2026
    let currentYear = 2026;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    viewFullCalendarBtn.addEventListener('click', () => {
      calendarModal.classList.add('active');
      setPageScrollLocked('calendar-modal', true);
      renderModalCalendar(currentMonth, currentYear);
    });

    calendarModalClose.addEventListener('click', () => {
      calendarModal.classList.remove('active');
      setPageScrollLocked('calendar-modal', false);
    });

    calendarModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('calendar-modal-overlay')) {
        calendarModal.classList.remove('active');
        setPageScrollLocked('calendar-modal', false);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && calendarModal.classList.contains('active')) {
        calendarModal.classList.remove('active');
        setPageScrollLocked('calendar-modal', false);
      }
    });

    prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderModalCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderModalCalendar(currentMonth, currentYear);
    });

    function renderModalCalendar(month, year) {
      modalMonthTitle.textContent = `${monthNames[month]} ${year}`;
      modalEventsMonthLabel.textContent = monthNames[month];
      modalCalendarDays.innerHTML = '';

      const firstDayIndex = new Date(year, month, 1).getDay();
      const lastDayDate = new Date(year, month + 1, 0).getDate();
      const prevLastDayDate = new Date(year, month, 0).getDate();

      // Render days from previous month
      for (let i = firstDayIndex; i > 0; i--) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-cell other-month';
        dayCell.textContent = prevLastDayDate - i + 1;
        modalCalendarDays.appendChild(dayCell);
      }

      // Render days of the current month
      for (let day = 1; day <= lastDayDate; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-cell';
        dayCell.textContent = day;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayEvents = ACADEMY_EVENTS.filter(e => e.date === dateStr);
        
        if (dayEvents.length > 0) {
          dayCell.classList.add('has-events');
        }

        if (day === 15 && month === 7 && year === 2026) {
          dayCell.classList.add('today');
        }

        dayCell.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('active-selected'));
          dayCell.classList.add('active-selected');
          renderModalEventsList(dayEvents, dateStr);
        });

        modalCalendarDays.appendChild(dayCell);
      }

      // Fill remaining slots in monthly grid
      const totalSlots = firstDayIndex + lastDayDate;
      const nextMonthDays = (totalSlots % 7 === 0) ? 0 : 7 - (totalSlots % 7);
      for (let j = 1; j <= nextMonthDays; j++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day-cell other-month';
        dayCell.textContent = j;
        modalCalendarDays.appendChild(dayCell);
      }

      const monthEvents = ACADEMY_EVENTS.filter(e => {
        // Date parsing shift proof comparison
        const parts = e.date.split('-');
        return (parseInt(parts[1], 10) - 1) === month && parseInt(parts[0], 10) === year;
      });
      renderModalEventsList(monthEvents, null);
    }

    const modalEventsTitle = document.querySelector('.modal-events-title');

    function renderModalEventsList(eventsList, selectedDate) {
      modalEventsList.innerHTML = '';
      
      if (selectedDate) {
        const parsed = parseDateString(selectedDate);
        modalEventsTitle.textContent = `Events on ${parsed.fullMonthName} ${parsed.dayNum}, ${parsed.year}`;
      } else {
        modalEventsTitle.textContent = `Events in ${modalEventsMonthLabel.textContent}`;
      }

      if (eventsList.length === 0) {
        modalEventsList.innerHTML = `<div class="modal-no-events">No events scheduled for this period.</div>`;
        return;
      }

      eventsList.forEach(ev => {
        const card = document.createElement('div');
        card.className = 'modal-event-card';
        card.innerHTML = `
          <div class="modal-event-icon-box">${ev.icon}</div>
          <div class="modal-event-details">
            <h4 class="modal-event-name">${ev.title}</h4>
            <div class="panel-meta-row" style="margin-bottom: 0;">
              <span class="modal-event-time">🕒 ${ev.time}</span>
              <span class="category-badge cat-${ev.category.toLowerCase()}" style="padding: 0.15rem 0.5rem; font-size: 0.7rem; margin-left: 0.8rem;">${ev.category}</span>
            </div>
          </div>
        `;
        modalEventsList.appendChild(card);
      });
    }
  }

  /* ==========================================
     SECTION 6.8 — CALL TO ACTION & ENQUIRY FORM MODAL
     ========================================== */
  
  // 1. Scroll-triggered Active class for background & text animations
  const homeCtaSection = document.getElementById('home-cta');
  if (homeCtaSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          homeCtaSection.classList.add('active-cta');
          ctaObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    ctaObserver.observe(homeCtaSection);
  }

  // 2. Seeker Board button navigation
  const seekerBoardBtn = document.getElementById('seeker-board-btn');
  if (seekerBoardBtn) {
    seekerBoardBtn.addEventListener('click', () => {
      window.location.href = 'seeker.html';
    });
  }

  // 3. Admissions Enquiry Form Modal Logic
  const enquiryModal = document.getElementById('enquiry-modal');
  const enrollNowBtn = document.getElementById('enroll-now-btn');
  const enquiryModalClose = document.getElementById('enquiry-modal-close');
  const enquiryModalCancel = document.getElementById('enquiry-modal-cancel');
  const enquiryForm = document.getElementById('enquiry-form');

  if (enquiryModal && enrollNowBtn) {
    function openEnquiryModal() {
      enquiryModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeEnquiryModal() {
      enquiryModal.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
      resetEnquiryForm();
    }

    function resetEnquiryForm() {
      if (enquiryForm) {
        enquiryForm.reset();
        const inputs = enquiryForm.querySelectorAll('.form-input');
        inputs.forEach(input => input.classList.remove('is-invalid'));
        const errors = enquiryForm.querySelectorAll('.form-error-msg');
        errors.forEach(err => err.style.display = 'none');
      }
    }

    enrollNowBtn.addEventListener('click', openEnquiryModal);

    if (enquiryModalClose) enquiryModalClose.addEventListener('click', closeEnquiryModal);
    if (enquiryModalCancel) enquiryModalCancel.addEventListener('click', closeEnquiryModal);

    // Close on click outside
    enquiryModal.addEventListener('click', (e) => {
      if (e.target === enquiryModal || e.target.classList.contains('enquiry-modal-overlay')) {
        closeEnquiryModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && enquiryModal.classList.contains('active')) {
        closeEnquiryModal();
      }
    });
  }

  // 4. Form Validation & Submission
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const studentName = document.getElementById('student-name');
      const parentName = document.getElementById('parent-name');
      const emailAddress = document.getElementById('email-address');
      const mobileNumber = document.getElementById('mobile-number');
      const gradeApplying = document.getElementById('grade-applying');

      // Validation Helper functions
      function setValidity(input, errorId, validCondition) {
        const errorMsg = document.getElementById(errorId);
        if (validCondition) {
          input.classList.remove('is-invalid');
          if (errorMsg) errorMsg.style.display = 'none';
        } else {
          input.classList.add('is-invalid');
          if (errorMsg) errorMsg.style.display = 'block';
          isValid = false;
        }
      }

      // Validate student name
      setValidity(studentName, 'error-student-name', studentName.value.trim() !== '');

      // Validate parent name
      setValidity(parentName, 'error-parent-name', parentName.value.trim() !== '');

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setValidity(emailAddress, 'error-email-address', emailRegex.test(emailAddress.value.trim()));

      // Validate mobile (10 digits)
      const mobileRegex = /^[0-9]{10}$/;
      setValidity(mobileNumber, 'error-mobile-number', mobileRegex.test(mobileNumber.value.trim()));

      // Validate grade selection
      setValidity(gradeApplying, 'error-grade-applying', gradeApplying.value !== '');

      if (isValid) {
        alert('Enquiry submitted successfully! Our admissions office will contact you soon.');
        closeEnquiryModal();
      }
    });

    // Real-time validation clear on input
    const inputs = enquiryForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          input.classList.remove('is-invalid');
          const errorId = `error-${input.id}`;
          const errorMsg = document.getElementById(errorId);
          if (errorMsg) errorMsg.style.display = 'none';
        }
      });
    });
  }

  /* ==========================================
     5. PREMIUM CINEMATIC SCROLL ANIMATION CONTROLLER
     ========================================== */
  const animSections = Array.from(document.querySelectorAll('section, footer')).filter(sec => {
    // Exclude the hero section (#home) and the typography transition section
    return sec.id !== 'home' && !sec.closest('#home') && !sec.classList.contains('section-typography-transition');
  });

  animSections.forEach(section => {
    // 1. Gather all elements inside this section
    const allElements = Array.from(section.querySelectorAll('*'));

    const images = [];
    const headings = [];
    const paragraphs = [];
    const cards = [];
    const buttons = [];

    allElements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const cls = el.className || '';

      // Skip structural containers and non-visible elements
      if (tag === 'div' && !cls.includes('card') && !cls.includes('panel') && !cls.includes('box') && !cls.includes('cutout') && !cls.includes('details-container')) {
        return;
      }
      if (tag === 'span' && !cls.includes('badge') && !cls.includes('tag') && !cls.includes('item') && !cls.includes('star') && !cls.includes('contact-icon')) {
        return;
      }
      if (tag === 'svg' || tag === 'path' || tag === 'ul' || tag === 'li' || tag === 'ol' || tag === 'br') {
        return;
      }

      // Categorize
      if (tag === 'img' || tag === 'video' || tag === 'iframe' || cls.includes('cutout') || cls.includes('bg-image')) {
        images.push(el);
      } else if (tag.match(/^h[1-6]$/) || cls.includes('title') || cls.includes('tag') || cls.includes('subtitle') || cls.includes('number')) {
        headings.push(el);
      } else if (tag === 'p' || cls.includes('desc') || cls.includes('contact-item')) {
        paragraphs.push(el);
      } else if (cls.includes('card') || cls.includes('panel') || cls.includes('box') || cls.includes('details-container')) {
        cards.push(el);
      } else if (tag === 'button' || tag === 'a' || cls.includes('btn') || cls.includes('link-item') || cls.includes('social-circle')) {
        buttons.push(el);
      }
    });

    // Remove duplicates
    const uniqueImages = Array.from(new Set(images)).filter(Boolean);
    const uniqueHeadings = Array.from(new Set(headings)).filter(Boolean);
    const uniqueParagraphs = Array.from(new Set(paragraphs)).filter(Boolean);
    const uniqueCards = Array.from(new Set(cards)).filter(Boolean);
    const uniqueButtons = Array.from(new Set(buttons)).filter(Boolean);

    // 2. Assign base CSS reveal classes
    uniqueImages.forEach(img => {
      if (img.classList.contains('cta-bg-image')) {
        img.classList.add('reveal-zoom-out');
      } else {
        img.classList.add('reveal-zoom-in');
      }
    });
    uniqueHeadings.forEach(h => h.classList.add('reveal-fade-up'));
    uniqueParagraphs.forEach(p => p.classList.add('reveal-fade-up'));
    uniqueCards.forEach(c => c.classList.add('reveal-fade-up'));
    uniqueButtons.forEach(btn => btn.classList.add('reveal-fade-up'));

    // 3. Staggered timing scheduler
    // Set delays based on progressive sequence (Images -> Headings -> Paragraphs -> Cards -> Buttons)
    uniqueImages.forEach(el => {
      el.style.transitionDelay = '0s';
    });

    uniqueHeadings.forEach(el => {
      const parentCard = el.closest('.center-card, .highlight-card, .stat-card, .event-date-card, .events-details-container');
      if (parentCard) {
        // Inherit parent card delay
        el.style.transitionDelay = 'inherit';
      } else {
        if (el.classList.contains('section-tag') || el.classList.contains('stats-subtitle') || el.classList.contains('seeker-hero-tag')) {
          el.style.transitionDelay = '0.2s';
        } else {
          el.style.transitionDelay = '0.35s';
        }
      }
    });

    uniqueParagraphs.forEach(el => {
      const parentCard = el.closest('.center-card, .highlight-card, .stat-card, .event-date-card, .events-details-container');
      if (!parentCard) {
        el.style.transitionDelay = '0.5s';
      }
    });

    // Stagger cards one by one
    uniqueCards.forEach((el, index) => {
      const delay = 0.65 + index * 0.15;
      el.style.transitionDelay = `${delay}s`;
      
      // Force children inside this card to inherit the delay to animate together cleanly
      const cardChildren = el.querySelectorAll('h2, h3, h4, p, a, button, span, img');
      cardChildren.forEach(child => {
        child.style.transitionDelay = `${delay + 0.08}s`;
      });
    });

    // Stagger buttons last
    const baseButtonDelay = 0.65 + (uniqueCards.length * 0.15) + 0.1;
    uniqueButtons.forEach((el, index) => {
      const parentCard = el.closest('.center-card, .highlight-card, .stat-card, .event-date-card, .events-details-container');
      if (!parentCard) {
        el.style.transitionDelay = `${baseButtonDelay + index * 0.1}s`;
      }
    });

    // Combine all to register with observer
    const allRevealElements = [
      ...uniqueImages,
      ...uniqueHeadings,
      ...uniqueParagraphs,
      ...uniqueCards,
      ...uniqueButtons
    ];
    const uniqueRevealList = Array.from(new Set(allRevealElements)).filter(Boolean);

    // 4. Create intersection observer for the section
    const observerOptions = {
      root: null,
      threshold: 0.15 // Trigger when 15-20% of section enters viewport
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          uniqueRevealList.forEach(el => {
            el.classList.add('reveal-active');
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sectionObserver.observe(section);
  });

  // Stagger navigation header items on page load
  const siteHeaderLinks = document.querySelectorAll('.site-header .header-link, .site-header .nav-brand, .site-header #fontSizeToggle');
  siteHeaderLinks.forEach((link, index) => {
    link.classList.add('reveal-fade-up');
    setTimeout(() => {
      link.style.transitionDelay = `${index * 0.08}s`;
      link.classList.add('reveal-active');
    }, 450);
  });

});
