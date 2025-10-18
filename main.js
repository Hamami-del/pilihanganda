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
const donasiBtn = document.getElementById("donasiBtn");
const popupDonasi = document.getElementById("popupDonasi");
const tutupPopup = document.getElementById("tutupPopup");
const audioCorrect = document.getElementById("audioCorrect");
const audioWrong = document.getElementById("audioWrong");

let namaPemain="", levelDipilih="agama", indexSoal=0, skor=0;

// Animasi tombol donasi
window.addEventListener("load", ()=>{
    donasiBtn.classList.add("bounce","pointing");
    donasiBtn.style.opacity=1;
    document.getElementById("copyright").style.opacity=1;
});

// Mulai kuis
mulaiBtn.onclick = ()=>{
    namaPemain = namaInput.value.trim();
    levelDipilih = levelSelect.value;
    if(!namaPemain){ alert("Isi nama dulu!"); return; }

    push(ref(db,"pemain/"),{
        nama:namaPemain, level:levelDipilih, waktu:new Date().toLocaleString("id-ID")
    }).catch(err=>{console.error("Gagal kirim:",err); alert("Error kirim data");});

    document.getElementById("nama-container").style.display="none";
    kuisContainer.style.display="block";
    indexSoal=0; skor=0; skorText.textContent=`Skor: ${skor}`;
    tampilkanSoal();
};

// Tampilkan soal
function tampilkanSoal(){
    const soalList = data[levelDipilih];
    if(!soalList || indexSoal>=soalList.length){
        soalText.textContent=`🎉 Kuis selesai! Skor: ${skor}, ${namaPemain}`;
        pilihanContainer.innerHTML="";
        return;
    }
    soalText.textContent=`Soal ${indexSoal+1}: ${soalList[indexSoal].q}`;
    pilihanContainer.innerHTML="";
    hasilFeedback.textContent="";

    soalList[indexSoal].options.forEach(opt=>{
        const btn = document.createElement("button");
        btn.textContent=opt;
        btn.onclick = ()=>cekJawaban(opt);
        pilihanContainer.appendChild(btn);
    });
}

// Cek jawaban
function cekJawaban(jawaban){
    const soalBenar = data[levelDipilih][indexSoal].a;
    if(jawaban.toLowerCase()===soalBenar.toLowerCase()){
        hasilFeedback.textContent="✅ Benar!";
        hasilFeedback.className="correct";
        skor+=10;
        skorText.textContent=`Skor: ${skor}`;
        audioCorrect.play();
    } else{
        hasilFeedback.textContent=`❌ Salah! Jawaban benar: ${soalBenar}`;
        hasilFeedback.className="wrong";
        audioWrong.play();
    }
    indexSoal++;
    setTimeout(tampilkanSoal,1500);
}
// ==== FITUR BAGIKAN KE WHATSAPP ====
document.addEventListener("DOMContentLoaded", () => {
  const shareBtn = document.getElementById("shareBtn");
  const skorElem = document.getElementById("skor");

  if (shareBtn && skorElem) {
    shareBtn.addEventListener("click", () => {
      // Ambil angka skor dari elemen #skor
      const skorText = skorElem.innerText.replace("Skor: ", "").trim();

      // Pesan WhatsApp
      const pesan = `Aku baru saja memainkan *Kuis Hamami!* 🧠\nSkorku: ${skorText} 🎯\n\nCoba kamu bisa lebih tinggi gak?\nMainkan di sini 👉 ${window.location.href}`;

      // Buat URL dan buka WhatsApp (lebih aman dari popup blocker)
      const url = `https://wa.me/?text=${encodeURIComponent(pesan)}`;
      window.location.href = url;
    });
  }
});


// Popup donasi
donasiBtn.onclick=()=>{ popupDonasi.style.display="flex"; }
tutupPopup.onclick=()=>{ popupDonasi.style.display="none"; }
window.onclick=(e)=>{ if(e.target===popupDonasi) popupDonasi.style.display="none"; }

// ===== Star & Particle =====
const starsDiv = document.getElementById("stars");
for(let i=0;i<50;i++){
    const star=document.createElement("div");
    star.className="star"; star.style.top=Math.random()*100+"%";
    star.style.left=Math.random()*100+"%";
    star.style.width=star.style.height=Math.random()*3+2+"px";
    star.style.animationDuration=2+Math.random()*3+"s";
    starsDiv.appendChild(star);
}

const particlesDiv=document.getElementById("particles");
for(let i=0;i<30;i++){
    const p=document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"%";
    p.style.width=p.style.height=Math.random()*4+2+"px";
    p.style.animationDuration=5+Math.random()*5+"s";
    p.style.animationDelay=Math.random()*5+"s";
    particlesDiv.appendChild(p);
}


