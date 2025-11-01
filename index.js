const express = require('express');
const app = express();
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode'); // Install: npm install qrcode
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 🟢 Buat folder session jika belum ada
const sessionDir = './sessions';
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// 🟢 Status global
let isClientReady = false;
let isAuthenticated = false;
let clientState = 'idle';
let clientInitialized = false;
let currentQR = null; // Simpan QR code sementara

// 🟢 Custom Auth Strategy aman
class SafeLocalAuth extends LocalAuth {
  async logout() {
    try {
      await super.logout();
      console.log('✅ Logout successful');
    } catch (error) {
      if (error.message.includes('EBUSY')) {
        console.warn('⚠️ EBUSY during logout, skipping cleanup');
        return;
      }
      throw error;
    }
  }
}

let client;

// 🟢 Fungsi untuk kill Chrome
async function killChromeProcesses() {
  return new Promise((resolve) => {
    const cmd =
      process.platform === 'win32'
        ? 'taskkill /f /im chrome.exe /im chromedriver.exe /im chromium.exe'
        : 'pkill -f "chrome|chromium|chromedriver"';
    exec(cmd, (error) => {
      if (!error) console.log('✅ Chrome processes killed');
      resolve();
    });
  });
}

// 🟢 Fungsi cleanup file terkunci
async function cleanupLockedFiles() {
  try {
    const sessionPath = path.join(sessionDir, 'session-my-client');
    if (fs.existsSync(sessionPath)) {
      console.log('🧹 Cleaning up session files...');
      const files = fs.readdirSync(sessionPath);
      for (const file of files) {
        if (file.includes('LOCK')) {
          try {
            fs.renameSync(
              path.join(sessionPath, file),
              path.join(sessionPath, file + '.old')
            );
          } catch (e) {
            console.warn('⚠️ Could not rename:', file);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Cleanup warning:', err.message);
  }
}

// 🟢 Fungsi inisialisasi WhatsApp
async function initializeWhatsAppClient() {
  if (clientInitialized) {
    console.log('⚠️ Client already initialized.');
    return;
  }

  console.log('🚀 Initializing WhatsApp client...');
  clientState = 'initializing';
  clientInitialized = true;
  currentQR = null;

  await killChromeProcesses();
  await cleanupLockedFiles();

  client = new Client({
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--disable-back-forward-cache',
        '--disable-component-extensions-with-background-pages',
        '--disable-ipc-flooding-protection',
        '--enable-features=NetworkService,NetworkServiceInProcess',
        '--user-data-dir=/tmp/chrome-user-data',
        '--remote-debugging-port=0'
      ],
      executablePath: '/usr/bin/chromium-browser', // Path Chromium di AlmaLinux
      ignoreHTTPSErrors: true,
    },
    authStrategy: new LocalAuth({
      clientId: "my-client",
      dataPath: "./sessions"
    }),
    webVersionCache: {
      type: 'remote',
      remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
    }
  });

  // Event handlers
  client.on('qr', async (qr) => {
    console.log('📱 QR Code generated');
    qrcode.generate(qr, { small: true });
    
    // Simpan QR code (text dan base64)
    currentQR = {
      text: qr,
      image: await QRCode.toDataURL(qr)
    };
    
    isAuthenticated = false;
    isClientReady = false;
    clientState = 'waiting_qr';
  });

  client.on('authenticated', () => {
    console.log('✅ AUTHENTICATED');
    isAuthenticated = true;
    clientState = 'authenticated';
    currentQR = null; // Clear QR setelah authenticated
  });

  client.on('ready', () => {
    console.log('✅ READY - WhatsApp connected!');
    isClientReady = true;
    clientState = 'ready';
    currentQR = null;
  });

  client.on('disconnected', async (reason) => {
    console.log('❌ DISCONNECTED:', reason);
    isAuthenticated = false;
    isClientReady = false;
    clientState = 'disconnected';
    currentQR = null;
    // ❌ Tidak auto reconnect
  });

  try {
    await client.initialize();
  } catch (err) {
    console.error('Initialization error:', err);
    clientState = 'error';
    clientInitialized = false;
    currentQR = null;
  }
}

// 🟢 Fungsi destroy client manual
async function safeDestroyClient() {
  if (!client) {
    console.log('ℹ️ No client to destroy');
    return;
  }
  console.log('🛑 Destroying WhatsApp client...');
  try {
    await client.destroy();
    await killChromeProcesses();
    await cleanupLockedFiles();
    client = null;
    clientInitialized = false;
    isAuthenticated = false;
    isClientReady = false;
    clientState = 'destroyed';
    currentQR = null;
    console.log('✅ Client destroyed');
  } catch (err) {
    console.error('Destroy error:', err.message);
  }
}

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const hadiahRoutes = require('./src/routes/hadiahRoutes');
const jawabanSiswaRoutes = require('./src/routes/jawabanSiswaRoutes');
const kuponRoutes = require('./src/routes/kuponRoutes');
const notifikasiRoutes = require('./src/routes/notifikasiRoutes');
const soalRoutes = require('./src/routes/soalRoutes');
const ujianRoutes = require('./src/routes/ujianRoutes');
const videoEdukasiRoutes = require('./src/routes/videoEdukasiRoutes');
const historyVideoRoutes = require('./src/routes/historyVideoRoutes');
const historyUjianRoutes = require('./src/routes/historyUjianRoutes');
const historyTugasRoutes = require('./src/routes/historyTugasRoutes');
const cloudFlareR2StorageRoutes = require('./src/routes/cloudFlareR2StorageRoutes');
const tugasRoutes = require('./src/routes/tugasRoutes');
const pengumpulanTugasRoutes = require('./src/routes/pengumpulanTugasRoutes');
const penilaianTugasRoutes = require('./src/routes/penilaianTugasRoutes');
const nilaiAkhirSiswaRoutes = require('./src/routes/nilaiAkhirSiswaRoutes');
const kelasMengajarRoutes = require('./src/routes/kelasMengajarRoutes');
const mataPelajaranRoutes = require('./src/routes/mataPelajaranRoutes');
const tahunPelajaranRoutes = require('./src/routes/tahunPelajaranRoutes');
const { authenticate } = require('./src/middleware/auth');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/hadiah', hadiahRoutes);
app.use('/api/jawaban-siswa', jawabanSiswaRoutes);
app.use('/api/kupon', kuponRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/soal', soalRoutes);
app.use('/api/ujian', ujianRoutes);
app.use('/api/video-edukasi', videoEdukasiRoutes);
app.use('/api/history-video', historyVideoRoutes);
app.use('/api/history-ujian', historyUjianRoutes);
app.use('/api/history-tugas', historyTugasRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/pengumpulan-tugas', pengumpulanTugasRoutes);
app.use('/api/penilaian-tugas', penilaianTugasRoutes);
app.use('/api/nilai-akhir-siswa', nilaiAkhirSiswaRoutes);
app.use('/api/kelas-mengajar', kelasMengajarRoutes);
app.use('/api/mata-pelajaran', mataPelajaranRoutes);
app.use('/api/tahun-pelajaran', tahunPelajaranRoutes);
app.use('/api/cloudflare', cloudFlareR2StorageRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    whatsapp_status: clientState
  });
});

// Cek status
app.get('/api/WA/status', (req, res) => {
  res.json({
    isAuthenticated,
    isClientReady,
    clientState,
    timestamp: new Date().toISOString(),
  });
});

// Get QR Code (JSON)
app.get('/api/WA/qr', (req, res) => {
  if (!currentQR) {
    return res.status(404).json({ 
      message: 'No QR code available',
      clientState 
    });
  }
  
  res.json({
    qr: currentQR.text,
    qrImage: currentQR.image,
    clientState,
    timestamp: new Date().toISOString()
  });
});

// Get QR Code sebagai gambar PNG langsung
app.get('/api/WA/qr-image', async (req, res) => {
  if (!currentQR) {
    return res.status(404).send('No QR code available');
  }
  
  try {
    const buffer = await QRCode.toBuffer(currentQR.text, {
      type: 'png',
      width: 300,
      margin: 2
    });
    res.type('image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inisialisasi manual dengan polling QR
app.post('/api/WA/init', async (req, res) => {
  if (clientInitialized) {
    // Jika sudah authenticated/ready, return status
    if (isAuthenticated || isClientReady) {
      return res.json({ 
        message: 'Client already connected',
        clientState,
        isAuthenticated,
        isClientReady
      });
    }
    
    // Jika masih waiting QR, return QR yang ada
    if (currentQR) {
      return res.json({
        message: 'Client initialized, QR code ready',
        clientState,
        qr: currentQR.text,
        qrImage: currentQR.image
      });
    }
    
    return res.json({ 
      message: 'Client initializing, please wait for QR code',
      clientState 
    });
  }
  
  // Mulai inisialisasi
  initializeWhatsAppClient();
  
  // Tunggu QR code muncul (timeout 30 detik)
  const timeout = 30000;
  const startTime = Date.now();
  
  const checkQR = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (currentQR) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          resolve(false);
        }
      }, 500);
    });
  };
  
  const qrReady = await checkQR();
  
  if (qrReady && currentQR) {
    res.json({
      message: 'Client initialized successfully',
      clientState,
      qr: currentQR.text,
      qrImage: currentQR.image,
      instructions: 'Scan this QR code with WhatsApp mobile app'
    });
  } else {
    res.json({
      message: 'Client initializing, QR code not ready yet',
      clientState,
      note: 'Please call GET /api/WA/qr to get QR code when ready'
    });
  }
});

// Restart manual
app.post('/api/WA/restart', async (req, res) => {
  await safeDestroyClient();
  await initializeWhatsAppClient();
  res.json({ message: 'Client restarted' });
});

// Kill Chrome manual
app.post('/api/WA/kill-chrome', async (req, res) => {
  await killChromeProcesses();
  res.json({ message: 'Chrome processes killed' });
});

// Send message (tidak berubah)
app.post('/api/WA', async (req, res) => {
  try {
    let tujuan = req.body.tujuan;
    let pesan = req.body.pesan;
     // Validasi input
    if (!tujuan || !pesan) {
      return res.status(400).json({ 
        success: false,
        message: 'Parameter tujuan dan pesan diperlukan' 
      });
    }

    // Pastikan client sudah ready
    if (!client.info) {
      return res.status(503).json({
        success: false,
        message: 'WhatsApp client belum siap, silakan coba lagi nanti'
      });
    }

    // Format nomor tujuan
    tujuan = tujuan.replace(/^0/, '62').replace(/[+\s-]/g, '') + '@c.us';
    // Kirim pesan dan tunggu hasilnya
    const result = await client.sendMessage(tujuan, pesan);
    res.status(200).json({ 
      success: true,
      message: 'Pesan berhasil dikirim',
      data: {
        messageId: result.id._serialized,
        timestamp: result.timestamp
      }
    });
  } 
  catch (error) {
    console.error('Gagal mengirim pesan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengirim pesan',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🚀 Server running on port ${PORT}`)
);