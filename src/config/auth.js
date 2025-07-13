require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'edukasiin_aja',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
};