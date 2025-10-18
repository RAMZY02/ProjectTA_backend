const express = require('express');
const router = express.Router();
const kelasMengajarController = require('../controllers/kelasMengajarController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', kelasMengajarController.getAllKelasMengajar);
router.get('/:id_user', kelasMengajarController.getKelasMengajarByUserId);
router.post('/', authorize('guru', 'admin'), kelasMengajarController.createKelasMengajar);
router.put('/:id', authorize('guru', 'admin'), kelasMengajarController.updateKelasMengajar);
router.delete('/:id', authorize('guru', 'admin'), kelasMengajarController.deleteKelasMengajar);

module.exports = router;
