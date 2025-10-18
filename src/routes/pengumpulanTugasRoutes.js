const express = require('express');
const router = express.Router();
const pengumpulanTugasController = require('../controllers/pengumpulanTugasController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', pengumpulanTugasController.getAllPengumpulan);
router.get('/tugas/:id_tugas', pengumpulanTugasController.getPengumpulanByTugasId);
router.get('/user/:id_user', pengumpulanTugasController.getPengumpulanByUserId);
router.get('/:id_tugas/:id_user', pengumpulanTugasController.getPengumpulanByTugasAndUser);
router.post('/', authorize('siswa', 'guru', 'admin'), pengumpulanTugasController.createOrUpdatePengumpulan);
router.put('/:id', authorize('siswa', 'guru', 'admin'), pengumpulanTugasController.updatePengumpulan);
router.put('/nilai/:id/:nilai', authorize('siswa', 'guru', 'admin'), pengumpulanTugasController.updatePengumpulanNilai);
router.delete('/:id', authorize('siswa', 'guru', 'admin'), pengumpulanTugasController.deletePengumpulan);

module.exports = router;