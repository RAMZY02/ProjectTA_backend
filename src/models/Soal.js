module.exports = (sequelize, DataTypes) => {
  const Soal = sequelize.define('Soal', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_ujian: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipe: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    soal: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    opsi_a: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    opsi_b: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    opsi_c: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    opsi_d: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    opsi_e: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    jawaban: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    pembahasan: {
      type: DataTypes.TEXT('long'),
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
    link_file: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    link_audio: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    key_status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'soal',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Soal;
};