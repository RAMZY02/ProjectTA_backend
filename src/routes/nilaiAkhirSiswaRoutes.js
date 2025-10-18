const express = require('express');
const router = express.Router();
const nilaiAkhirSiswaController = require('../controllers/nilaiAkhirSIswaController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', nilaiAkhirSiswaController.getAllNilaiAkhirSiswa);
router.get('/:id', nilaiAkhirSiswaController.getNilaiAkhirSiswaById);
router.get('/mapel/:id_mapel/kelas/:kelas', nilaiAkhirSiswaController.getNilaiAkhirSiswaByMapelAndKelas);
router.get('/rapot-wali-kelas/:kelas', nilaiAkhirSiswaController.getRapotWaliKelas);
router.post('/bulk', authorize('guru', 'admin'), nilaiAkhirSiswaController.createAllNilaiAkhirSiswa);
router.post('/', authorize('guru', 'admin'), nilaiAkhirSiswaController.createNilaiAkhirSiswa);
router.post('/createorupdate', authorize('guru', 'admin'), nilaiAkhirSiswaController.createOrUpdateNilaiAkhirSiswa);
router.put('/:id', authorize('guru', 'admin'), nilaiAkhirSiswaController.updateNilaiAkhirSiswa);
router.delete('/:id', authorize('guru', 'admin'), nilaiAkhirSiswaController.deleteNilaiAkhirSiswa);

module.exports = router;
