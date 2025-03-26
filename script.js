const cariBtn = document.getElementById('cariBtn');
const toggleBtn = document.getElementById('toggleAudio');
const output = document.getElementById('output');
const inputTanggal = document.getElementById('tanggal');
const audio = document.getElementById('bg-audio');
const videoSource = document.getElementById("video-source");

let lokasi = { lat: null, long: null };

// Cek Ramadan
function isRamadan(tanggal) {
  const tgl = new Date(tanggal);
  return tgl >= new Date("2025-03-10") && tgl <= new Date("2025-04-09");
}

// Lokasi user
function getLokasi() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung browser.");
      reject();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lokasi.lat = pos.coords.latitude;
        lokasi.long = pos.coords.longitude;
        resolve();
      },
      () => {
        alert("Lokasi gagal. Menampilkan jadwal default (Jakarta).");
        lokasi.lat = -6.2;
        lokasi.long = 106.8;
        resolve();
      }
    );
  });
}

// Ambil dari API
async function getJadwal(tanggal) {
  const d = new Date(tanggal);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${lokasi.lat}&longitude=${lokasi.long}&method=2`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data.timings;
}

// Tampilkan
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

// Interaksi pertama
function aktifkanSemua() {
  document.removeEventListener("click", aktifkanSemua);
  document.removeEventListener("touchstart", aktifkanSemua);

  audio.muted = false;
  audio.play().catch(() => {
    console.log("Autoplay audio tetap ditolak.");
  });

  cariBtn.disabled = false;
}

// Tombol mute/unmute
toggleBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  toggleBtn.textContent = audio.muted ? "🔇" : "🔊";
});

// Klik cari jadwal
cariBtn.addEventListener("click", async () => {
  const tanggal = inputTanggal.value;
  if (!tanggal) {
    alert("Silakan pilih tanggal.");
    return;
  }

  try {
    await getLokasi();
    const jadwal = await getJadwal(tanggal);
    tampilkan(jadwal, tanggal);
  } catch (err) {
    console.error(err);
  }
});

// Saat halaman dibuka
window.addEventListener("load", () => {
  cariBtn.disabled = true;
  toggleBtn.textContent = "🔊";
  document.addEventListener("click", aktifkanSemua);
  document.addEventListener("touchstart", aktifkanSemua);
});
