module.exports = (sequelize, DataTypes) => {
  const Notifikasi = sequelize.define('Notifikasi', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    warna: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    judul: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'belum dibaca'
    }
  }, {
    tableName: 'notifikasi',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Notifikasi;
};