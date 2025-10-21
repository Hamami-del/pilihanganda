import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { data } from "./soal.js";
import { firebaseConfig } from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const namaInput = document.getElementById("namaPemain");
const mulaiBtn = document.getElementById("mulaiBtn");
const levelSelect = document.getElementById("levelSelect");
const kuisContainer = document.getElementById("kuis-container");
const soalText = document.getElementById("pertanyaan");
const pilihanContainer = document.getElementById("pilihan-container");
const hasilFeedback = document.getElementById("hasil-feedback");
const skorText = document.getElementById("skor");
const selesaiBtn = document.getElementById("selesaiBtn");
const audioCorrect = document.getElementById("audioCorrect");
const audioWrong = document.getElementById("audioWrong");

let namaPemain = "";
let levelDipilih = "agama";
let indexSoal = 0;
let skor = 0;
let soalAcak = [];

mulaiBtn.addEventListener("click", () => {
  const nama = namaInput.value.trim();
  if (!nama) return alert("Masukkan nama kamu dulu, ya!");

  namaPemain = nama;
  levelDipilih = levelSelect.value;
  indexSoal = 0;
  skor = 0;
  soalAcak = acakArray([...data[levelDipilih]]);

  const pemainRef = ref(db, "pemain");
  push(pemainRef, { nama, level: levelDipilih, waktu: new Date().toLocaleString("id-ID"), skor: 0 });

  document.getElementById("nama-container").style.display = "none";
  kuisContainer.style.display = "block";
  tampilkanSoal();
});

function acakArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function tampilkanSoal() {
  const soalSekarang = soalAcak[indexSoal];
  soalText.textContent = soalSekarang.q;
  pilihanContainer.innerHTML = "";
  soalSekarang.options.forEach((opsi) => {
    const btn = document.createElement("button");
    btn.textContent = opsi;
    btn.onclick = () => periksaJawaban(opsi, soalSekarang.a);
    pilihanContainer.appendChild(btn);
  });
  skorText.textContent = `Skor: ${skor}`;
}

function periksaJawaban(jawaban, kunci) {
  const benar = jawaban === kunci;
  const udin = document.getElementById("udin");
  const mouth = document.getElementById("mouth");

  if (benar) {
    skor += 10;
    hasilFeedback.textContent = "✅ Benar!";
    hasilFeedback.className = "correct";
    audioCorrect.play();
    udin.classList.add("happy");
    udin.classList.remove("sad");
    mouth.setAttribute("d", "M80 106 Q100 132 120 106");
  } else {
    hasilFeedback.textContent = `❌ Salah! Jawaban: ${kunci}`;
    hasilFeedback.className = "wrong";
    audioWrong.play();
    udin.classList.add("sad");
    udin.classList.remove("happy");
    mouth.setAttribute("d", "M80 118 Q100 98 120 118");
  }

  skorText.textContent = `Skor: ${skor}`;

  setTimeout(() => {
    udin.classList.remove("happy", "sad");
    mouth.setAttribute("d", "M80 110 Q100 120 120 110");
    indexSoal++;
    if (indexSoal < soalAcak.length) tampilkanSoal();
    else selesaiKuis();
  }, 1200);
}

function selesaiKuis() {
  soalText.textContent = `🎉 Kuis selesai!`;
  pilihanContainer.innerHTML = "";
  hasilFeedback.textContent = `Selamat ${namaPemain}! Skor akhir kamu: ${skor}`;
  hasilFeedback.className = "correct";
  const hasilRef = ref(db, "hasil");
  push(hasilRef, {
    nama: namaPemain,
    level: levelDipilih,
    skor,
    waktu: new Date().toLocaleString("id-ID"),
  });
}

selesaiBtn.addEventListener("click", () => {
  if (confirm("Apakah kamu yakin ingin mengakhiri kuis sekarang?")) selesaiKuis();
});
