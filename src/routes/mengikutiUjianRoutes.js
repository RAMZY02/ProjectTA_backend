const express = require('express');
const router = express.Router();
const mengikutiUjianController = require('../controllers/mengikutiUjianController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.post('/', mengikutiUjianController.joinUjian);
router.get('/', mengikutiUjianController.getAllMengikutiUjian);
router.get('/:id_user/:id_ujian', mengikutiUjianController.getMengikutiUjianById);
router.put('/selesai/:id_user/:id_ujian', mengikutiUjianController.updateSelesai);

module.exports = router;