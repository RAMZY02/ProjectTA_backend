module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      nama: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      role: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          notEmpty: true,
          isIn: [['admin', 'guru', 'siswa']] // Example role values
        }
      },
      kelas: {
        type: DataTypes.STRING(2),
        allowNull: true,
        defaultValue: null
      },
      poin: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      profpic: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: '-'
      },
      timestamps: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      key_status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'active',
      }
    }, {
      tableName: 'users',
      timestamps: false, // Disable automatic createdAt/updatedAt
      charset: 'utf8mb4',
      collate: 'utf8mb4_0900_ai_ci'
    });
  
    return User;
  };