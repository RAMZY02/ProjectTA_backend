const express = require('express');
const router = express.Router();
const soalController = require('../controllers/soalController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', soalController.getAllSoal);
router.get('/:id_ujian', soalController.getSoalByUjianId);
router.get('/urutan/:id_ujian/:id_user', soalController.getSoalByUrutan);
router.get('/:id_ujian/:id_user', soalController.getSoalByUjianIdandUserId);
router.post('/', authorize('guru', 'admin'), soalController.createSoal);
router.put('/:id', authorize('guru', 'admin'), soalController.updateSoal);
router.put('/delete/:id', authorize('guru', 'admin'), soalController.deleteSoal);

module.exports = router;