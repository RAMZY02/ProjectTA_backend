const express = require('express');
const router = express.Router();
const hadiahController = require('../controllers/hadiahController');
const { authenticate, authorize } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', hadiahController.getAllHadiah);
router.post('/tukar-hadiah', hadiahController.tukarHadiah);
router.post('/', authorize('admin', 'guru'), hadiahController.createHadiah);
router.put('/:id', authorize('admin', 'guru'), hadiahController.updateHadiah);
router.put('/delete/:id', authorize('admin', 'guru'), hadiahController.deleteHadiah);

module.exports = router;