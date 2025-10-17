console.log("✅ main.js Pilihan Ganda dijalankan");

// 🔹 Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
import { firebaseConfig } from "./firebaseConfig.js";

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil elemen DOM
const namaInput = document.getElementById("namaPemain");
const btnKirim = document.getElementById("mulaiBtn");
const levelSelect = document.getElementById("levelSelect");
const namaContainer = document.getElementById("nama-container");
const kuisContainer = document.getElementById("kuis-container");
const soalText = document.getElementById("pertanyaan");
const pilihanContainer = document.getElementById("pilihan-container");
const skorText = document.getElementById("skor");
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.querySelector("#popupDonasi button");

// 🔹 Variabel game
let namaPemain = "";
let levelDipilih = "agama";
let indexSoal = 0;
let skor = 0;

// 🔹 Fungsi animasi skor
function animasiSkor(nilaiBaru) {
    let nilaiSekarang = parseInt(skorText.textContent.replace('Skor: ', '') || 0);
    const step = 1;
    const interval = setInterval(() => {
        nilaiSekarang += (nilaiBaru > nilaiSekarang ? step : 0);
        skorText.textContent = `Skor: ${nilaiSekarang}`;
        if (nilaiSekarang >= nilaiBaru) clearInterval(interval);
    }, 20);
}

// 🔹 Normalisasi teks (untuk jawaban)
function normalisasi(teks) {
    return teks.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "");
}

// 🔹 Tombol Mulai Kuis
btnKirim.onclick = () => {
    namaPemain = namaInput.value.trim();
    if (!namaPemain) { alert("Isi nama dulu! 🙏"); return; }

    levelDipilih = levelSelect.value;

    // Push data awal pemain ke Firebase
    push(ref(db, "pemain/"), {
        nama: namaPemain,
        level: levelDipilih,
        waktu: new Date().toLocaleString("id-ID")
    }).catch(err => {
        console.error("Gagal kirim data pemain:", err);
        alert("Error: gagal simpan data pemain. Cek console browser.");
    });

    // Tampilkan kuis
    namaContainer.style.display = "none";
    kuisContainer.style.display = "block";
    indexSoal = 0;
    skor = 0;
    skorText.textContent = "Skor: 0";
    tampilkanSoal();
};

// 🔹 Fungsi tampilkan soal pilihan ganda
function tampilkanSoal() {
    const soal = data[levelDipilih][indexSoal];
    if (!soal) {
        soalText.textContent = `🎉 Kuis selesai! Skor akhir Anda: ${skor}. Terima kasih, ${namaPemain}!`;
        pilihanContainer.innerHTML = "";

        // Push skor akhir ke Firebase
        push(ref(db, "skor/"), {
            nama: namaPemain,
            level: levelDipilih,
            skor: skor,
            waktu: new Date().toLocaleString("id-ID")
        }).catch(err => {
            console.error("Gagal kirim skor:", err);
        });
        return;
    }

    soalText.textContent = `Soal ${indexSoal+1}: ${soal.q}`;
    pilihanContainer.innerHTML = "";

    soal.options.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.onclick = () => {
            if (normalisasi(option) === normalisasi(soal.a)) skor += 10;
            animasiSkor(skor);
            indexSoal++;
            setTimeout(tampilkanSoal, 500); // jeda sedikit sebelum soal berikutnya
        };
        pilihanContainer.appendChild(btn);
    });
}

// 🔹 Logika Donasi
donasiBtn.onclick = () => popupDonasi.style.display = "flex";
if (tutupPopup) tutupPopup.onclick = () => popupDonasi.style.display = "none";
window.onclick = (e) => { if (e.target === popupDonasi) popupDonasi.style.display = "none"; };
