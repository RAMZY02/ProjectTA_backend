module.exports = (sequelize, DataTypes) => {
  const VideoEdukasi = sequelize.define('VideoEdukasi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    id_mapel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kelas: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    link_video: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    key_status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'active',
    }
  }, {
    tableName: 'video_edukasi',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
    engine: 'InnoDB'
  });

  return VideoEdukasi;
};