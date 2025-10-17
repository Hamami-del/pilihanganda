import { data } from "./soal.js";

// 🔹 Ambil elemen DOM (Lama)
const namaContainer = document.getElementById("nama-container");
const namaInput = document.getElementById("namaPemain");
const mulaiBtn = document.getElementById("mulaiBtn");
const levelSelect = document.getElementById("levelSelect"); 
const kuisContainer = document.getElementById("kuis-container");
const pertanyaanText = document.getElementById("pertanyaan");
const pilihanContainer = document.getElementById("pilihan-container");
const hasilFeedback = document.getElementById("hasil-feedback");
const skorText = document.getElementById("skor");
const nextBtn = document.getElementById("nextBtn");

// 🔹 Ambil elemen DOM (Donasi)
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup");

// 🔹 Ambil elemen DOM (Audio - BARU)
const audioCorrect = document.getElementById("audioCorrect");
const audioWrong = document.getElementById("audioWrong");

// 🔹 Variabel global
let namaPemain = "";
let indexSoal = 0;
let levelDipilih = ""; 
let skor = 0;

// 🔹 Fungsi untuk mengacak array (tetap sama)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[i], array[j]];
    }
}

// -------------------------------------------------------------------------
// 🔹 LOGIKA KUIS
// -------------------------------------------------------------------------

// 🔹 Saat klik tombol "Mulai Kuis" (tetap sama)
mulaiBtn.onclick = () => {
  namaPemain = namaInput.value.trim();
  levelDipilih = levelSelect.value;
  
  if (namaPemain === "") {
    alert("Mohon isi nama Anda untuk memulai kuis. 🙏");
    return;
  }

  namaContainer.style.display = "none";
  kuisContainer.style.display = "block";

  indexSoal = 0;
  skor = 0;
  skorText.textContent = "Skor: 0";
  hasilFeedback.textContent = "";

  tampilkanSoal();
};

// 🔹 Fungsi tampilkan soal (tetap sama)
function tampilkanSoal() {
  const soal = data[levelDipilih];

  if (!soal || soal.length === 0) {
    pertanyaanText.textContent = "❌ Tidak ada soal untuk mata pelajaran ini.";
    pilihanContainer.innerHTML = "";
    nextBtn.style.display = "none";
    return;
  }

  if (indexSoal >= soal.length) {
    pertanyaanText.textContent = `🎉 Kuis selesai! Skor akhir Anda: ${skor}. Terima kasih, ${namaPemain}!`;
    pilihanContainer.innerHTML = "";
    nextBtn.style.display = "none";
    hasilFeedback.textContent = "";
    return;
  }

  const currentSoal = soal[indexSoal];

  pertanyaanText.textContent = `Soal ${indexSoal + 1}: ${currentSoal.q}`;
  pilihanContainer.innerHTML = ""; 
  hasilFeedback.textContent = ""; 
  nextBtn.style.display = "none";

  shuffleArray(currentSoal.options);

  if (currentSoal.options) {
      currentSoal.options.forEach(pilihan => {
          const button = document.createElement("button");
          button.textContent = pilihan;
          button.setAttribute("data-jawaban", pilihan);
          button.onclick = () => cekJawaban(button, currentSoal.a);
          pilihanContainer.appendChild(button);
      });
  }
}

// 🔹 Fungsi cek jawaban (MODIFIKASI AUDIO)
function cekJawaban(tombolYangDiklik, jawabanBenar) {
  
  // Matikan semua tombol pilihan setelah menjawab
  Array.from(pilihanContainer.children).forEach(btn => {
      btn.disabled = true;
      btn.style.cursor = 'default';
  });

  const jawabanPemain = tombolYangDiklik.getAttribute("data-jawaban");
  hasilFeedback.classList.remove("correct", "wrong");

  if (jawabanPemain === jawabanBenar) {
      // 🔊 Mainkan suara benar
      audioCorrect.currentTime = 0; // Reset audio jika sedang dimainkan
      audioCorrect.play();
      
      hasilFeedback.textContent = "✅ Jawaban Anda Benar!";
      hasilFeedback.classList.add("correct");
      tombolYangDiklik.style.backgroundColor = "#28a745"; 
      skor += 10;
      skorText.textContent = `Skor: ${skor}`;
  } else {
      // 🔊 Mainkan suara salah
      audioWrong.currentTime = 0; // Reset audio jika sedang dimainkan
      audioWrong.play();
      
      hasilFeedback.textContent = `❌ Jawaban Salah! Jawaban yang benar adalah: ${jawabanBenar}`;
      hasilFeedback.classList.add("wrong");
      tombolYangDiklik.style.backgroundColor = "#dc3545"; 
      
      const tombolBenar = Array.from(pilihanContainer.children).find(btn => btn.getAttribute("data-jawaban") === jawabanBenar);
      if(tombolBenar) tombolBenar.style.backgroundColor = "#28a745";
  }
  nextBtn.style.display = "block";
}

// 🔹 Saat klik tombol "Soal Berikutnya" (tetap sama)
nextBtn.onclick = () => {
  indexSoal++;
  tampilkanSoal();
};

// -------------------------------------------------------------------------
// 🔹 LOGIKA POPUP DONASI (tetap sama)
// -------------------------------------------------------------------------

// 🔹 Saat klik tombol "Donasi"
donasiBtn.onclick = () => {
  popupDonasi.style.display = "flex";
};

// 🔹 Saat klik tombol "Tutup" di dalam popup
tutupPopup.onclick = () => {
  popupDonasi.style.display = "none";
};

// 🔹 Saat klik di luar kotak popup, popup tertutup (opsional)
window.onclick = (event) => {
  if (event.target === popupDonasi) {
    popupDonasi.style.display = "none";
  }
};
