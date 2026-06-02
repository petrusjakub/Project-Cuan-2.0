// Array untuk menyimpan jawaban kandidat
let userAnswers = [];
const totalSlides = 4; // Total slide kuis (dari 0 sampai 4)

function nextSlide(slideIndex, answerText = '') {
    // Simpan jawaban jika kandidat memilih opsi (bukan tombol 'Mulai')
    if (answerText !== '') {
        userAnswers.push(answerText);
    }

    // Sembunyikan semua slide yang sedang aktif
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // Tampilkan slide yang dituju
    const targetSlide = document.getElementById('slide-' + slideIndex);
    if(targetSlide) {
        targetSlide.classList.add('active');
    }

    // Mengatur Progress Bar
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');

    if (slideIndex > 0 && slideIndex < totalSlides) {
        progressContainer.style.display = 'block';
        // Hitung persentase progress
        const progressPercentage = (slideIndex / (totalSlides - 1)) * 100;
        progressBar.style.width = progressPercentage + '%';
    } else if (slideIndex === totalSlides) {
        // Jika sampai di slide terakhir, sembunyikan progress bar & buat link WA
        progressContainer.style.display = 'none';
        generateWALink();
    }
}

function generateWALink() {
    const waBtn = document.getElementById('wa-btn');
    
    // Ganti dengan nomor WA Pak Petrus (Format: 628...)
    let baseURL = "https://wa.me/6287781896087?text=";
    
    // Header Pesan
    let message = "Halo Pak Petrus, aku udah isi kuisnya dan tertarik mau ngobrol soal peluang bisnis di BMI.\n\n";

    // Sisipkan hasil jawaban user ke dalam pesan WA
    if(userAnswers.length > 0) {
        message += "Ini kondisiku sekarang:\n";
        userAnswers.forEach((ans, index) => {
            message += `${index + 1}. ${ans}\n`;
        });
        message += "\nKira-kira kapan kita bisa ngobrol santai?";
    }
    
    // Gabungkan URL dengan pesan yang sudah di-encode agar aman untuk URL
    waBtn.href = baseURL + encodeURIComponent(message);
}
