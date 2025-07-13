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
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timpstamps: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'history_ujian',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return HistoryUjian;
};
