const express = require('express');
const router = express.Router();
const penilaianTugasController = require('../controllers/penilaianTugasController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', penilaianTugasController.getAllPenilaianTugas);
router.get('/:id_user/:mapel/:kolom', penilaianTugasController.getPenilaianTugasByCriteria);
router.post('/', authorize('guru', 'admin'), penilaianTugasController.createOrUpdatePenilaianTugas);
router.put('/:id', authorize('guru', 'admin'), penilaianTugasController.updatePenilaianTugas);
router.delete('/:id', authorize('guru', 'admin'), penilaianTugasController.deletePenilaianTugas);

module.exports = router;
