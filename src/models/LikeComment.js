module.exports = (sequelize, DataTypes) => {
  const LikeComment = sequelize.define('LikeComment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_comment: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_video: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.CHAR(1),
      allowNull: false,
      defaultValue: '-',
      collate: 'utf8mb4_0900_ai_ci'
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'like_comment',
    timestamps: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci'
  });

  return LikeComment;
};