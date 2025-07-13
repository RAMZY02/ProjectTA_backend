module.exports = (sequelize, DataTypes) => {
  const HistoryVideo = sequelize.define('HistoryVideo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_video: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamps: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    key_status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'history_video',
    timestamps: false
  });

  return HistoryVideo;
};