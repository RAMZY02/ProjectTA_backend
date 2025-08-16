const express = require('express');
const router = express.Router();
const cloudFlareR2StorageController = require('../controllers/cloudFlareR2StorageController');
const { authenticate, authorize } = require('../middleware/auth');
const multer = require('multer');
const upload = multer();

// Protected routes
router.use(authenticate);

router.post('/', upload.single('fileContent'), cloudFlareR2StorageController.uploadFile);

module.exports = router;