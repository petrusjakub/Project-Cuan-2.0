document.addEventListener("DOMContentLoaded", () => {
    // 1. Fungsi untuk load komponen secara dinamis (Injeksi HTML)
    async function loadComponent(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error('Network response was not ok');
            const html = await response.text();
            document.getElementById(elementId).innerHTML = html;
        } catch (error) {
            console.error(`Gagal memuat ${filePath}:`, error);
        }
    }

    // 2. Load Navbar dan Footer, kemudian inisialisasi fungsionalitasnya
    Promise.all([
        loadComponent("navbar-container", "components/navbar.html"),
        loadComponent("footer-container", "components/footer.html")
    ]).then(() => {
        initNavbarFunctions();
        initThemeLogic();
    });

    // 3. Logika Hamburger Menu (Mobile)
    function initNavbarFunctions() {
        const hamburger = document.getElementById("hamburger");
        const navLinks = document.getElementById("nav-links");

        if (hamburger && navLinks) {
            hamburger.addEventListener("click", () => {
                navLinks.classList.toggle("active");
                
                // Animasi icon hamburger menjadi X (opsional)
                hamburger.classList.toggle("toggle");
            });
        }
    }

    // 4. Logika Dark / Light Mode Toggle
    function initThemeLogic() {
        const themeToggleBtn = document.getElementById("theme-toggle");
        const themeIcon = document.getElementById("theme-icon");
        const htmlElement = document.documentElement;

        // Cek preferensi tema sebelumnya yang disimpan di LocalStorage
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            htmlElement.setAttribute("data-theme", savedTheme);
            updateIcon(savedTheme, themeIcon);
        }

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener("click", () => {
                const currentTheme = htmlElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "light" : "dark";
                
                htmlElement.setAttribute("data-theme", newTheme);
                localStorage.setItem("theme", newTheme);
                updateIcon(newTheme, themeIcon);
            });
        }
    }

    function updateIcon(theme, iconElement) {
        if (iconElement) {
            iconElement.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }
});

// Tambahkan baris ini di dalam scope DOMContentLoaded yang sudah ada di app.js
initQuizEngine();

function initQuizEngine() {
    // Definisi Pertanyaan & Skor
    const questions = [
        {
            q: "Jika Anda mendadak sakit dan harus opname seminggu, siapa yang akan membayar tagihannya?",
            options: [
                { text: "Tabungan pribadi / Menjual aset", score: 0 },
                { text: "Kantor tempat saya bekerja", score: 10 },
                { text: "Perusahaan asuransi secara penuh", score: 20 }
            ]
        },
        {
            q: "Berapa bulan pengeluaran harian yang saat ini siap sedia di dalam rekening tabungan darurat Anda?",
            options: [
                { text: "Belum ada / Kurang dari 1 bulan", score: 0 },
                { text: "Sekitar 1 sampai 3 bulan pengeluaran", score: 10 },
                { text: "Sudah aman di atas 6 bulan pengeluaran", score: 20 }
            ]
        },
        {
            q: "Apabila pencari nafkah utama mendadak kehilangan kemampuan bekerja selamanya, bagaimana nasib biaya hidup keluarga?",
            options: [
                { text: "Bingung, belum ada backup dana warisan/jiwa", score: 0 },
                { text: "Mengandalkan bantuan kerabat / Berutang", score: 5 },
                { text: "Aman, sudah disiapkan skenario dana santunan tunai", score: 20 }
            ]
        },
        {
            q: "Bagaimana persiapan Anda menghadapi inflasi biaya rumah sakit yang naik setiap tahun?",
            options: [
                { text: "Pasrah dan berharap selalu sehat", score: 0 },
                { text: "Hanya mengandalkan jaminan kesehatan dasar pemerintah", score: 10 },
                { text: "Memiliki asuransi swasta dengan limit ratusan milyar sesuai tagihan", score: 20 }
            ]
        },
        {
            q: "Apa fokus finansial terbesar yang ingin Anda kunci atau amankan saat ini?",
            options: [
                { text: "Kesehatan keluarga & Biaya rawat inap premium", score: 20, type: "Kesehatan" },
                { text: "Dana pensiun mandiri / Kepastian warisan", score: 20, type: "Jiwa" },
                { text: "Perlindungan sakit kritis agar tabungan tidak lenyap", score: 20, type: "Kritis" }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let totalScore = 0;
    let selectedType = "";

    // DOM Elements
    const startBtn = document.getElementById("start-quiz-btn");
    const quizStart = document.getElementById("quiz-start");
    const quizQuestions = document.getElementById("quiz-questions");
    const quizResult = document.getElementById("quiz-result");
    const questionText = document.getElementById("question-text");
    const quizOptions = document.getElementById("quiz-options");
    const progressBar = document.getElementById("progress-bar");

    if (!startBtn) return; // Mencegah error jika dijalankan di halaman non-quiz

    startBtn.addEventListener("click", () => {
        quizStart.classList.remove("active");
        quizQuestions.classList.add("active");
        showQuestion();
    });

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.q;
        quizOptions.innerHTML = "";

        // Update Progress Bar
        const progressPercent = (currentQuestionIndex / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentQuestion.options.forEach(opt => {
            const button = document.createElement("button");
            button.classList.add("quiz-opt-btn");
            button.textContent = opt.text;
            button.addEventListener("click", () => handleAnswer(opt));
            quizOptions.appendChild(button);
        });
    }

    function handleAnswer(option) {
        totalScore += option.score;
        if (option.type) {
            selectedType = option.type;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showResult();
        }
    }

    function showResult() {
        quizQuestions.classList.remove("active");
        quizResult.classList.add("active");
        
        // Final progress bar ke 100%
        progressBar.style.width = "100%";

        const scoreText = document.getElementById("score-text");
        const resultStatus = document.getElementById("result-status");
        const resultDesc = document.getElementById("result-desc");
        const recProduct = document.getElementById("recommended-product");
        const waShareBtn = document.getElementById("wa-share-btn");

        scoreText.textContent = totalScore;

        let status = "";
        let desc = "";
        let product = "";

        if (totalScore <= 40) {
            status = "🚨 Risiko Finansial Tinggi!";
            desc = "Benteng pertahanan keuangan Anda sangat rentan terhadap guncangan risiko seperti sakit atau kehilangan income.";
            product = "Anda membutuhkan proteksi mendasar segera seperti <strong>PAP (Asuransi Kesehatan)</strong> atau <strong>MCCP (Sakit Kritis)</strong> untuk mencegah tabungan terkuras habis.";
        } else if (totalScore <= 70) {
            status = "⚠️ Perlu Perencanaan Ekstra";
            desc = "Anda sudah memiliki dasar, tetapi masih ada celah bocor yang besar jika terjadi risiko jangka panjang atau inflasi medis.";
            product = "Disarankan untuk melakukan kustomisasi polis fleksibel lewat <strong>MDLA (Dynamic Life)</strong> atau mengunci aset warisan aman via <strong>MDWA</strong>.";
        } else {
            status = "✅ Pertahanan Finansial Baik";
            desc = "Luar biasa! Anda paham pentingnya proteksi. Sekarang waktunya optimasi untuk kenyamanan premium atau ekspansi income.";
            product = "Fasilitas kesehatan premium tingkat dunia seperti <strong>MIUHC</strong> atau melipatgandakan dana pensiun di <strong>MPPS</strong> sangat cocok untuk Anda.";
        }

        resultStatus.textContent = status;
        resultDesc.textContent = desc;
        recProduct.innerHTML = product;

        // Racik Link WhatsApp Hook
        const cleanProductText = product.replace(/<\/?[^>]+(>|$)/g, ""); // Hapus tag strong untuk teks WA
        const message = `Halo Kak Petrus Jakub, saya sudah selesai mengikuti Assessment Keuangan di Website Project Cuan.\n\n*Hasil Analisis Saya:*\nSkor: ${totalScore}/100 (${status})\n\n*Rekomendasi:* ${cleanProductText}\n\nSaya ingin konsultasi gratis untuk mengamankan masa depan saya.`;
        
        waShareBtn.href = `https://wa.me/6287781896087?text=${encodeURIComponent(message)}`;
    }
}

