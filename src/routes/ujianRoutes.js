const express = require('express');
const router = express.Router();
const ujianController = require('../controllers/ujianController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', ujianController.getAllUjian);
router.get('/belum-selesai', ujianController.getAllUjianBelumSelesai);
router.get('/sedang-berlangsung', ujianController.getUjianSedangBerlangsung);
router.post('/', authorize('guru', 'admin'), ujianController.createUjian);
router.put('/:id', authorize('guru', 'admin'), ujianController.updateUjian);
router.put('/delete/:id_ujian', authorize('guru', 'admin'), ujianController.deleteUjian);

module.exports = router;