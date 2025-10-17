console.log("✅ main.js berhasil dijalankan");

// Menggunakan import modul ES6
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
import { firebaseConfig } from "./firebaseConfig.js"; // <-- AMBIL DARI FILE TERPISAH

// 🔹 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Ambil elemen DOM (DISINKRONKAN DENGAN index.html FINAL)
const namaContainer = document.getElementById("nama-container"); 
const namaInput = document.getElementById("namaInput"); // ID yang sudah diperbaiki di HTML
const btnKirim = document.getElementById("btnKirim");    // ID yang sudah diperbaiki di HTML
const kuisContainer = document.getElementById("kuis-container"); // ID yang benar di HTML Anda
const soalText = document.getElementById("pertanyaan"); 
const jawabanInput = document.getElementById("jawabanInput");
const btnJawab = document.getElementById("btnJawab");
const hasil = document.getElementById("hasil");
const levelSelect = document.getElementById("levelSelect"); // ID yang sudah ditambahkan
const skorText = document.getElementById("skor"); 
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.querySelector("#popupDonasi button"); 

let namaPemain = "";
let indexSoal = 0;
let levelDipilih = (levelSelect && levelSelect.value) ? levelSelect.value : "agama";
let skor = 0;

// 🔹 Normalisasi teks
function normalisasi(teks) {
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
// 🔹 LOGIKA UTAMA: Kirim Data dan Mulai Kuis
// -------------------------------------------------------------------------

// 🔹 Saat klik tombol "Mulai Kuis" (btnKirim)
btnKirim.onclick = () => {
  namaPemain = namaInput.value.trim();
  if (levelSelect) {
      levelDipilih = levelSelect.value;
  }

  if (namaPemain === "") {
    alert("Isi nama dulu, ya! 🙏");
    return;
  }

  // >>>>>> PENGIRIMAN DATA KE FIREBASE <<<<<<
  push(ref(db, "pemain/"), { 
    nama: namaPemain,
    level: levelDipilih,
    waktu: new Date().toLocaleString("id-ID")
  }).catch((error) => {
      // Tambahkan logging untuk melihat error di konsol browser
      console.error("Gagal mengirim data ke Firebase:", error);
      alert("Error: Gagal menyimpan data pemain. Cek konsol browser.");
  });
  // >>>>>> END OF PENGIRIMAN DATA <<<<<<

  namaContainer.style.display = "none"; 
  kuisContainer.style.display = "block";

  indexSoal = 0;
  skor = 0;
  skorText.textContent = "Skor: 0"; 

  tampilkanSoal();
};

// -------------------------------------------------------------------------
// 🔹 FUNGSI KUIS ISIAN
// -------------------------------------------------------------------------

// Fungsi tampilkan soal
function tampilkanSoal() {
  const soal = data[levelDipilih];

  if (!soal || soal.length === 0) {
    soalText.textContent = `❌ Tidak ada soal untuk mata pelajaran ${levelDipilih.toUpperCase()}.`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
    return;
  }
  // ... (Logika tampilkan soal dan kuis selesai) ...

  if (indexSoal >= soal.length) {
    soalText.textContent = `🎉 Kuis selesai! Skor akhir Anda: ${skor}. Terima kasih, ${namaPemain}!`;
    jawabanInput.style.display = "none";
    btnJawab.style.display = "none";
    hasil.textContent = "";
    return;
  }
  
  jawabanInput.style.display = "block";
  btnJawab.style.display = "block";
  
  soalText.textContent = `Soal ${indexSoal + 1}: ${soal[indexSoal].q}`;
  hasil.textContent = "";
  jawabanInput.value = "";
  jawabanInput.focus();
}

// Saat jawab soal
btnJawab.onclick = () => {
  const soal = data[levelDipilih];
  const jawabanPemain = normalisasi(jawabanInput.value);
  const jawabanBenar = normalisasi(soal[indexSoal].a);

  hasil.classList.remove("benar", "salah");
  btnJawab.disabled = true;

  if (jawabanPemain === jawabanBenar) {
    hasil.textContent = "✅ Benar!";
    hasil.classList.add("benar");
    skor += 10;
    animasiSkor(skor);
  } else {
    hasil.textContent = `❌ Salah! Jawaban yang benar adalah: ${soal[indexSoal].a}`;
    hasil.classList.add("salah");
  }

  indexSoal++;
  
  setTimeout(() => {
    btnJawab.disabled = false;
    tampilkanSoal();
  }, 1500); 
};

// -------------------------------------------------------------------------
// 🔹 LOGIKA DONASI
// -------------------------------------------------------------------------

donasiBtn.onclick = () => {
  popupDonasi.style.display = "flex";
};

if (tutupPopup) {
  tutupPopup.onclick = () => {
    popupDonasi.style.display = "none";
  };
}

window.onclick = (e) => {
  if (e.target === popupDonasi) popupDonasi.style.display = "none";
};
