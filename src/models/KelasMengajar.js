module.exports = (sequelize, DataTypes) => {
    const KelasMengajar = sequelize.define('KelasMengajar', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        kelas: {
            type: DataTypes.STRING(2),
            allowNull: false,
            collate: 'utf8mb4_0900_ai_ci'
        },
        key_status: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'active',
            collate: 'utf8mb4_0900_ai_ci'
        }
    }, {
        tableName: 'kelas_mengajar',
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    return KelasMengajar;
};
