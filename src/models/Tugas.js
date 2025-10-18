module.exports = (sequelize, DataTypes) => {
  const Tugas = sequelize.define('Tugas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kelas: {
      type: DataTypes.STRING(50),
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
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    id_tahun_pelajaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'tugas',
    timestamps: false, // karena kita pakai field timestamp sendiri
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Tugas;
};
