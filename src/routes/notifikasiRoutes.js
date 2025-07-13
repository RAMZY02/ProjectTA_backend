const express = require('express');
const router = express.Router();
const notifikasiController = require('../controllers/notifikasiController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', notifikasiController.getAllNotifikasi);
router.post('/', notifikasiController.createNotifikasi);
router.put('/:id', notifikasiController.updateNotifikasi);
router.delete('/:id', notifikasiController.deleteNotifikasi);
router.post('/markasread/:id', notifikasiController.markAsRead);
router.post('/markallasread', notifikasiController.markAllAsRead);

module.exports = router;