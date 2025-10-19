// ===============================
// FIREBASE SETUP
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===============================
// ELEMENT HTML
// ===============================
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

// ===============================
// ANIMASI AWAL
// ===============================
window.addEventListener("load", () => {
  donasiBtn.classList.add("bounce", "pointing");
  donasiBtn.style.opacity = 1;
  document.getElementById("copyright").style.opacity = 1;
});

// ===============================
// MULAI KUIS
// ===============================
mulaiBtn.addEventListener("click", () => {
  const nama = namaInput.value.trim();
  if (nama === "") {
    alert("Masukkan nama kamu dulu, ya!");
    return;
  }

  namaPemain = nama;
  levelDipilih = levelSelect.value;
  indexSoal = 0;
  skor = 0;

  // Simpan data awal pemain ke Firebase
  const pemainRef = ref(db, "pemain");
  push(pemainRef, {
    nama: namaPemain,
    level: levelDipilih,
    waktu: new Date().toLocaleString("id-ID"),
    skor: 0 // nilai awal 0, nanti diupdate setelah selesai
  });

  // Tampilkan kuis
  document.getElementById("nama-container").style.display = "none";
  kuisContainer.style.display = "block";

  // Tampilkan nama pemain
  const namaTampil = document.getElementById("namaPemainTampil");
  if (namaTampil) namaTampil.textContent = `👤 Pemain: ${namaPemain}`;

  mulaiKuis();
});

// ===============================
// FUNGSI MENAMPILKAN SOAL
// ===============================
function mulaiKuis() {
  const soalSekarang = data[levelDipilih][indexSoal];
  soalText.textContent = soalSekarang.q;

  pilihanContainer.innerHTML = "";
  soalSekarang.options.forEach((opsi) => {
    const tombol = document.createElement("button");
    tombol.textContent = opsi;
    tombol.addEventListener("click", () => periksaJawaban(opsi, soalSekarang.a));
    pilihanContainer.appendChild(tombol);
  });

  skorText.textContent = `Skor: ${skor}`;
}

// ===============================
// PERIKSA JAWABAN
// ===============================
function periksaJawaban(jawaban, kunci) {
  const benar = jawaban === kunci;

  if (benar) {
    skor += 10;
    hasilFeedback.textContent = "✅ Jawaban Benar!";
    hasilFeedback.className = "correct";
    audioCorrect.play();
    document.dispatchEvent(new CustomEvent("answerResult", { detail: { correct: true } }));
  } else {
    hasilFeedback.textContent = `❌ Salah! Jawaban benar: ${kunci}`;
    hasilFeedback.className = "wrong";
    audioWrong.play();
    document.dispatchEvent(new CustomEvent("answerResult", { detail: { correct: false } }));
  }

  skorText.textContent = `Skor: ${skor}`;

  // Tunggu 1 detik lalu lanjut soal berikutnya
  setTimeout(() => {
    indexSoal++;
    if (indexSoal < data[levelDipilih].length) {
      hasilFeedback.textContent = "";
      mulaiKuis();
    } else {
      selesaiKuis();
    }
  }, 1000);
}

// ===============================
// SELESAI KUIS
// ===============================
function selesaiKuis() {
  soalText.textContent = `🎉 Kuis selesai!`;
  pilihanContainer.innerHTML = "";
  hasilFeedback.textContent = `Selamat ${namaPemain}! Skor akhir kamu: ${skor}`;
  hasilFeedback.className = "correct";

  // Simpan skor akhir ke Firebase
  const hasilRef = ref(db, "hasil");
  push(hasilRef, {
    nama: namaPemain,
    level: levelDipilih,
    skor: skor,
    waktu: new Date().toLocaleString("id-ID")
  });
}

// ===============================
// POPUP DONASI
// ===============================
donasiBtn.addEventListener("click", () => {
  popupDonasi.style.display = "flex";
});
tutupPopup.addEventListener("click", () => {
  popupDonasi.style.display = "none";
});
