const express = require('express');
const app = express();
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// const client = new Client({
//   puppeteer: {
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage', // Untuk menghindari masalah memory di Linux
//       '--disable-accelerated-2d-canvas',
//       '--no-first-run',
//       '--no-zygote',
//       '--single-process'
//     ],
//     executablePath: process.env.CHROME_PATH || undefined // Untuk environment tertentu
//   },
//   authStrategy: new LocalAuth({
//     dataPath: './', // atau path khusus untuk session data
//     clientId: 'my-client' // identifikasi unik untuk multi device
//   }),
//   webVersionCache: {
//     type: 'remote', // Untuk mendapatkan versi terbaru WhatsApp Web
//     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
//   },
//   takeoverOnConflict: true, // Handle multiple instances
//   takeoverTimeoutMs: 30000, // Timeout untuk takeover
//   qrTimeoutMs: 60000, // Timeout untuk QR code
//   restartOnAuthFail: true // Restart jika auth gagal
// });

// // Inisialisasi client
// client.initialize();

// // Tampilkan QR saat perlu scan ulang
// client.on('qr', (qr) => {
//   console.log('Scan QR Code:');
//   qrcode.generate(qr, { small: true });
// });

// // Event handling yang lebih lengkap
// client.on('loading_screen', (percent, message) => {
//   console.log(`Loading: ${percent}% ${message}`);
// });

// client.on('authenticated', (session) => {
//   console.log('AUTHENTICATED');
//   // Tidak perlu manual save session karena LocalAuth sudah menanganinya
// });

// client.on('auth_failure', (msg) => {
//   console.error('AUTH FAILURE:', msg);
//   // LocalAuth akan menangani session yang gagal
// });

// client.on('ready', () => {
//   console.log('READY', client.info);
// });

// client.on('disconnected', (reason) => {
//   console.log('DISCONNECTED:', reason);
//   // Tidak perlu hapus session.json manual
// });

// client.on('change_state', (state) => {
//   console.log('STATE CHANGED:', state);
// });


// Import routes
const userRoutes = require('./src/routes/userRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const hadiahRoutes = require('./src/routes/hadiahRoutes');
const jawabanSiswaRoutes = require('./src/routes/jawabanSiswaRoutes');
const kuponRoutes = require('./src/routes/kuponRoutes');
const mengikutiUjianRoutes = require('./src/routes/mengikutiUjianRoutes');
const notifikasiRoutes = require('./src/routes/notifikasiRoutes');
const soalRoutes = require('./src/routes/soalRoutes');
const ujianRoutes = require('./src/routes/ujianRoutes');
const videoEdukasiRoutes = require('./src/routes/videoEdukasiRoutes');
const historyVideoRoutes = require('./src/routes/historyVideoRoutes');
const historyUjianRoutes = require('./src/routes/historyUjianRoutes');
const cloudFlareR2StorageRoutes = require('./src/routes/cloudFlareR2StorageRoutes');
const { authenticate } = require('./src/middleware/auth');

// Middleware
app.use(express.json()); // Untuk parsing application/json
app.use(express.urlencoded({ extended: true })); // Untuk parsing application/x-www-form-urlencoded

app.use(
  cors({
    origin: "*", // Izinkan semua domain
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/hadiah', hadiahRoutes);
app.use('/api/jawaban-siswa', jawabanSiswaRoutes);
app.use('/api/kupon', kuponRoutes);
app.use('/api/mengikuti-ujian', mengikutiUjianRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/soal', soalRoutes);
app.use('/api/ujian', ujianRoutes);
app.use('/api/video-edukasi', videoEdukasiRoutes);
app.use('/api/history-video', historyVideoRoutes);
app.use('/api/history-ujian', historyUjianRoutes);
app.use('/api/history-ujian', historyUjianRoutes);
app.use('/api/cloudflare', cloudFlareR2StorageRoutes);

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

app.post('/api/WA', authenticate, async (req, res) => {
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
    
    console.log(`Mengirim pesan ke ${tujuan}: ${pesan}`);
    
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
    
  } catch (error) {
    console.error('Gagal mengirim pesan:', error);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengirim pesan',
      error: error.message 
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});