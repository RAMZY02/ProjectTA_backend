module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_video: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    komentar: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    waktu: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    key_status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    tableName: 'comments',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return Comment;
};