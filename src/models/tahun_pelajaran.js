module.exports = (sequelize, DataTypes) => {
    const TahunPelajaran = sequelize.define('TahunPelajaran', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tahun: {
            type: DataTypes.STRING(9),
            allowNull: false,
            collate: 'utf8mb4_0900_ai_ci'
        },
        semester: {
            type: DataTypes.STRING(1),
            allowNull: false,
            collate: 'utf8mb4_0900_ai_ci'
        }
    }, {
        tableName: 'tahun_pelajaran',
        timestamps: false, // No timestamp columns in the table
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    return TahunPelajaran;
};
