const express = require('express');
const router = express.Router();
const mataPelajaranController = require('../controllers/mataPelajaranController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

// Routes untuk mata pelajaran
router.get('/', mataPelajaranController.getAllMataPelajaran);
router.get('/:id', mataPelajaranController.getMataPelajaranById);
router.get('/siswa/:id_user', mataPelajaranController.getMataPelajaranSiswa);
router.post('/', authorize('admin'), mataPelajaranController.createMataPelajaran);
router.put('/:id', authorize('admin'), mataPelajaranController.updateMataPelajaran);
router.delete('/:id', authorize('admin'), mataPelajaranController.deleteMataPelajaran);
router.post('/:id/restore', authorize('admin'), mataPelajaranController.restoreMataPelajaran);

module.exports = router;