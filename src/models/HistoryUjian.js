module.exports = (sequelize, DataTypes) => {
  const HistoryUjian = sequelize.define('HistoryUjian', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
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
    },
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    diperiksa: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: 'false'
    },
    timpstamps: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    id_tahun_pelajaran: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'history_ujian',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return HistoryUjian;
};
