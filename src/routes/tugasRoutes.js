const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', tugasController.getAllTugas);
router.get('/kelas/:kelas/:id_user', tugasController.getTugasByKelas);
router.get('/user/:id_user', tugasController.getTugasByIdUser);
router.post('/', authorize('guru', 'admin'), tugasController.createTugas);
router.put('/:id', authorize('guru', 'admin'), tugasController.updateTugas);
router.delete('/:id', authorize('guru', 'admin'), tugasController.deleteTugas);

module.exports = router;