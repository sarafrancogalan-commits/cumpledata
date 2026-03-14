/* ============================================
   CUMPLEDATA S.A.S. — Main JavaScript
   Interactivity, WhatsApp flow, animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Initialize AOS ----
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    disable: window.innerWidth < 360
  });

  // ---- Theme detection (used by other features) ----
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ---- Mobile Menu Toggle ----
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || this.classList.contains('cta-whatsapp')) return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.counter');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      countersAnimated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.round(target * eased);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
            counter.classList.add('counted');
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();

  // ---- FAQ Accordion ----
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const item = toggle.parentElement;
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
      });

      // Open clicked if it wasn't active
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ---- WhatsApp Modal & Redirect Logic ----
  const WHATSAPP_NUMBER = '573189873007';
  const WHATSAPP_MESSAGE = encodeURIComponent(
    'Hola, me gustaría recibir información sobre sus servicios de cumplimiento normativo y protección de datos. ¿Podrían ayudarme?'
  );
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  const modal = document.getElementById('data-policy-modal');
  const modalClose = document.getElementById('modal-close');
  const acceptCheckbox = document.getElementById('accept-policy');
  const continueBtn = document.getElementById('modal-continue');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Reset state
    acceptCheckbox.checked = false;
    continueBtn.disabled = true;

    // Remove previous animation class and re-apply
    const modalContent = modal.querySelector('.animate-modal-in, .animate-modal-out');
    if (modalContent) {
      modalContent.classList.remove('animate-modal-out');
      modalContent.classList.add('animate-modal-in');
    }
  }

  function closeModal() {
    const modalContent = modal.querySelector('.animate-modal-in, .animate-modal-out');
    if (modalContent) {
      modalContent.classList.remove('animate-modal-in');
      modalContent.classList.add('animate-modal-out');
    }

    setTimeout(() => {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }, 200);
  }

  // Checkbox enables continue button
  acceptCheckbox.addEventListener('change', () => {
    continueBtn.disabled = !acceptCheckbox.checked;
  });

  // Continue redirects to WhatsApp
  continueBtn.addEventListener('click', () => {
    if (acceptCheckbox.checked) {
      window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
      closeModal();
    }
  });

  // Close modal
  modalClose.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Attach modal to all CTA WhatsApp links
  document.querySelectorAll('.cta-whatsapp').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // ---- Active Section Highlight in Nav ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul a[href^="#"]');

  function highlightNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
});
