const express = require('express');
const router = express.Router();
const jawabanSiswaController = require('../controllers/jawabanSiswaController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.post('/', jawabanSiswaController.submitJawaban);
router.get('/:userId/:ujianId/:soalId', jawabanSiswaController.getJawabanById);
router.put('/:id', jawabanSiswaController.updateJawaban);

module.exports = router;