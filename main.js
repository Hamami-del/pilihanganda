console.log("✅ main.js berhasil dijalankan");

// Impor modul ES6 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
// Catatan: Jika Anda menyimpan firebaseConfig di file terpisah (firebaseConfig.js), Anda harus mengimpornya.
// Jika tidak, biarkan di sini. Saya asumsikan Anda ingin menggunakannya di sini.

const firebaseConfig = {
  apiKey: "AIzaSyB35RYpFoHPFOFbQhr6rtbAWiWdGbta0I4",
  authDomain: "kuis-hamami.firebaseapp.com",
  databaseURL: "https://kuis-hamami-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuis-hamami",
  storageBucket: "kuis-hamami.firebasestorage.app",
  messagingSenderId: "955115071133",
  appId: "1:955115071133:web:c42d2f365082c74bf39674"
};

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil elemen DOM (SESUAIKAN DENGAN INDEX.HTML BARU)
const namaContainer = document.getElementById("nama-container");
const namaInput = document.getElementById("namaPemain");
const mulaiBtn = document.getElementById("mulaiBtn"); // Tombol mulai (dulu btnKirim)
const levelSelect = document.getElementById("levelSelect"); // Pilihan mapel
const kuisContainer = document.getElementById("kuis-container"); // Kontainer kuis (dulu kuisContainer)
const soalText = document.getElementById("soalText"); // Tempat teks soal
const jawabanInput = document.getElementById("jawabanInput"); // Input jawaban
const btnJawab = document.getElementById("btnJawab"); // Tombol jawab
const hasil = document.getElementById("hasil"); // Feedback benar/salah
const skorText = document.getElementById("skorText"); // Tempat skor (dulu skorText)
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup"); // Tombol tutup popup

let namaPemain = "";
let indexSoal = 0;
let levelDipilih = "agama"; // Default awal
let skor = 0;

// 🔹 Fungsi Normalisasi (penting untuk jawaban isian)
function normalisasi(teks) {
  // Menghilangkan spasi, mengubah huruf kecil, menghapus tanda baca kecuali spasi
  return teks.toLowerCase().trim().replace(/[^\w\s]/g, ""); 
}

// 🔹 Fungsi Animasi Skor
function animasiSkor(nilaiBaru) {
  let nilaiSekarang = parseInt(skorText.textContent.replace('Skor: ', '') || 0); // Ambil nilai numerik
  const step = nilaiBaru > nilaiSekarang ? 10 : (nilaiBaru < nilaiSekarang ? -10 : 0);
  const interval = setInterval(() => {
    nilaiSekarang += step;
    skorText.textContent = `Skor: ${nilaiSekarang}`;
    if (nilaiSekarang === nilaiBaru) clearInterval(interval);
  }, 30);
}

// -------------------------------------------------------------------------
// 🔹 LOGIKA KUIS
// -------------------------------------------------------------------------

// 🔹 Saat klik tombol "Mulai"
mulaiBtn.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;

  if (namaPemain === "") {
    alert("Isi nama dulu, ya! 🙏");
    return;
  }

  // Kirim data ke Firebase (nama dan pelajaran)
  push(ref(db, "pemain/"), {
    nama: namaPemain,
    level: levelDipilih,
    waktu: new Date().toLocaleString("id-ID")
  });

  // Sembunyikan form, tampilkan kuis
  namaContainer.style.display = "none"; // Gunakan nama container yang benar
  kuisContainer.style.display = "block";

  // Reset progres
  indexSoal = 0;
  skor = 0;
  skorText.textContent = "Skor: 0"; // Pastikan formatnya sama

  tampilkanSoal();
};

// 🔹 Fungsi tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];

  if (!soal || soal.length === 0) {
    soalText.textContent = "❌ Tidak ada soal untuk mata pelajaran ini.";
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
    return;
  }

  if (indexSoal >= soal.length) {
    soalText.textContent = `🎉 Kuis selesai! Skor akhir Anda: ${skor}. Terima kasih, ${namaPemain}!`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
    hasil.textContent = "";
    return;
  }
  
  // Tampilkan input dan tombol lagi jika sebelumnya disembunyikan
  jawabanInput.style.display = "block";
  btnJawab.style.display = "block";

  soalText.textContent = `Soal ${indexSoal + 1}: ${soal[indexSoal].q}`;
  hasil.textContent = "";
  jawabanInput.value = "";
  jawabanInput.focus(); // Fokus ke input untuk kemudahan pengguna
}

// 🔹 Saat jawab soal
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawabanPemain = normalisasi(jawabanInput.value);
  const jawabanBenar = normalisasi(soal[indexSoal].a);

  // Hapus class lama
  hasil.classList.remove("benar", "salah");

  if (jawabanPemain === jawabanBenar) {
    hasil.textContent = "✅ Benar!";
    hasil.classList.add("benar");
    skor += 10;
    animasiSkor(skor);
  } else {
    hasil.textContent = `❌ Salah! Jawaban yang benar adalah: ${soal[indexSoal].a}`;
    hasil.classList.add("salah");
  }

  // Lanjut ke soal berikutnya setelah jeda singkat
  indexSoal++;
  setTimeout(tampilkanSoal, 1200); // Jeda 1.2 detik agar pengguna bisa melihat feedback
};

// -------------------------------------------------------------------------
// 🔹 LOGIKA DONASI
// -------------------------------------------------------------------------

// 🔹 Tombol Donasi
donasiBtn.onclick = () => {
  popupDonasi.style.display = "flex";
};

// 🔹 Tutup popup (Menggunakan ID #tutupPopup)
tutupPopup.onclick = () => {
  popupDonasi.style.display = "none";
};

// 🔹 Tutup popup kalau klik di luar kotak
window.onclick = (e) => {
  if (e.target === popupDonasi) popupDonasi.style.display = "none";
};
