module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        email: {
          type: Sequelize.STRING(50),
          allowNull: false,
          collate: 'utf8mb4_0900_ai_ci'
        },
        password: {
          type: Sequelize.STRING(50),
          allowNull: false,
          collate: 'utf8mb4_0900_ai_ci'
        },
        nama: {
          type: Sequelize.STRING(255),
          allowNull: false,
          collate: 'utf8mb4_0900_ai_ci'
        },
        role: {
          type: Sequelize.STRING(5),
          allowNull: false,
          collate: 'utf8mb4_0900_ai_ci'
        },
        kelas: {
          type: Sequelize.STRING(2),
          allowNull: true,
          defaultValue: null,
          collate: 'utf8mb4_0900_ai_ci'
        },
        poin: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }, {
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
      });
  
      // Add unique constraint for email
      await queryInterface.addIndex('users', {
        fields: ['email'],
        unique: true,
        name: 'users_email_unique'
      });
    },
  
    down: async (queryInterface) => {
      await queryInterface.dropTable('users');
    }
  };