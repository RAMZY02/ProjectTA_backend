const express = require('express');
const router = express.Router();
const historyUjianController = require('../controllers/historyUjianController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', historyUjianController.getAllHistoryUjian);
router.get('/:userId', historyUjianController.getHistoryUjianByUserId);
router.get('/uts-uas/:userId', historyUjianController.getHistoryUjianByUserIdUTSandUAS);
router.post('/', historyUjianController.createHistoryUjian);
router.put('/', historyUjianController.updateHistoryUjian);
router.delete('/:id', authorize('admin'), historyUjianController.deleteHistoryUjian);

module.exports = router;
