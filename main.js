/**
 * JPChat Official Website Scripts
 * Enhanced Fluid Animations, Smooth Easing Navigation, Interactive Tabs & Legal Sidebar
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNavbarScroll();
  initMobileMenu();
  initTabs();
  initFaqAccordion();
  initCopyHash();
  initSmoothScroll();
  initLegalSidebarObserver();
  initScrollReveal();
  initLatestRelease();
});

/**
 * Header shadow and background change on scroll
 */
function initNavbarScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Mobile navigation menu toggle with smooth transitions
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  // Close menu when clicking outside or on a link
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '&#9776;';
    }
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = '&#9776;';
    });
  });
}

/**
 * Smooth Animated Scroll with Header Offset AND Animation Re-triggering
 * When the user clicks any anchor link or button, the target section
 * scrolls into view and its appearance animation reloads seamlessly.
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Update URL hash without instant jump
        history.pushState(null, null, targetId);

        // Smooth scroll with responsive header & sticky bar offset
        const isLegalSidebar = document.querySelector('.legal-sidebar') !== null;
        const isMobile = window.innerWidth <= 1024;
        const headerOffset = (isLegalSidebar && isMobile) ? 135 : 85;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Re-trigger entrance animation on target section even if already loaded!
        retriggerSectionAnimation(targetElement);
      }
    });
  });

  // If page loaded with a URL hash (e.g. descargas.html#guia or index.html#caracteristicas)
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(() => {
        retriggerSectionAnimation(hashTarget);
      }, 350);
    }
  }
}

/**
 * Interactive feature showcase tabs with fade-slide transitions & animation reload
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  if (tabBtns.length === 0 || tabPanes.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      // Update button active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane active state with smooth transition
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.style.display = 'grid';
          setTimeout(() => {
            pane.classList.add('active');
            // Re-trigger entrance animation inside the freshly activated tab
            retriggerSectionAnimation(pane);
          }, 20);
        } else {
          pane.classList.remove('active');
          setTimeout(() => {
            if (!pane.classList.contains('active')) {
              pane.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/**
 * FAQ Collapsible Accordion with Smooth Bezier Expansion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other open items with smooth collapse
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
      }
    });
  });
}

/**
 * Legal Sidebar Scroll Spy (Highlight active section in privacidad / terminos)
 */
function initLegalSidebarObserver() {
  const sidebarLinks = document.querySelectorAll('.legal-sidebar .legal-nav-link');
  if (sidebarLinks.length === 0) return;

  const sections = document.querySelectorAll('.legal-content section, .legal-content .legal-alert');
  if (sections.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        sidebarLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            // Auto-scroll active pill into view on mobile
            if (window.innerWidth <= 1024 && typeof link.scrollIntoView === 'function') {
              link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Copy Checksum Hash with White Icon Feedback Toast
 */
function initCopyHash() {
  const copyBtn = document.getElementById('copyHashBtn');
  const hashCode = document.getElementById('hashCode');
  if (!copyBtn || !hashCode) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = hashCode.textContent.trim();
    const currentLang = localStorage.getItem('jpchat_lang') || 'es';
    const dict = (typeof JPChatTranslations !== 'undefined' && JPChatTranslations[currentLang]) ? JPChatTranslations[currentLang] : null;
    const copiedToast = dict ? dict['toast.copied'] : '¡Hash SHA-256 copiado al portapapeles!';
    const errorToast = dict ? dict['toast.copy_error'] : 'Error al copiar el hash';
    const copiedBtnText = dict ? dict['dl.copied'] : '✓ Copiado';
    const resetBtnText = dict ? dict['dl.copy_btn'] : 'Copiar Hash';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(copiedToast);
      copyBtn.textContent = copiedBtnText;
      setTimeout(() => {
        copyBtn.textContent = resetBtnText;
      }, 2500);
    } catch (err) {
      showToast(errorToast);
    }
  });
}

/**
 * Internationalization (i18n) & Bilingual Switcher (ES / EN)
 * Auto-detects browser locale, persists choice in localStorage,
 * and updates all [data-i18n] and [data-i18n-placeholder] elements.
 */
let activeLang = 'es';

function initLanguage() {
  const savedLang = localStorage.getItem('jpchat_lang');
  let langToUse = 'es';

  if (savedLang === 'es' || savedLang === 'en') {
    langToUse = savedLang;
  } else {
    const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    langToUse = navLang.startsWith('es') ? 'es' : 'en';
  }

  setLanguage(langToUse);

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    e.preventDefault();
    const selected = btn.getAttribute('data-lang');
    if (selected === 'es' || selected === 'en') {
      setLanguage(selected);
    }
  });
}

function setLanguage(lang) {
  if (typeof JPChatTranslations === 'undefined') return;
  const dict = JPChatTranslations[lang];
  if (!dict) return;

  activeLang = lang;
  localStorage.setItem('jpchat_lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key] !== undefined) {
      el.setAttribute('placeholder', dict[key]);
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
}

/**
 * Toast Notification System
 */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span style="color: #FFFFFF;">${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/**
 * Re-triggers the reveal entrance animation for a given section/element,
 * ensuring it plays even if it was previously loaded/shown.
 * Resets the CSS keyframe animation by clearing the visible class, forcing
 * a reflow, and re-applying it cleanly.
 */
function retriggerSectionAnimation(targetSection) {
  if (!targetSection) return;

  const childElements = targetSection.querySelectorAll(
    '.reveal, .reveal-scale, .reveal-left, .reveal-right'
  );
  const elements = targetSection.matches('.reveal, .reveal-scale, .reveal-left, .reveal-right')
    ? [targetSection, ...childElements]
    : Array.from(childElements);

  if (elements.length === 0) return;

  // Step 1: Remove visible class
  elements.forEach(el => el.classList.remove('visible'));

  // Step 2: Force reflow so browser restarts the CSS keyframe animation
  void targetSection.offsetHeight;

  // Step 3: Re-add visible so animations run from 0% with their staggered delays
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 60);
}

/**
 * Scroll Entrance Reveal Engine
 * Observes all reveal elements using IntersectionObserver and triggers
 * GPU-accelerated CSS keyframe animations with built-in progressive delays.
 */
function initScrollReveal() {
  const allRevealElements = document.querySelectorAll(
    '.reveal, .reveal-scale, .reveal-left, .reveal-right'
  );
  if (allRevealElements.length === 0) return;

  if (!('IntersectionObserver' in window)) {
    allRevealElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -20px 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  allRevealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Dynamic GitHub Latest Release Loader
 * Dynamically queries https://api.github.com/repos/JonassAPM/JPChat/releases/latest
 * Extracts the real asset file name, file size, and direct download URL,
 * and updates the page elements without requiring any static hardcoded values.
 */
let latestReleasePromise = fetchLatestRelease();

async function fetchLatestRelease() {
  const CACHE_KEY = 'jpchat_latest_release_data';
  const CACHE_TIME_KEY = 'jpchat_latest_release_time';
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache to prevent rate limiting

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    const now = Date.now();

    if (cached && cachedTime && (now - parseInt(cachedTime, 10)) < CACHE_TTL_MS) {
      return JSON.parse(cached);
    }

    const res = await fetch('https://api.github.com/repos/JonassAPM/JPChat/releases/latest');
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      localStorage.setItem(CACHE_TIME_KEY, now.toString());
      return data;
    }
  } catch (err) {
    console.warn('JPChat: Error fetching latest release from GitHub API:', err);
  }
  return null;
}

async function initLatestRelease() {
  const downloadBtn = document.getElementById('mainDownloadBtn') || document.querySelector('.download-action-btn');
  const metaFile = document.getElementById('metaFileName');
  const metaSize = document.getElementById('metaFileSize');

  if (!downloadBtn && !metaFile && !metaSize) return;

  // Intercept early click if fetch is still pending
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async (e) => {
      const currentHref = downloadBtn.getAttribute('href');
      if (currentHref === 'https://github.com/JonassAPM/JPChat/releases/latest' || currentHref === '#') {
        const releaseData = await latestReleasePromise;
        if (releaseData && releaseData.assets && releaseData.assets.length > 0) {
          const apkAsset = releaseData.assets.find(a => a.name && a.name.endsWith('.apk')) || releaseData.assets[0];
          if (apkAsset && apkAsset.browser_download_url) {
            e.preventDefault();
            downloadBtn.setAttribute('href', apkAsset.browser_download_url);
            downloadBtn.setAttribute('download', apkAsset.name);
            window.location.href = apkAsset.browser_download_url;
          }
        }
      }
    });
  }

  const releaseData = await latestReleasePromise;
  if (!releaseData || !releaseData.assets || releaseData.assets.length === 0) return;

  // Find APK asset or default to the first asset
  const apkAsset = releaseData.assets.find(a => a.name && a.name.endsWith('.apk')) || releaseData.assets[0];
  if (!apkAsset) return;

  const fileName = apkAsset.name;
  const fileSizeMB = (apkAsset.size / (1024 * 1024)).toFixed(1) + ' MB';
  const downloadUrl = apkAsset.browser_download_url;

  // Dynamically update download button with direct URL and filename
  if (downloadBtn) {
    downloadBtn.setAttribute('href', downloadUrl);
    downloadBtn.setAttribute('download', fileName);

    const btnSpan = downloadBtn.querySelector('[data-i18n="dl.btn_download"]') || downloadBtn.querySelector('span');
    if (btnSpan) {
      const currentLang = localStorage.getItem('jpchat_lang') || 'es';
      btnSpan.textContent = currentLang === 'en' 
        ? `Download APK (${fileSizeMB})` 
        : `Descargar APK (${fileSizeMB})`;
    }
  }

  // Dynamically update File (Archivo) and Size (Tamaño) metadata
  if (metaFile) {
    metaFile.textContent = fileName;
  }
  if (metaSize) {
    metaSize.textContent = fileSizeMB;
  }

  // Update i18n dictionary so toggling language keeps the live fetched size
  if (typeof JPChatTranslations !== 'undefined') {
    if (JPChatTranslations.es) {
      JPChatTranslations.es['dl.btn_download'] = `Descargar APK (${fileSizeMB})`;
    }
    if (JPChatTranslations.en) {
      JPChatTranslations.en['dl.btn_download'] = `Download APK (${fileSizeMB})`;
    }
  }
}
