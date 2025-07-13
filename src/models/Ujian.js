module.exports = (sequelize, DataTypes) => {
  const Ujian = sequelize.define('Ujian', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    mapel: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tipe_soal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tipe_ujian: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    durasi: {
      type: DataTypes.TIME,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    mulai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    selesai: {
      type: DataTypes.TIME,
      allowNull: false
    },
    jumlah_soal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deskripsi: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    id_guru: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    key_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'ujian',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Ujian;
};