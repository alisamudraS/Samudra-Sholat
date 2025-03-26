const cariBtn = document.getElementById('cariBtn');
const output = document.getElementById('output');
const inputTanggal = document.getElementById('tanggal');
const toggleBtn = document.getElementById('toggleAudio');
const audio = document.getElementById('bg-audio');

let lokasi = { lat: null, long: null };

// Cek Ramadan
function isRamadan(tanggal) {
  const tgl = new Date(tanggal);
  return tgl >= new Date("2025-03-10") && tgl <= new Date("2025-04-09");
}

// Dapatkan lokasi pengguna
function getLokasi() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        lokasi.lat = pos.coords.latitude;
        lokasi.long = pos.coords.longitude;
        resolve();
      },
      err => {
        alert("Gagal mendeteksi lokasi");
        reject(err);
      }
    );
  });
}

// Ambil data dari API
async function getJadwal(tanggal) {
  const dateObj = new Date(tanggal);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lokasi.lat}&longitude=${lokasi.long}&method=2`;

  const res = await fetch(url);
  const data = await res.json();
  return data.data.timings;
}

// Tampilkan hasil ke HTML
function tampilkan(timings, tanggal) {
  const ramadan = isRamadan(tanggal);
  let html = `<h2>Jadwal Sholat untuk ${tanggal}</h2>`;
  if (ramadan) html += `<p>🌙 Marhaban ya Ramadan</p>`;
  if (ramadan) html += `<p><strong>Imsak:</strong> ${timings.Imsak}</p>`;
  html += `
    <p><strong>Subuh:</strong> ${timings.Fajr}</p>
    <p><strong>Dzuhur:</strong> ${timings.Dhuhr}</p>
    <p><strong>Ashar:</strong> ${timings.Asr}</p>
    <p><strong>Maghrib:</strong> ${timings.Maghrib}</p>
    <p><strong>Isya:</strong> ${timings.Isha}</p>
  `;
  output.innerHTML = html;
}

// Tombol mute/unmute audio
toggleBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  toggleBtn.textContent = audio.muted ? "🔇" : "🔊";
});

// Klik tombol "Cari Jadwal"
cariBtn.addEventListener('click', async () => {
  const tanggal = inputTanggal.value;
  if (!tanggal) {
    alert('Silakan pilih tanggal terlebih dahulu!');
    return;
  }

  try {
    // Mulai audio saat user klik tombol (interaksi user)
    audio.muted = false;
    await audio.play();

    await getLokasi();
    const jadwal = await getJadwal(tanggal);
    tampilkan(jadwal, tanggal);
  } catch (err) {
    console.error(err);
  }
});


// Autoplay audio fix fix capek mlas
window.addEventListener("load", () => {
  audio.muted = true;
  setTimeout(() => {
    audio.muted = false;
  }, 1000);
});,

// Play musik saat user pertama kali sentuh / klik halaman
function aktifkanMusikSetelahInteraksi() {
  const playMusik = () => {
    audio.muted = false;
    audio.play().then(() => {
      console.log("Musik dimulai setelah interaksi.");
      document.removeEventListener("click", playMusik);
      document.removeEventListener("touchstart", playMusik);
    }).catch((err) => {
      console.log("Gagal autoplay musik:", err);
    });
  };

  document.addEventListener("click", playMusik);
  document.addEventListener("touchstart", playMusik);
}

// Aktifkan fungsi itu saat halaman load
window.addEventListener("load", aktifkanMusikSetelahInteraksi);

function aktifkanSetelahInteraksi() {
  document.removeEventListener("click", aktifkanSetelahInteraksi);
  document.removeEventListener("touchstart", aktifkanSetelahInteraksi);

  audio.muted = false;
  audio.play().catch((e) => {
    console.log("Autoplay tetap ditolak:", e);
  });

  // Reaktifkan tombol "Cari Jadwal" setelah interaksi
  cariBtn.disabled = false;
}

window.addEventListener("load", () => {
  cariBtn.disabled = true; // Disable dulu sebelum interaksi
  document.addEventListener("click", aktifkanSetelahInteraksi);
  document.addEventListener("touchstart", aktifkanSetelahInteraksi);
});
