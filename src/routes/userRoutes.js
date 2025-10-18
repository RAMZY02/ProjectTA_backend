const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/login', userController.login);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/poin', userController.updatePoin);
router.put('/profpic', userController.updateProfpic);
router.put('/change-password', userController.changePassword);
router.get('/kelas/:kelas', userController.getUsersByKelas);
router.get('/kelas/:kelas/:id_ujian', userController.getUsersByKelasAndUjian);
router.get('/tingkatan/:kelas', userController.getUsersByTingkatan);
router.get('/role/siswa', userController.getUsersByRole);
router.get('/role/guru', userController.getUsersByRoleGuru);
router.get('/rapot/:kelas/:id_mapel', userController.getUserRapotByKelas);

// Admin-only routes
router.get('/', authorize('admin'), userController.getAllUsers);
router.get('/pengumpulan/:kelas/:id_tugas', authorize('guru'), userController.getPengumpulanByKelas);
router.post('/', authorize('admin'), userController.addUser);
router.put('/:id_user', authorize('admin'), userController.updateUser);
router.put('/kelas/:kelas/:notPromoted', authorize('admin'), userController.updateUserKelas);
router.put('/delete/:id_user', authorize('admin'), userController.softDeleteUser);

module.exports = router;