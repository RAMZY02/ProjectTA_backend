module.exports = (sequelize, DataTypes) => {
  const PengumpulanTugas = sequelize.define('PengumpulanTugas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tugas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    link_video: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    link_gambar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    link_audio: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    link_file: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'pengumpulan_tugas',
    timestamps: false, // Karena sudah ada field timestamp manual
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return PengumpulanTugas;
};