console.log("✅ main.js berhasil dijalankan");

// Import Firebase & data soal
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Ambil elemen DOM
const namaInput = document.getElementById("namaPemain");
const mulaiBtn = document.getElementById("mulaiBtn");
const levelSelect = document.getElementById("levelSelect");
const kuisContainer = document.getElementById("kuis-container");
const soalText = document.getElementById("pertanyaan");
const pilihanContainer = document.getElementById("pilihan-container");
const hasilFeedback = document.getElementById("hasil-feedback");
const skorText = document.getElementById("skor");
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup");
const audioCorrect = document.getElementById("audioCorrect");
const audioWrong = document.getElementById("audioWrong");

let namaPemain = "";
let levelDipilih = "agama";
let indexSoal = 0;
let skor = 0;

// --------------------------------------
// Animasi fade-in & bounce tombol Donasi
window.addEventListener("load", () => {
    donasiBtn.classList.add("bounce");
    donasiBtn.style.transition = "opacity 1s";
    document.getElementById("copyright").style.transition = "opacity 1s";
    setTimeout(() => {
        donasiBtn.style.opacity = 1;
        document.getElementById("copyright").style.opacity = 1;
    }, 100);
});

// --------------------------------------
// Mulai Kuis
mulaiBtn.addEventListener("click", () => {
    namaPemain = namaInput.value.trim();
    levelDipilih = levelSelect.value;

    if (!namaPemain) {
        alert("Isi nama dulu, ya! 🙏");
        return;
    }

    // Kirim data ke Firebase
    push(ref(db,"pemain/"),{
        nama: namaPemain,
        level: levelDipilih,
        waktu: new Date().toLocaleString("id-ID")
    }).catch(err=>{ console.error("Gagal kirim data:",err); alert("Error kirim data. Cek console.") });

    document.getElementById("nama-container").style.display = "none";
    kuisContainer.style.display = "block";

    indexSoal = 0; skor = 0; skorText.textContent = `Skor: ${skor}`;
    tampilkanSoal();
});

// --------------------------------------
// Fungsi menampilkan soal
function tampilkanSoal() {
    const soalList = data[levelDipilih];
    if (!soalList || indexSoal >= soalList.length) {
        soalText.textContent = `🎉 Kuis selesai! Skor akhir: ${skor}. Terima kasih, ${namaPemain}!`;
        pilihanContainer.innerHTML = "";
        return;
    }

    const soal = soalList[indexSoal];
    soalText.textContent = `Soal ${indexSoal+1}: ${soal.q}`;
    pilihanContainer.innerHTML = "";

    soal.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.onclick = () => checkJawaban(opt, soal.a);
        pilihanContainer.appendChild(btn);
    });
}

// --------------------------------------
// Fungsi cek jawaban
function checkJawaban(jawaban, jawabanBenar) {
    if (jawaban === jawabanBenar) {
        hasilFeedback.textContent = "✅ Benar!";
        hasilFeedback.className = "correct";
        skor += 10;
        audioCorrect.play();
    } else {
        hasilFeedback.textContent = `❌ Salah! Jawaban: ${jawabanBenar}`;
        hasilFeedback.className = "wrong";
        audioWrong.play();
    }
    skorText.textContent = `Skor: ${skor}`;

    // Delay tampil soal berikutnya
    indexSoal++;
    setTimeout(() => tampilkanSoal(), 1500);
}

// --------------------------------------
// Popup donasi
donasiBtn.onclick = () => popupDonasi.style.display = "flex";
tutupPopup.onclick = () => popupDonasi.style.display = "none";
window.onclick = e => { if(e.target === popupDonasi) popupDonasi.style.display = "none"; };
