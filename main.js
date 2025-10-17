console.log("✅ main.js berhasil dijalankan");

// Mengimpor dari file terpisah
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
// Mengimpor konfigurasi dari file firebaseConfig.js (Asumsi: file ini ada)
import { firebaseConfig } from "./firebaseConfig.js"; 

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil elemen DOM (SUDAH DISINKRONKAN DENGAN index.html BARU)
const namaContainer = document.getElementById("nama-container"); // <-- FIX 1: Variabel untuk kontainer utama
const namaInput = document.getElementById("namaInput");
const btnKirim = document.getElementById("btnKirim"); // Tombol Mulai
const kuisContainer = document.getElementById("kuisContainer");
const soalText = document.getElementById("soalText");
const jawabanInput = document.getElementById("jawabanInput");
const btnJawab = document.getElementById("btnJawab");
const hasil = document.getElementById("hasil");
const levelSelect = document.getElementById("levelSelect"); // Pilihan Mapel
const skorText = document.getElementById("skorText");
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup");

// 🔹 Variabel global
let namaPemain = "";
let indexSoal = 0;
let levelDipilih = "agama";
let skor = 0;

// 🔹 Normalisasi teks (penting untuk jawaban isian)
function normalisasi(teks) {
  // Menghilangkan spasi, mengubah huruf kecil, menghapus tanda baca kecuali spasi
  return teks.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, ""); 
}

// 🔹 Animasi skor
function animasiSkor(nilaiBaru) {
  let nilaiSekarang = parseInt(skorText.textContent.replace('Skor: ', '') || 0);
  const step = 1; 
  const interval = setInterval(() => {
    nilaiSekarang += (nilaiBaru > nilaiSekarang ? step : 0);
    skorText.textContent = `Skor: ${nilaiSekarang}`;
    if (nilaiSekarang >= nilaiBaru) {
      clearInterval(interval);
      skorText.textContent = `Skor: ${nilaiBaru}`;
    }
  }, 30);
}

// -------------------------------------------------------------------------
// 🔹 LOGIKA KUIS
// -------------------------------------------------------------------------

// 🔹 Saat klik tombol "Mulai Kuis"
btnKirim.onclick = () => {
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

  // FIX 2: Sembunyikan form menggunakan variabel yang benar
  namaContainer.style.display = "none"; 
  kuisContainer.style.display = "block";

  // Reset progres
  indexSoal = 0;
  skor = 0;
  skorText.textContent = "Skor: 0"; 

  tampilkanSoal();
};

// 🔹 Fungsi tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];

  if (!soal || soal.length === 0) {
    soalText.textContent = `❌ Tidak ada soal untuk mata pelajaran ${levelDipilih.toUpperCase()}.`;
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
  
  // Tampilkan UI kuis
  jawabanInput.style.display = "block";
  btnJawab.style.display = "block";
  
  soalText.textContent = `Soal ${indexSoal + 1}: ${soal[indexSoal].q}`;
  hasil.textContent = "";
  jawabanInput.value = "";
  jawabanInput.focus();
}

// 🔹 Saat jawab soal
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawabanPemain = normalisasi(jawabanInput.value);
  const jawabanBenar = normalisasi(soal[indexSoal].a);

  // Hapus class lama
  hasil.classList.remove("benar", "salah");

  // Matikan tombol Jawab sementara
  btnJawab.disabled = true;

  if (jawabanPemain === jawabanBenar) {
    hasil.textContent = "✅ Benar!";
    hasil.classList.add("benar");
    skor += 10;
    animasiSkor(skor);
  } else {
    hasil.textContent = `❌ Salah! Jawaban yang benar adalah: ${soal[indexSoal].a}`;
    hasil.classList.add("salah");
    // Karena skor Anda menggunakan animasi, skor tidak berkurang, hanya tidak bertambah.
  }

  indexSoal++;
  
  setTimeout(() => {
    btnJawab.disabled = false; // Aktifkan lagi tombol Jawab
    tampilkanSoal(); // Lanjut ke soal berikutnya
  }, 1500); // Jeda 1.5 detik agar pengguna bisa melihat feedback
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
