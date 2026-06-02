// ===== CONFIG =====
const CONFIG = {
  waNumber: '6287781896087',
  themeKey: 'project-cuan-theme',
  navbarPath: 'components/navbar.html',
  footerPath: 'components/footer.html'
};

// ===== UTILS =====
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

// Format Rupiah
const formatRp = (num) => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

// ===== THEME TOGGLE =====
function initThemeToggle() {
  const toggle = $('#theme-toggle');
  const icon = toggle?.querySelector('i');
  if (!toggle) return;

  // Load saved theme
  const saved = localStorage.getItem(CONFIG.themeKey) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved, icon);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(CONFIG.themeKey, next);
    updateThemeIcon(next, icon);
    
    // Smooth transition
    document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
    setTimeout(() => { document.documentElement.style.transition = ''; }, 300);
  });
}

function updateThemeIcon(theme, icon) {
  if (!icon) return;
  icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  lucide.createIcons();
}

// ===== COMPONENT LOADER =====
async function loadComponent(containerId, filePath) {
  try {    // Handle relative path based on current page depth
    const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
    const fullPath = filePath.startsWith('http') ? filePath : basePath + filePath;
    
    const res = await fetch(fullPath, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    const container = $(`#${containerId}`);
    if (container) {
      container.innerHTML = html;
      // Re-init interactive elements after inject
      if (containerId === 'navbar-container') initNavbar();
      if (containerId === 'footer-container') lucide.createIcons();
    }
  } catch (err) {
    console.warn(`⚠️ Gagal load ${filePath}:`, err);
    // Fallback UI
    const container = $(`#${containerId}`);
    if (container && containerId === 'navbar-container') {
      container.innerHTML = `<nav class="navbar"><div class="nav-container"><a href="/" class="nav-brand">Project Cuan</a></div></nav>`;
    }
  }
}

// ===== NAVBAR INTERACTIONS =====
function initNavbar() {
  // Mobile menu toggle
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking link (mobile)
    $$('#nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
  
  // Navbar scroll effect
  const navbar = $('.navbar');
  if (navbar) {    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init
  }
  
  lucide.createIcons();
}

// ===== QUIZ LOGIC =====
function initQuiz() {
  const steps = $$('.quiz-step');
  const options = $$('.quiz-option');
  let answers = {};
  
  if (!steps.length) return;
  
  // Option click handler
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      // Visual feedback
      opt.parentElement.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      
      // Store answer
      const stepId = opt.closest('.quiz-step').id;
      answers[stepId] = opt.dataset.answer;
      
      // Next step with delay
      setTimeout(() => {
        const current = opt.closest('.quiz-step');
        const next = current.nextElementSibling;
        
        if (next && next.classList.contains('quiz-step')) {
          current.classList.remove('active');
          next.classList.add('active');
        } else if (current.id === 'quiz-step-2') {
          // Show result (demo logic)
          showQuizResult(answers);
        }
      }, 300);
 spasi
    });
  });
}
function showQuizResult(answers) {
  const resultStep = $('#quiz-result');
  const scoreEl = $('#score');
  const descEl = $('#result-desc');
  
  if (!resultStep) return;
  
  // Simple scoring demo
  const score = 72; // Replace with real logic
  scoreEl.textContent = score;
  
  // Personalized message
  if (score >= 80) {
    descEl.textContent = 'Wah, kamu sudah sangat aware! Tinggal optimalkan proteksimu.';
  } else if (score >= 60) {
    descEl.textContent = 'Kamu sudah cukup aware! Tapi masih ada celah yang bisa ditutup biar makin tenang.';
  } else {
    descEl.textContent = 'Yuk, mulai bangun proteksi dari sekarang. Aku bantu kamu step-by-step!';
  }
  
  // Show result
  $$('.quiz-step').forEach(s => s.classList.remove('active'));
  resultStep.classList.add('active');
  
  // Scroll to result
  resultStep.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== FLOATING WA & BACK TO TOP =====
function initFloatingElements() {
  // Back to top button
  const backToTop = $('#back-to-top');
  if (backToTop) {
    const onScroll = () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  
  // Floating WA: Add UTM params for tracking  const waBtn = $('.floating-wa');
  if (waBtn) {
    const url = new URL(waBtn.href);
    const params = new URLSearchParams(url.search);
    params.append('source', 'project-cuan-web');
    url.search = params.toString();
    waBtn.href = url.toString();
  }
}

// ===== LAZY LOAD IMAGES (Opsional) =====
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy load supported
    $$('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback with IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    $$('img[data-src]').forEach(img => observer.observe(img));
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  // Load shared components
  await Promise.all([
    loadComponent('navbar-container', CONFIG.navbarPath),
    loadComponent('footer-container', CONFIG.footerPath)
  ]);
  
  // Init features
  initThemeToggle();
  initQuiz();
  initFloatingElements();
  initLazyLoad();
  
  // Re-init icons after all content loaded
  setTimeout(() => lucide.createIcons(), 100);
  
  console.log('✨ Project Cuan 2.0 loaded — Cerdas Finansial, Tenang Masa Depan');});

// ===== GLOBAL: Handle quiz navigation (for multi-step) =====
window.nextQuizStep = function(currentStep, nextStep) {
  $(`#${currentStep}`)?.classList.remove('active');
  $(`#${nextStep}`)?.classList.add('active');
};
