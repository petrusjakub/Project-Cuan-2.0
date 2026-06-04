document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Load Components (Header & Footer)
    const loadComponent = (id, file) => {
        fetch(file)
            .then(response => response.text())
            .then(data => document.getElementById(id).innerHTML = data)
            .then(() => initHeaderLogic()) // Init logic after load
            .catch(err => console.error(`Error loading ${file}:`, err));
    };

    if(document.getElementById('header-container')) loadComponent('header-container', 'components/header.html');
    if(document.getElementById('footer-container')) loadComponent('footer-container', 'components/footer.html');

    function initHeaderLogic() {
        // Dark Mode
        const themeToggle = document.getElementById('theme-toggle');
        const icon = themeToggle?.querySelector('i');
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon?.classList.replace('fa-moon', 'fa-sun');
        }
        themeToggle?.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const newTheme = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            if(newTheme === 'dark') icon?.classList.replace('fa-moon', 'fa-sun');
            else icon?.classList.replace('fa-sun', 'fa-moon');
        });

        // Mobile Menu
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        menuToggle?.addEventListener('click', () => mobileMenu?.classList.toggle('active'));

        // Search
        const searchBtn = document.getElementById('search-btn');
        const closeSearch = document.getElementById('close-search');
        const searchOverlay = document.getElementById('search-overlay');
        const searchInput = document.getElementById('search-input');
        
        searchBtn?.addEventListener('click', () => {
            searchOverlay?.classList.add('active');
            searchInput?.focus();
        });
        closeSearch?.addEventListener('click', () => {
            searchOverlay?.classList.remove('active');
            if(searchInput) searchInput.value = '';
        });
    }

    // 2. Scroll to Top
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) scrollTopBtn?.classList.add('visible');
        else scrollTopBtn?.classList.remove('visible');
    });
    scrollTopBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 3. FAQ Accordion (If exists)
    document.querySelectorAll('.faq-question').forEach(item => {
        item.addEventListener('click', () => {
            const parent = item.parentElement;
            parent.classList.toggle('active');
        });
    });

    // 4. Kalkulator Premi Logic (MiUHC)
    const calcBtn = document.getElementById('hitung-premi');
    if (calcBtn) {
        // Load PapaParse for CSV
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js";
        script.onload = () => {
            let premiumData = [];
            Papa.parse("assets/data/miuhc.csv", {
                download: true,
                header: true,
                complete: function(results) {
                    premiumData = results.data;
                }
            });

            calcBtn.addEventListener('click', () => {
                const gender = document.getElementById('gender').value.toUpperCase();
                const usia = parseInt(document.getElementById('usia').value);
                const benefit = document.getElementById('benefit').value; // konv_inap or konv_jalan
                const plan = document.getElementById('plan').value;
                const mode = document.getElementById('mode').value;

                // Factors
                const factors = { 'tahunan': 1.00, 'semesteran': 0.525, 'kuartalan': 0.275, 'bulanan': 0.095 };
                
                // Find Data
                const row = premiumData.find(d => 
                    d.gender === gender && 
                    parseInt(d.usia) === usia && 
                    d.kategori === benefit && 
                    d.plan === plan
                );

                const resultDiv = document.getElementById('hasil-premi');
                if (row && row.premi) {
                    const base = parseInt(row.premi);
                    const final = Math.round((base * factors[mode]) / 100) * 100;
                    resultDiv.innerHTML = `Estimasi Premi: <strong>Rp ${final.toLocaleString('id-ID')}</strong> /${mode}`;
                    resultDiv.style.display = 'block';
                    resultDiv.scrollIntoView({ behavior: 'smooth' });
                } else {
                    resultDiv.innerHTML = "Data premi tidak ditemukan untuk kombinasi ini.";
                    resultDiv.style.display = 'block';
                    resultDiv.style.color = 'red';
                }
            });
        };
        document.head.appendChild(script);
    }
});
