const express = require('express');
const router = express.Router();
const videoEdukasiController = require('../controllers/videoEdukasiController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.use(authenticate);

router.get('/', videoEdukasiController.getAllVideos);
router.post('/', videoEdukasiController.createVideo);
router.put('/:id', videoEdukasiController.updateVideo);
router.put('/delete/:id', videoEdukasiController.deleteVideo);
router.post('/:videoId/like', videoEdukasiController.likeVideo);
router.put('/:videoId/unlike', videoEdukasiController.unlikeVideo);

module.exports = router;