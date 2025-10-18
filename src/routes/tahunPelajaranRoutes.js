const express = require('express');
const router = express.Router();
const tahunPelajaranController = require('../controllers/tahunPelajaranController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', tahunPelajaranController.getAllTahunPelajaran);
router.get('/:id', tahunPelajaranController.getTahunPelajaranById);
router.post('/', authorize('admin'), tahunPelajaranController.createTahunPelajaran);
router.put('/:id', authorize('admin'), tahunPelajaranController.updateTahunPelajaran);
router.delete('/:id', authorize('admin'), tahunPelajaranController.deleteTahunPelajaran);

module.exports = router;
