module.exports = (sequelize, DataTypes) => {
  const Kupon = sequelize.define('Kupon', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_hadiah: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    kode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    tipe: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'unclaimed'
    }
  }, {
    tableName: 'kupon',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Kupon;
};