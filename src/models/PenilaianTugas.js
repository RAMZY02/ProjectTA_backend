module.exports = (sequelize, DataTypes) => {
    const PenilaianTugas = sequelize.define('PenilaianTugas', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_mapel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        kelas: {
            type: DataTypes.STRING(2),
            allowNull: false,
        },
        kolom: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nilai: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tahun_pelajaran: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'penilaian_tugas',
        timestamps: false, // Tidak ada kolom timestamp di tabel
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    return PenilaianTugas;
};
