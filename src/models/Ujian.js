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
    id_mapel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tingkatan: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '-'
    },
    kelas: {
      type: DataTypes.STRING(2),
      allowNull: false,
      defaultValue: '-'
    },
    tipe_soal: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    tipe_ujian: {
      type: DataTypes.STRING(50),
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
      allowNull: false,
      defaultValue: 0
    },
    deskripsi: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    id_guru: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tahun_pelajaran: {
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