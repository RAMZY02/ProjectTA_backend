module.exports = (sequelize, DataTypes) => {
  const MataPelajaran = sequelize.define('MataPelajaran', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mapel: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    key_status: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: 'active',
    }
  }, {
    tableName: 'mata_pelajaran',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return MataPelajaran;
};