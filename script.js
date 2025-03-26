const cariBtn = document.getElementById('cariBtn');
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

// Ambil lokasi pengguna
function getLokasi() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      alert("Browser kamu tidak mendukung lokasi.");
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        lokasi.lat = pos.coords.latitude;
        lokasi.long = pos.coords.longitude;
        resolve();
      },
      (err) => {
        alert("Lokasi gagal. Menampilkan jadwal default (Jakarta).");
        lokasi.lat = -6.2;
        lokasi.long = 106.8;
        resolve();
      }
    );
  });
}

// Ambil data dari API
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

// Tampilkan jadwal ke halaman
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

// Jalankan semua setelah user interaksi pertama
function aktifkanSetelahInteraksi() {
  document.removeEventListener("click", aktifkanSetelahInteraksi);
  document.removeEventListener("touchstart", aktifkanSetelahInteraksi);

  // Play audio
  audio.muted = false;
  audio.play().catch(() => {
    console.log("Autoplay diblokir");
  });

  // Aktifkan tombol dan event klik
  cariBtn.disabled = false;

  cariBtn.addEventListener('click', async () => {
    const tanggal = inputTanggal.value;
    if (!tanggal) {
      alert("Silakan pilih tanggal terlebih dahulu!");
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
}

// Deteksi jika pakai HP → ganti video 360p
window.addEventListener("load", () => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    videoSource.src = "video/background-mobile.mp4";
    document.getElementById("bg-video").load();
  }

  // Tunda aktivasi sistem sampai user klik
  cariBtn.disabled = true;
  document.addEventListener("click", aktifkanSetelahInteraksi);
  document.addEventListener("touchstart", aktifkanSetelahInteraksi);
});
