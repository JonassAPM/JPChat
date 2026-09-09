/**
 * JPChat Official Website Scripts
 * Enhanced Fluid Animations, Smooth Easing Navigation, Interactive Tabs & Legal Sidebar
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initTabs();
  initFaqAccordion();
  initCopyHash();
  initSmoothScroll();
  initLegalSidebarObserver();
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
 * Smooth Animated Scroll with Header Offset
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

        // Smooth scroll with header offset
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Interactive feature showcase tabs with fade-slide transitions
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
          // Small delay for CSS opacity transition to trigger
          setTimeout(() => {
            pane.classList.add('active');
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
      showToast('¡Hash SHA-256 copiado al portapapeles!');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copiado';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2500);
    } catch (err) {
      showToast('Error al copiar el hash');
    }
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
