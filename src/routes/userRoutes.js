const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/poin', userController.updatePoin);
router.put('/profpic', userController.updateProfpic);
router.put('/change-password', userController.changePassword);
router.get('/kelas/:kelas', userController.getUsersByKelas);

// Admin-only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.post('/', authorize('admin'), userController.addUser);
router.put('/:id_user', authorize('admin'), userController.updateUser);
router.put('/delete/:id_user', authorize('admin'), userController.softDeleteUser);

module.exports = router;