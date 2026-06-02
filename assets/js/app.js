```javascript
// === UTILS: Dynamic Component Loader ===
const BASE_PATH = window.location.pathname.includes('/pages/') ? '../' : '';

async function loadComponent(elementId, filePath) {
    try {
        // Handle path relatif berdasarkan lokasi halaman
        const fullPath = filePath.startsWith('http') 
            ? filePath 
            : filePath.startsWith('../') || filePath.startsWith('./') 
                ? filePath 
                : BASE_PATH + filePath;
        
        const response = await fetch(fullPath, { cache: 'force-cache' });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const html = await response.text();
        const target = document.getElementById(elementId);
        
        if (target) {
            target.innerHTML = html;
            
            // Re-initialize event listeners jika komponen punya interaksi
            if (elementId === 'navbar') initNavbar();
            if (elementId === 'footer') initFooter();
        }
    } catch (error) {
        console.error(`❌ Gagal load component [${elementId}] dari ${filePath}:`, error);
        // Fallback UI
        const target = document.getElementById(elementId);
        if (target) {
            target.innerHTML = `<div class="component-fallback" style="padding:1rem;text-align:center;color:#666">⚠️ Component tidak tersedia</div>`;
        }
    }
}

// === UTILS: Init Navbar (jika ada dropdown/toggle) ===
function initNavbar() {
    const mobileToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.onclick = (e) => {
            e.preventDefault();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        };
    }
}

// === UTILS: Init Footer ===
function initFooter() {
    // Tambahkan logic footer jika diperlukan
    console.log('✅ Footer loaded');
}

// === THEME TOGGLE: Dark/Light Mode ===
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle?.querySelector('i');
    
    if (!toggle) return;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, icon);
    
    // Toggle handler
    toggle.onclick = () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next, icon);
        
        // Trigger reflow untuk animasi smooth
        document.documentElement.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    };
}

function updateThemeIcon(theme, icon) {
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// === INIT: Jalankan saat DOM ready ===
document.addEventListener('DOMContentLoaded', () => {
    // Load components
    loadComponent('navbar', 'components/navbar.html');
    loadComponent('footer', 'components/footer.html');
    
    // Init features
    initThemeToggle();
    
    // Log ready
    console.log('🚀 Project Cuan 2.0 loaded');
});
```

---
