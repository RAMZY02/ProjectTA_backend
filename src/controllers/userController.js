const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, nama, role, kelas } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, authConfig.bcryptSaltRounds);

    const user = await User.create({
      email,
      password: hashedPassword,
      nama,
      role,
      kelas: role === 'siswa' ? kelas : null
    });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
      token: generateToken(user)
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
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

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      success: true,
      data: userResponse,
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

    res.json(updatedUser);
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

    // Update poin
    user.poin = poin;
    await user.save();

    // Remove password from response
    const userResponse = user.toJSON();
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

    res.json(users);
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
exports.getUsersByKelas = async (req, res) => {
  try {

    const { kelas } = req.params;

    const users = await User.findAll({
      where: {
        kelas,
        key_status: 'active',
        role: 'siswa'
      },
      attributes: { exclude: ['password'] }
    });

    res.json(users);
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

    const { email, password, nama, role, kelas } = req.body;
    console.log(`Adding user: ${email}, Role: ${role}, Kelas: ${kelas}`);
    

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
      role,
      kelas: role === 'siswa' ? kelas : '-'
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
    const { email, nama, role, kelas} = req.body;

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
    if (role !== undefined) user.role = role;
    if (kelas !== undefined) user.kelas = role === 'siswa' ? kelas : '-';

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