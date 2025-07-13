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
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'tidak hadir'
    }
  }, {
    tableName: 'mengikuti_ujian',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return MengikutiUjian;
};