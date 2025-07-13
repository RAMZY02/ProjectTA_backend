module.exports = (sequelize, DataTypes) => {
  const Hadiah = sequelize.define('Hadiah', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nama: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    poin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    stok: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    link_gambar: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '-'
    },
    kategori: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '-'
    },
    key_status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'hadiah',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Hadiah;
};