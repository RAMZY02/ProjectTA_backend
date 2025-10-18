module.exports = (sequelize, DataTypes) => {
    const NilaiAkhirSiswa = sequelize.define('NilaiAkhirSiswa', {
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
            collate: 'utf8mb4_0900_ai_ci'
        },
        nilai_akhir: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        capaian_kompetensi: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
        },
        submited: {
            type: DataTypes.STRING(5),
            allowNull: false,
            defaultValue: 'false',
        },
        id_tahun_pelajaran: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'nilai_akhir_siswa',
        timestamps: false, // Tidak ada kolom timestamp di tabel
        charset: 'utf8mb4',
        collate: 'utf8mb4_0900_ai_ci'
    });

    return NilaiAkhirSiswa;
};
