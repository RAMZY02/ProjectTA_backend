const express = require('express');
const router = express.Router();
const ujianController = require('../controllers/ujianController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', ujianController.getAllUjian);
router.get('/mapel/:id_mapel', ujianController.getAllUjianByIdMapel);
router.get('/guru/:id_guru', ujianController.getAllUjianByIdGuru);
router.get('/koreksi/guru/:id_guru', ujianController.getKoreksiUjianByIdGuru);
router.get('/UH/:id_mapel', ujianController.getUjianHarianByIdMapel);
router.get('/belum-selesai/:kelas/:id_user', ujianController.getAllUjianBelumSelesai);
router.get('/sedang-berlangsung/:id_user', ujianController.getUjianSedangBerlangsung);
router.post('/', authorize('guru', 'admin'), ujianController.createUjian);
router.put('/:id', authorize('guru', 'admin'), ujianController.updateUjian);
router.put('/delete/:id_ujian', authorize('guru', 'admin'), ujianController.deleteUjian);

module.exports = router;