const express = require('express');
const router = express.Router();
const historyVideoController = require('../controllers/historyVideoController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', historyVideoController.getAllHistory);
router.get('/user/:userId', historyVideoController.getHistoryByUser);
router.post('/', historyVideoController.createHistory);
router.delete('/:id', historyVideoController.deleteHistory);

module.exports = router;