const express = require('express');
const router = express.Router();
const historyTugasController = require('../controllers/historyTugasController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', historyTugasController.getAllHistoryTugas);
router.get('/:id_user/:id_tugas', historyTugasController.getHistoryTugasByPengumpulanId);
router.post('/', historyTugasController.createHistoryTugas);
router.put('/:id', historyTugasController.updateHistoryTugas);
router.delete('/:id', authorize('admin'), historyTugasController.deleteHistoryTugas);

module.exports = router;
