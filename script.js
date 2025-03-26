const cariBtn = document.getElementById('cariBtn');
const output = document.getElementById('output');
const inputTanggal = document.getElementById('tanggal');
const audio = document.getElementById('bg-audio');

let lokasi = { lat: null, long: null };

// Cek apakah tanggal Ramadan
function isRamadan(tanggal) {
  const tgl = new Date(tanggal);
  return tgl >= new Date("2025-03-10") && tgl <= new Date("2025-04-09");
}

// Ambil lokasi user
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
        resolve(); // tetap lanjut pakai default
      }
    );
  });
}

// Ambil jadwal dari API
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

// Tampilkan hasil ke halaman
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

// Aktifkan sistem setelah user sentuh layar
function aktifkanSetelahInteraksi() {
  document.removeEventListener("click", aktifkanSetelahInteraksi);
  document.removeEventListener("touchstart", aktifkanSetelahInteraksi);

  // Mainkan audio
  audio.muted = false;
  audio.play().catch(() => {
    console.log("Autoplay audio tetap diblokir.");
  });

  // Aktifkan tombol
  cariBtn.disabled = false;

  // Saat tombol diklik
  cariBtn.addEventListener('click', async () => {
    const tanggal = inputTanggal.value;
    if (!tanggal) {
      alert("Silakan pilih tanggal terlebih dahulu.");
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

// Jalankan saat halaman load
window.addEventListener("load", () => {
  cariBtn.disabled = true; // disable dulu
  document.addEventListener("click", aktifkanSetelahInteraksi);
  document.addEventListener("touchstart", aktifkanSetelahInteraksi);
});
