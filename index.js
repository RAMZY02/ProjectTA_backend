const express = require('express');
const app = express();
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');
const { exec, spawn } = require('child_process');

// // Buat folder session jika belum ada
// const sessionDir = './sessions';
// if (!fs.existsSync(sessionDir)) {
//     fs.mkdirSync(sessionDir, { recursive: true });
// }

// // Variabel status global
// let isClientReady = false;
// let isAuthenticated = false;
// let clientState = 'initializing';
// let loadingProgress = 0;
// let reconnectAttempts = 0;
// const MAX_RECONNECT_ATTEMPTS = 5;
// let loadingStartTime = null;
// let loadingTimeout = null;
// let browserProcess = null;

// // Custom Auth Strategy untuk handle EBUSY error
// class SafeLocalAuth extends LocalAuth {
//     async logout() {
//         try {
//             await super.logout();
//             console.log('✅ Logout successful');
//         } catch (error) {
//             if (error.message.includes('EBUSY') || error.message.includes('resource busy')) {
//                 console.warn('⚠️  EBUSY error during logout, skipping file cleanup');
//                 // Skip file cleanup jika resource busy
//                 return;
//             }
//             throw error;
//         }
//     }
// }

// const client = new Client({
//   puppeteer: {
//     headless: true,
//     args: [
//       '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-dev-shm-usage',
//       '--disable-accelerated-2d-canvas',
//       '--no-first-run',
//       '--no-zygote',
//       '--single-process',
//       '--disable-background-timer-throttling',
//       '--disable-renderer-backgrounding',
//       '--disable-extensions',
//       '--disable-backgrounding-occluded-windows',
//       '--disable-breakpad',
//       '--disable-component-extensions-with-background-pages',
//       '--disable-features=TranslateUI,BlinkGenPropertyTrees',
//       '--disable-ipc-flooding-protection',
//       '--disable-notifications',
//       '--disable-background-networking',
//       '--disable-default-apps',
//       '--disable-sync',
//       '--disable-web-resources',
//       '--enable-automation',
//       '--password-store=basic',
//       '--use-mock-keychain',
//       '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       '--window-size=1920,1080',
//       '--start-maximized'
//     ],
//     executablePath: process.env.CHROME_PATH || undefined,
//     ignoreHTTPSErrors: true,
//     defaultViewport: null,
//     timeout: 120000,
//     protocolTimeout: 120000
//   },
//   authStrategy: new SafeLocalAuth({
//     dataPath: path.resolve(sessionDir),
//     clientId: 'my-client'
//   }),
//   webVersionCache: {
//     type: 'remote',
//     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html'
//   },
//   takeoverOnConflict: false,
//   takeoverTimeoutMs: 0,
//   qrTimeoutMs: 0,
//   restartOnAuthFail: false, // Nonaktifkan restart on auth fail
// });

// // Fungsi untuk kill Chrome processes di Windows
// async function killChromeProcesses() {
//   return new Promise((resolve) => {
//     if (process.platform === 'win32') {
//       exec('taskkill /f /im chrome.exe /im chromedriver.exe /im chromium.exe', (error) => {
//         if (!error) console.log('✅ Chrome processes killed');
//         resolve();
//       });
//     } else {
//       exec('pkill -f "chrome|chromium|chromedriver"', (error) => {
//         if (!error) console.log('✅ Chrome processes killed');
//         resolve();
//       });
//     }
//   });
// }

// // Fungsi untuk cleanup session files yang terkunci
// async function cleanupLockedFiles() {
//   try {
//     const sessionPath = path.join(sessionDir, 'session-my-client');
//     if (fs.existsSync(sessionPath)) {
//       console.log('🧹 Cleaning up session files...');
      
//       // Coba rename file yang terkunci daripada delete
//       const files = fs.readdirSync(sessionPath);
//       for (const file of files) {
//         if (file.includes('Cookies') || file.includes('LOCK')) {
//           try {
//             const oldPath = path.join(sessionPath, file);
//             const newPath = path.join(sessionPath, file + '.old');
//             fs.renameSync(oldPath, newPath);
//             console.log(`✅ Renamed locked file: ${file}`);
//           } catch (renameError) {
//             console.warn(`⚠️  Could not rename ${file}: ${renameError.message}`);
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.warn('⚠️  Cleanup warning:', error.message);
//   }
// }

// // Enhanced Event Handling
// client.on('qr', (qr) => {
//   console.log('QR Code received. Please scan:');
//   qrcode.generate(qr, { small: true });
//   isAuthenticated = false;
//   isClientReady = false;
//   clientState = 'waiting_qr';
//   loadingProgress = 0;
//   clearTimeout(loadingTimeout);
// });

// client.on('loading_screen', (percent, message) => {
//   console.log(`📊 Loading: ${percent}% - ${message}`);
//   loadingProgress = percent;
//   clientState = `loading_${percent}`;
// });

// client.on('authenticated', (session) => {
//   console.log('✅ AUTHENTICATED successfully');
//   isAuthenticated = true;
//   clientState = 'authenticated';
//   reconnectAttempts = 0;
// });

// client.on('auth_failure', (msg) => {
//   console.error('❌ AUTH FAILURE:', msg);
//   isAuthenticated = false;
//   isClientReady = false;
//   clientState = 'auth_failure';
// });

// client.on('ready', () => {
//   console.log('✅ READY - WhatsApp client is fully ready');
//   isClientReady = true;
//   isAuthenticated = true;
//   clientState = 'ready';
//   loadingProgress = 100;
//   reconnectAttempts = 0;
//   clearTimeout(loadingTimeout);
// });

// client.on('disconnected', async (reason) => {
//   console.log('❌ DISCONNECTED:', reason);
//   isClientReady = false;
//   isAuthenticated = false;
//   clientState = 'disconnected';
  
//   // Handle logout event dengan cleanup yang aman
//   if (reason === 'LOGOUT') {
//     console.log('🔒 Logout detected, performing safe cleanup...');
//     await killChromeProcesses();
//     await cleanupLockedFiles();
//   }
  
//   if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
//     reconnectAttempts++;
//     console.log(`🔄 Attempting reconnect (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
    
//     setTimeout(async () => {
//       try {
//         await safeDestroyClient();
//         await client.initialize();
//       } catch (error) {
//         console.error('Reconnection error:', error);
//       }
//     }, 5000);
//   }
// });

// // Fungsi aman untuk destroy client
// async function safeDestroyClient() {
//   try {
//     console.log('🛑 Safely destroying client...');
//     await killChromeProcesses();
//     await cleanupLockedFiles();
    
//     // Gunakan method destroy dengan timeout
//     const destroyPromise = client.destroy();
//     const timeoutPromise = new Promise((resolve) => {
//       setTimeout(resolve, 10000);
//     });
    
//     await Promise.race([destroyPromise, timeoutPromise]);
//     console.log('✅ Client safely destroyed');
//   } catch (error) {
//     console.warn('⚠️  Safe destroy warning:', error.message);
//   }
// }

// // Handle browser process
// client.on('browser_launched', (browser) => {
//   console.log('🌐 Browser launched successfully');
//   browser.process().then(process => {
//     browserProcess = process;
//     console.log('📝 Browser PID:', process.pid);
//   });
// });

// // Initialize client dengan enhanced error handling
// async function initializeWhatsAppClient() {
//   try {
//     console.log('🚀 Initializing WhatsApp client...');
    
//     // Cleanup sebelum inisialisasi
//     await killChromeProcesses();
//     await cleanupLockedFiles();
    
//     await client.initialize();
    
//   } catch (error) {
//     console.error('❌ Failed to initialize WhatsApp client:', error);
    
//     setTimeout(() => {
//       console.log('🔄 Retrying initialization...');
//       initializeWhatsAppClient();
//     }, 10000);
//   }
// }

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

// Health check endpoint
app.get('/api', (req, res) => {
  res.status(200).json({ 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    whatsapp_status: clientState
  });
});

// // WhatsApp status endpoint
// app.get('/api/WA/status', (req, res) => {
//   const status = {
//     isAuthenticated,
//     isClientReady,
//     clientState,
//     loadingProgress: `${loadingProgress}%`,
//     reconnectAttempts,
//     timestamp: new Date().toISOString()
//   };
  
//   res.json(status);
// });

// // Force cleanup endpoint
// app.post('/api/WA/cleanup', authenticate, async (req, res) => {
//   try {
//     console.log('🧹 Manual cleanup triggered...');
//     await killChromeProcesses();
//     await cleanupLockedFiles();
    
//     res.json({ 
//       success: true, 
//       message: 'Cleanup completed',
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });

// // WhatsApp message endpoint
// app.post('/api/WA', authenticate, async (req, res) => {
//   try {
//     let { tujuan, pesan } = req.body;
    
//     if (!tujuan || !pesan) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Parameter tujuan dan pesan diperlukan' 
//       });
//     }

//     if (!isClientReady) {
//       return res.status(503).json({
//         success: false,
//         message: 'WhatsApp client belum siap',
//         status: { isAuthenticated, isClientReady, clientState }
//       });
//     }

//     tujuan = tujuan.trim().replace(/^0/, '62').replace(/[+\s-]/g, '');
//     if (!tujuan.endsWith('@c.us')) {
//       tujuan += '@c.us';
//     }
    
//     const result = await client.sendMessage(tujuan, pesan);
    
//     res.status(200).json({ 
//       success: true,
//       message: 'Pesan berhasil dikirim',
//       data: {
//         messageId: result.id._serialized,
//         timestamp: result.timestamp,
//         to: tujuan
//       }
//     });
    
//   } catch (error) {
//     console.error('❌ Gagal mengirim pesan:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Gagal mengirim pesan',
//       error: error.message 
//     });
//   }
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  // console.log(`📱 WhatsApp client status: ${clientState}`);
});

// // Cleanup handlers untuk graceful shutdown
// process.on('SIGINT', async () => {
//   console.log('🛑 Shutting down gracefully...');
//   try {
//     await safeDestroyClient();
//     console.log('✅ Clean shutdown completed');
//   } catch (error) {
//     console.error('❌ Error during shutdown:', error);
//   }
//   process.exit(0);
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', async (error) => {
//   console.error('❌ Uncaught Exception:', error);
//   await safeDestroyClient();
//   process.exit(1);
// });

// process.on('unhandledRejection', async (reason, promise) => {
//   console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
//   await safeDestroyClient();
//   process.exit(1);
// });

// // Mulai inisialisasi
// setTimeout(() => {
//   initializeWhatsAppClient();
// }, 2000);