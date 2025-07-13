const express = require('express');
const router = express.Router();
const mengikutiUjianController = require('../controllers/mengikutiUjianController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.post('/', mengikutiUjianController.joinUjian);
router.get('/:id', mengikutiUjianController.getStatusUjian);

module.exports = router;