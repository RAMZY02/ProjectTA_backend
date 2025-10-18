module.exports = (sequelize, DataTypes) => {
    const HistoryTugas = sequelize.define('HistoryTugas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_pengumpulan_tugas: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        timestamps: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'history_tugas',
        timestamps: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    return HistoryTugas;
};
