const express = require('express');
const app = express();
const cors = require('cors');

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

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'API is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});