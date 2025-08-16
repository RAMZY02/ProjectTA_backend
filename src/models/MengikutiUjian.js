module.exports = (sequelize, DataTypes) => {
  const MengikutiUjian = sequelize.define('MengikutiUjian', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    kehadiran: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: 'true'
    },
    selesai: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: 'false'
    }
  }, {
    tableName: 'mengikuti_ujian',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return MengikutiUjian;
};