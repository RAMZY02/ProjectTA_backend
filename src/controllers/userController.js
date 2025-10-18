const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { Op } = require('sequelize');
const { sequelize } = require('../models');
const { HistoryUjian, Ujian, PengumpulanTugas, PenilaianTugas, MataPelajaran, Tugas, TahunPelajaran } = require('../models');

// Ensure association exists
if (!HistoryUjian.associations || !HistoryUjian.associations.ujian) {
  HistoryUjian.belongsTo(Ujian, { foreignKey: 'id_ujian', as: 'ujian' });
}

if (!PengumpulanTugas.associations || !PengumpulanTugas.associations.tugas) {
  PengumpulanTugas.belongsTo(Tugas, { foreignKey: 'id_tugas', as: 'tugas' });
}

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const userWithMapel = user.toJSON();
    if (user.role === 'guru' && user.id_mapel) {
      const mapelData = await MataPelajaran.findByPk(user.id_mapel);
      userWithMapel.mapel = mapelData ? mapelData.mapel : '-';
    }else{
      userWithMapel.mapel = '-';
    }

    delete userWithMapel.password;

    res.json({
      success: true,
      data: userWithMapel,
      token: generateToken(user)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From JWT middleware

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, authConfig.bcryptSaltRounds);

    // Update password
    await user.update({ password: hashedPassword });

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    const mapelData = await MataPelajaran.findByPk(user.id_mapel);

    res.json({...updatedUser.toJSON(), mapel : mapelData ? mapelData.mapel : '-'});
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      data: user 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { nama, kelas } = req.body;
    const userId = req.user.id;

    const updateData = { nama };
    if (req.user.role === 'siswa') {
      updateData.kelas = kelas;
    }

    const [affectedRows] = await User.update(updateData, {
      where: { id: userId }
    });

    if (affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({ 
      success: true,
      data: updatedUser 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update user poin
exports.updatePoin = async (req, res) => {
  try {
    const { poin } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    const mapelData = await MataPelajaran.findByPk(user.id_mapel);

    // Update poin
    user.poin = poin;
    await user.save();

    // Remove password from response
    const userResponse = {...user.toJSON(), mapel : mapelData ? mapelData.mapel : '-'};
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user profile picture (link_gambar)
exports.updateProfpic = async (req, res) => {
  try {
    const { profpic } = req.body;
    const userId = req.user.id;

    const [affectedRows] = await User.update(
      { profpic },
      { where: { id: userId } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access' 
      });
    }

    const users = await User.findAll({
      where: { key_status: 'active' },
      attributes: { exclude: ['password'] }
    });

    const usersWithMapel = await Promise.all(
      users.map(async (user) => {
        let mapel = '-';
        if (user.role === 'guru' && user.id_mapel) {
          const mapelData = await MataPelajaran.findByPk(user.id_mapel);
          mapel = mapelData.mapel != null ? mapelData.mapel : '-';
        }
        return { ...user.toJSON(), mapel };
      })
    );

    res.json(usersWithMapel);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getPengumpulanByKelas = async (req, res) => {
  try {
    const { id_tugas, kelas } = req.params;

    const usersInKelas = await User.findAll({
      where: { kelas, key_status: 'active' },
    });

    const userMengumpulkan = await Promise.all(
      usersInKelas.map(async (user) => {

        const pengumpulan = await PengumpulanTugas.findOne({
          where: { id_tugas, id_user: user.id }
        });

        const mapelData = await MataPelajaran.findByPk(user.id_mapel);
        const mapel = mapelData ? mapelData.mapel : '-';

        return {
          ...user.toJSON(),
          pengumpul: pengumpulan ? true : false,
          tugas: pengumpulan ?? null,
          mapel
        };
      })
    );

    res.json(userMengumpulkan);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get users by role 'siswa'
 */
exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'siswa',
        key_status: 'active'
      },
      attributes: { exclude: ['password'] },
      order: [['kelas', 'ASC'], ['nama', 'ASC']] // urutkan naik
    });

    const usersWithMapel = await Promise.all(
      users.map(async (user) => {
        let mapel = '-';
        if (user.role === 'guru' && user.id_mapel) {
          const mapelData = await MataPelajaran.findByPk(user.id_mapel);
          mapel = mapelData ? mapelData.mapel : '-';
        }
        return { ...user.toJSON(), mapel };
      })
    );

    res.json(usersWithMapel);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUsersByRoleGuru = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: 'guru',
        key_status: 'active'
      },
      attributes: { exclude: ['password'] },
      order: [['kelas', 'ASC'], ['nama', 'ASC']] // urutkan naik
    });

    const usersWithMapel = await Promise.all(
      users.map(async (user) => {
        let mapel = '-';
        if (user.role === 'guru' && user.id_mapel) {
          const mapelData = await MataPelajaran.findByPk(user.id_mapel);
          mapel = mapelData ? mapelData.mapel : '-';
        }
        return { ...user.toJSON(), mapel };
      })
    );

    res.json(usersWithMapel);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get users by kelas
 */
exports.getUsersByKelas = async (req, res) => {
  try {
    const { kelas } = req.params;

    const users = await User.findAll({
      where: {
        kelas,
        key_status: 'active'
      },
      attributes: { exclude: ['password'] },
      order: [['nama', 'ASC']] // Sort by name in ascending order
    });

    const usersWithMapel = await Promise.all(
      users.map(async (user) => {
        let mapel = '-';
        if (user.role === 'guru' && user.id_mapel) {
          const mapelData = await MataPelajaran.findByPk(user.id_mapel);
          mapel = mapelData ? mapelData.mapel : '-';
        }
        return { ...user.toJSON(), mapel };
      })
    );

    res.json(usersWithMapel);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get users by kelas (admin only)
 */
exports.getUsersByKelasAndUjian = async (req, res) => {
  try {

    const { kelas, id_ujian } = req.params;

    // Ambil semua users
    const users = await User.findAll({
      where: {
        kelas,
        key_status: 'active',
        role: 'siswa'
      },
      attributes: { exclude: ['password'] }
    });

    // Filter hanya users yang mengikuti ujian
    const usersYangMengikutiUjian = await Promise.all(
      users.map(async (item) => {
        const mengikutiUjian = await HistoryUjian.findOne({
          where: { 
            id_ujian, 
            id_user: item.id 
          }
        });

        return mengikutiUjian ? item : null;
      })
    );

    // Filter out null values (users yang tidak mengikuti ujian)
    const filteredUsers = usersYangMengikutiUjian.filter(user => user !== null);

    // Ambil nilai untuk users yang mengikuti ujian
    const usersWithNilai = await Promise.all(
      filteredUsers.map(async (item) => {
        const nilai = await HistoryUjian.findOne({
          where: { 
            id_ujian, 
            id_user: item.id 
          },
          attributes: ['nilai']
        });

        const mapel = await MataPelajaran.findByPk(item.id_mapel);

        return {
          ...item.toJSON(),
          nilai: nilai ? nilai.nilai : null,
          diperiksa: nilai !== null,
          mapel: mapel ? mapel.mapel : '-'
        };
      })
    );

    res.json(usersWithNilai);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get users by tingkatan (kelas number only, e.g. 7, 8, 9)
 */
exports.getUsersByTingkatan = async (req, res) => {
  try {
    const { kelas } = req.params; // kelas should be '7', '8', or '9'

    const users = await User.findAll({
      where: {
        key_status: 'active',
        role: 'siswa',
        // kelas substring(1) == kelas (e.g. 'VIIA' -> '7')
        [Op.and]: [
          sequelize.where(
            sequelize.fn('substring', sequelize.col('kelas'), 1, 1),
            kelas
          )
        ]
      },
      attributes: { exclude: ['password'] },
      order: [['kelas', 'ASC'], ['nama', 'ASC']] // urutkan naik
    });

    const usersWithMapel = await Promise.all(
      users.map(async (user) => {
        let mapel = '-';
        if (user.role === 'guru' && user.id_mapel) {
          const mapelData = await MataPelajaran.findByPk(user.id_mapel);
          mapel = mapelData ? mapelData.mapel : '-';
        }
        return { ...user.toJSON(), mapel };
      })
    );

    res.json(usersWithMapel);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserRapotByKelas = async (req, res) => {
  try {
    const { kelas, id_mapel } = req.params;

    // Get all siswa in kelas
    const users = await User.findAll({
      where: {
        kelas,
        key_status: 'active',
        role: 'siswa'
      },
      attributes: { exclude: ['password'] }
    });

    // For each user, get UTS, UAS, and daily test scores from HistoryUjian
    const userRapotPromises = users.map(async (user) => {

      const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
      const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

      // Find UTS
      const uts = await HistoryUjian.findOne({
        where: {
          id_user: user.id,
          id_tahun_pelajaran
        },
        include: [{
          model: require('../models').Ujian,
          as: 'ujian',
          where: { id_mapel, tipe_ujian: 'uts' }
        }]
      });

      // Find UAS
      const uas = await HistoryUjian.findOne({
        where: {
          id_user: user.id,
          id_tahun_pelajaran
        },
        include: [{
          model: require('../models').Ujian,
          as: 'ujian',
          where: { id_mapel, tipe_ujian: 'uas' }
        }]
      });

      // Find all daily tests
      const dailyTests = await HistoryUjian.findAll({
        where: {
          id_user: user.id,
          id_tahun_pelajaran
        },
        include: [{
          model: require('../models').Ujian,
          as: 'ujian',
          where: { id_mapel, tipe_ujian: 'ujian harian' }
        }]
      });

      const laporanTugasSiswa = await PengumpulanTugas.findAll({
        where: { id_user: user.id },
        include: [{ 
          model: require('../models').Tugas,
          as: 'tugas',
          where: {kelas, id_tahun_pelajaran} 
        }]
      });

      const penilaianTugas = await PenilaianTugas.findAll({
        where: { id_user: user.id, id_mapel, id_tahun_pelajaran }
      });

      const penilaianTugasWithMapel = await Promise.all(
        penilaianTugas.map(async (item) => {
          const mapelData = await MataPelajaran.findByPk(item.id_mapel);
          return { ...item.toJSON(), mapel : mapelData.mapel ?? '-' };
        })
      );

      const mapelData = await MataPelajaran.findByPk(id_mapel);

      const userData = user.toJSON();
      userData.uts = uts ? uts.nilai.toString() : "-";
      userData.uas = uas ? uas.nilai.toString() : "-";
      userData.ujian_harian = dailyTests.map(test => ({
        id: test.ujian.id,
        nama: test.ujian.nama,
        nilai: test.nilai.toString()
      }));
      userData.laporan_tugas = laporanTugasSiswa.map(test => ({
        id: test.tugas.id,
        nama: test.tugas.nama,
        nilai: test.nilai.toString()
      }));
      userData.penilaian_tugas = penilaianTugasWithMapel;
      userData.mapel = mapelData ? mapelData.mapel : '-';

      return userData;
    });

    const userRapot = await Promise.all(userRapotPromises);

    res.json(
      userRapot
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add a new user (admin only)
 */
exports.addUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { email, password, nama, nis, nisn, role, kelas, agama, nomor_ortu, id_mapel, wali_kelas, poin, profpic } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, authConfig.bcryptSaltRounds);

    const user = await User.create({
      email,
      password: hashedPassword,
      nama,
      nis: nis || '-',
      nisn: nisn || '-',
      role,
      nomor_ortu,
      kelas: role === 'siswa' ? kelas : '-',
      agama: role === 'siswa' ? agama : '-',
      id_mapel: role === 'guru' ? id_mapel : 0,
      wali_kelas: wali_kelas || '-',
      poin: poin || 0,
      profpic: profpic || '-'
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update user kelas (promote/demote users by kelas)
 * req.body: { kelas: '7', notPromoted: [id_user1, id_user2, ...] }
 * Promote all users in kelas except those in notPromoted array
 */
exports.updateUserKelas = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { kelas, notPromoted } = req.params;
    
    if (!kelas) {
      return res.status(400).json({
        success: false,
        message: 'kelas is required'
      });
    }

    // Parse notPromoted dari string ke array integer
    let excludedIds = [];
    if (notPromoted) {
      try {
        if (notPromoted.startsWith('[') && notPromoted.endsWith(']')) {
          excludedIds = JSON.parse(notPromoted).map(id => parseInt(id));
        } else {
          excludedIds = [parseInt(notPromoted)];
        }
      } catch (error) {
        console.error('Error parsing notPromoted:', error);
        excludedIds = [];
      }
    }

    // Cari semua siswa di kelas tertentu
    const usersToPromote = await User.findAll({
      where: {
        role: 'siswa',
        key_status: 'active',
        id: { 
          [Op.notIn]: excludedIds.length > 0 ? excludedIds : [0]
        },
        [Op.and]: [
          sequelize.where(
            sequelize.fn('substring', sequelize.col('kelas'), 1, 1),
            kelas
          )
        ],
      }
    });

    if (kelas === '9') {
      // Kalau kelas 9 → set inactive, tidak dinaikkan ke 10
      await Promise.all(usersToPromote.map(user => {
        user.key_status = 'inactive';
        return user.save();
      }));

      return res.json({
        success: true,
        message: `All users from kelas 9 set to inactive`,
        updatedCount: usersToPromote.length,
        excludedIds
      });
    }

    // Kalau selain kelas 9 → normal naik kelas
    await Promise.all(usersToPromote.map(user => {
      const angkaKelas = parseInt(user.kelas, 10);
      const abjadKelas = user.kelas.substring(1);
      const nextKelas = (angkaKelas + 1).toString() + abjadKelas;

      user.kelas = nextKelas;
      return user.save();
    }));

    res.json({
      success: true,
      message: `Promoted users from kelas ${kelas} to ${parseInt(kelas) + 1}`,
      promotedCount: usersToPromote.length,
      excludedIds
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * Update user by admin
 */
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { id_user } = req.params;
    const { email, nama, nis, nisn, role, kelas, agama, nomor_ortu, id_mapel, wali_kelas, poin, profpic, key_status } = req.body;

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If email is being updated, check for uniqueness
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
      user.email = email;
    }

    if (nama !== undefined) user.nama = nama;
    if (nis !== undefined) user.nis = nis;
    if (nisn !== undefined) user.nisn = nisn;
    if (role !== undefined) user.role = role;
    if (nomor_ortu !== undefined) user.nomor_ortu = nomor_ortu;
    if (kelas !== undefined) user.kelas = role === 'siswa' ? kelas : '-';
    if (agama !== undefined) user.agama = role === 'siswa' ? agama : '-';
    if (id_mapel !== undefined) user.mapel = role === 'guru' ? mapel : 0;
    if (wali_kelas !== undefined) user.wali_kelas = wali_kelas;
    if (poin !== undefined) user.poin = poin;
    if (profpic !== undefined) user.profpic = profpic;
    if (key_status !== undefined) user.key_status = key_status;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Soft delete user (set key_status to 'inactive') - admin only
 */
exports.softDeleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    const { id_user } = req.params;

    const user = await User.findByPk(id_user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.key_status = 'inactive';
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User soft deleted successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};