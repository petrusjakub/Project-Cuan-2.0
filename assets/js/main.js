/**
 * Project Cuan 2.0 - Universal JavaScript
 * Handles: Dark Mode, Search, Mobile Menu, Scroll Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initSearch();
    initMobileMenu();
    initScrollHelpers();
});

// --- Dark Mode Logic ---
function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        html.classList.add('dark-mode');
        if(toggle) toggle.setAttribute('aria-pressed', 'true');
    }

    if (toggle) {
        toggle.addEventListener('click', () => {
            html.classList.toggle('dark-mode');
            const isDark = html.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        });
    }
}

// --- Search Logic ---
function initSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeBtn = document.getElementById('closeSearch');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    if (!searchBtn || !searchModal) return;

    // Product Map for Search
    const products = [
        { name: 'MiUHC', file: 'pages/miuhc.html', type: 'Jiwa' },
        { name: 'MDLA', file: 'pages/mdla.html', type: 'Jiwa' },
        { name: 'MPS Flexi', file: 'pages/mps-flexi.html', type: 'Jiwa' },
        { name: 'MDWA', file: 'pages/mdwa.html', type: 'Jiwa' },
        { name: 'PAP', file: 'pages/pap.html', type: 'Jiwa' },
        { name: 'MPDS', file: 'pages/mpds.html', type: 'Jiwa' },
        { name: 'MPPS', file: 'pages/mpps.html', type: 'Jiwa' },
        { name: 'MSP', file: 'pages/msp.html', type: 'Jiwa' },
        { name: 'MIUCC', file: 'pages/miucc.html', type: 'Jiwa' },
        { name: 'MCCP', file: 'pages/mccp.html', type: 'Jiwa' },
        { name: 'MiFiP', file: 'pages/mifip.html', type: 'Jiwa' },
        { name: 'MiPrecious', file: 'pages/miprecious.html', type: 'Jiwa' },
        { name: 'Mission', file: 'pages/mission.html', type: 'Jiwa' },
        { name: 'MDSA', file: 'pages/mdsa.html', type: 'Jiwa' },
        { name: 'Asuransi Mobil', file: 'pages/asuransi-mobil.html', type: 'Umum' },
        { name: 'Asuransi Properti', file: 'pages/asuransi-properti.html', type: 'Umum' },
        { name: 'Asuransi Perjalanan', file: 'pages/asuransi-perjalanan.html', type: 'Umum' },
        { name: 'Asuransi Kumpulan', file: 'pages/asuransi-kumpulan.html', type: 'Umum' },
        { name: 'Magna Sehat Premium', file: 'pages/magna-sehat-premium.html', type: 'Khusus' },
        { name: 'Bisnis Asuransi', file: 'pages/bisnis.html', type: 'Info' },
        { name: 'Tentang Kami', file: 'pages/tentang.html', type: 'Info' }
    ];

    searchBtn.addEventListener('click', () => {
        searchModal.style.display = 'flex';
        setTimeout(() => searchInput.focus(), 100);
    });

    closeBtn.addEventListener('click', () => {
        searchModal.style.display = 'none';
        searchInput.value = '';
        searchResults.innerHTML = '';
    });

    searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) {
            searchModal.style.display = 'none';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        searchResults.innerHTML = '';
        
        if (query.length < 2) return;

        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.type.toLowerCase().includes(query)
        );

        if (filtered.length === 0) {
            searchResults.innerHTML = '<div class="search-no-result">Produk tidak ditemukan.</div>';
            return;
        }

        filtered.forEach(p => {
            const div = document.createElement('div');
            div.className = 'search-item';
            div.innerHTML = `<a href="${p.file}"><strong>${highlightMatch(p.name, query)}</strong> <span class="badge">${p.type}</span></a>`;
            searchResults.appendChild(div);
        });
    });
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// --- Mobile Menu Logic ---
function initMobileMenu() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('active');
        if (isActive) {
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// --- Scroll Helpers ---
function initScrollHelpers() {
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    const floatingGroup = document.querySelector('.floating-group');

    if (!scrollUpBtn || !scrollDownBtn) return;

    // Scroll Down Action
    scrollDownBtn.addEventListener('click', () => {
        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    });

    // Scroll Up Action & Visibility Toggle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollUpBtn.style.opacity = '1';
            scrollUpBtn.style.pointerEvents = 'all';
        } else {
            scrollUpBtn.style.opacity = '0';
            scrollUpBtn.style.pointerEvents = 'none';
        }
    });

    scrollUpBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Universal Calculator Engine ---
// Can be included in specific pages via <script> tag calling these functions
window.CuanCalculator = {
    /**
     * Generic Health Insurance Formula
     * @param {number} usia - Usia masuk
     * @param {string} plan - 'basic', 'silver', 'gold', 'platinum'
     * @param {string} gender - 'pria', 'wanita'
     */
    calculateHealthPremium: function(usia, plan, gender) {
        const baseRates = {
            'basic': 800000,
            'silver': 1500000,
            'gold': 2500000,
            'platinum': 4000000
        };
        
        const ageFactor = usia < 30 ? 1.0 : usia < 40 ? 1.3 : usia < 50 ? 1.7 : 2.2;
        const genderFactor = gender === 'pria' ? 1.0 : 0.95; // Wanita sedikit lebih murah di beberapa produk
        
        const annual = baseRates[plan] * ageFactor * genderFactor;
        const monthly = Math.round(annual / 12);
        
        return {
            monthly: monthly,
            annual: Math.round(annual),
            formattedMonthly: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(monthly),
            formattedAnnual: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.round(annual))
        };
    },

    /**
     * Property Insurance Formula (Simplified)
     * @param {number} value - Nilai properti
     * @param {string} type - 'rumah', 'kantor', 'gudang'
     */
    calculatePropertyPremium: function(value, type) {
        const rates = {
            'rumah': 0.0015, // 0.15%
            'kantor': 0.0020,
            'gudang': 0.0025
        };
        const rate = rates[type] || 0.002;
        const premium = value * rate;
        
        return {
            annual: Math.round(premium),
            formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.round(premium))
        };
    },

    /**
     * Car Insurance Formula (All Risk Approximation)
     * @param {number} value - Harga mobil
     * @param {number} year - Tahun pembuatan
     */
    calculateCarPremium: function(value, year) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - year;
        
        let rate = 0.025; // Base 2.5%
        if (age > 5) rate += 0.005;
        if (age > 10) rate += 0.005;
        
        const premium = value * rate;
        return {
            annual: Math.round(premium),
            formatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Math.round(premium))
        };
    }
};
