const express = require('express');
const router = express.Router();
const kuponController = require('../controllers/kuponController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', kuponController.getAllKupon);
router.get('/:userId', kuponController.getKuponByUserId);
router.post('/', kuponController.createKupon);
router.put('/:id', authorize('admin'), kuponController.updateKupon);
router.put('/claim/:id', authorize('admin'), kuponController.claimKupon);
router.delete('/:id', authorize('admin'), kuponController.deleteKupon);

module.exports = router;