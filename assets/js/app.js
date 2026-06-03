/* ============================================
   PROJECT CUAN 2.0 - JAVASCRIPT ENGINE
   ============================================ */

// ===== THEME TOGGLE =====
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
  
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const icon = toggle.querySelector('i');
  if (icon) icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
  if (window.lucide) lucide.createIcons();
}

// ===== SIDEBAR =====
function initSidebar() {
  const btn = document.getElementById('hamburger-btn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('close-sidebar');
  
  if (!btn || !sidebar) return;
  
  const open = () => {
    sidebar.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  
  const close = () => {
    sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };  
  btn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);
  
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', close);
  });
}

// ===== SCROLL BUTTONS =====
function initScrollButtons() {
  const topBtn = document.getElementById('scroll-top');
  const bottomBtn = document.getElementById('scroll-bottom');
  
  if (!topBtn || !bottomBtn) return;
  
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight;
    const wh = window.innerHeight;
    
    topBtn.classList.toggle('visible', y > 300);
    bottomBtn.classList.toggle('visible', y > 300 && y < h - wh - 100);
  });
  
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  bottomBtn.addEventListener('click', () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));
}

// ===== QUIZ ENGINE =====
function initQuiz() {
  const container = document.getElementById('home-quiz');
  if (!container) return;
  
  const answers = {};
  const progressBar = document.getElementById('quiz-progress-bar');
  
  const updateProgress = (step) => {
    if (progressBar) progressBar.style.width = `${(step / 3) * 100}%`;
  };
  
  const showStep = (step) => {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const stepEl = document.getElementById(`step-${step}`);
    if (stepEl) stepEl.classList.add('active');
    updateProgress(step);
  };
  
  window.handleQuizOption = (option, step, question, answer) => {    answers[question] = answer;
    document.querySelectorAll(`#step-${step} .quiz-option`).forEach(o => o.classList.remove('selected'));
    option.classList.add('selected');
    
    setTimeout(() => {
      if (step < 3) {
        showStep(step + 1);
      } else {
        showResults();
      }
    }, 300);
  };
  
  function showResults() {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const resultStep = document.getElementById('step-result');
    if (resultStep) resultStep.classList.add('active');
    updateProgress(3);
    
    const recs = getRecommendations(answers);
    renderRecommendations(recs);
  }
  
  function getRecommendations(answers) {
    const { priority, status } = answers;
    const recs = [];
    
    if (priority === 'kesehatan') {
      recs.push({ icon: '🏥', title: 'MiUHC', desc: 'Proteksi kesehatan as charged', url: '/pages/miuhc.html' });
      if (status === 'keluarga') recs.push({ icon: '❤️', title: 'Magna Sehat', desc: '1 polis untuk 5 orang', url: '/pages/magna.html' });
    }
    if (priority === 'pensiun' || priority === 'investasi') {
      recs.push({ icon: '💰', title: 'MDLA', desc: 'Dana pensiun pasti cair', url: '/pages/mdla.html' });
      recs.push({ icon: '📈', title: 'MDWA', desc: 'Investasi terstruktur', url: '/pages/mdwa.html' });
    }
    if (priority === 'bisnis') {
      recs.push({ icon: '🚀', title: 'Peluang Bisnis', desc: 'Bangun income exponential', url: '/pages/bisnis.html' });
    }
    
    return recs.slice(0, 3);
  }
  
  function renderRecommendations(recs) {
    const container = document.getElementById('quiz-results');
    if (!container) return;
    container.innerHTML = recs.map(r => `
      <a href="${r.url}" class="result-card">
        <div class="result-card-content">
          <div class="result-card-icon">${r.icon}</div>
          <div class="result-card-info">            <h4>${r.title}</h4>
            <p>${r.desc}</p>
          </div>
          <div class="result-card-arrow">→</div>
        </div>
      </a>
    `).join('');
  }
  
  window.resetQuiz = () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    showStep(1);
  };
}

// ===== MAIN =====
document.addEventListener('DOMContentLoaded', async () => {
  // Load components
  const isSubpage = window.location.pathname.includes('/pages/');
  const basePath = isSubpage ? '..' : '.';
  
  const navContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');
  
  if (navContainer) {
    const res = await fetch(`${basePath}/components/navbar.html`);
    navContainer.innerHTML = await res.text();
  }
  
  if (footerContainer) {
    const res = await fetch(`${basePath}/components/footer.html`);
    footerContainer.innerHTML = await res.text();
  }
  
  // Init icons
  if (window.lucide) lucide.createIcons();
  
  // Init features
  initTheme();
  initSidebar();
  initScrollButtons();
  initQuiz();
});
