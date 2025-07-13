module.exports = (sequelize, DataTypes) => {
  const VideoEdukasi = sequelize.define('VideoEdukasi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mata_pelajaran: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    link_video: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    kelas: {
      type: DataTypes.CHAR(1),
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
    durasi: {
      type: DataTypes.TIME,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: false
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