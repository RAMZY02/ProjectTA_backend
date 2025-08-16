module.exports = (sequelize, DataTypes) => {
  const JawabanSiswa = sequelize.define('JawabanSiswa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_soal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jawaban: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    nilai: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'jawaban_siswa',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return JawabanSiswa;
};