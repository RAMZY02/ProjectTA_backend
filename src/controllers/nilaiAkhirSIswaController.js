const { NilaiAkhirSiswa, MataPelajaran, TahunPelajaran, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../models').sequelize;

exports.getAllNilaiAkhirSiswa = async (req, res) => {
  try {
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const nilaiAkhir = await NilaiAkhirSiswa.findAll({ where: { id_tahun_pelajaran } });
    const nilaiWithMapel = await Promise.all(
      nilaiAkhir.map(async (nilai) => {
        const mapelData = await MataPelajaran.findByPk(nilai.id_mapel);
        return { ...nilai.toJSON(), mapel: mapelData ? mapelData.mapel : '-' };
      })
    );
    res.json({ success: true, data: nilaiWithMapel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNilaiAkhirSiswaById = async (req, res) => {
  try {
    const { id } = req.params;
    const nilaiAkhir = await NilaiAkhirSiswa.findByPk(id);
    if (!nilaiAkhir) {
      return res.status(404).json({ success: false, message: 'Nilai akhir siswa not found' });
    }
    const mapelData = await MataPelajaran.findByPk(nilaiAkhir.id_mapel);
    const nilaiWithMapel = { ...nilaiAkhir.toJSON(), mapel: mapelData ? mapelData.mapel : '-' };
    res.json({ success: true, data: nilaiWithMapel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNilaiAkhirSiswaByMapelAndKelas = async (req, res) => {
  try {
    const { id_mapel, kelas } = req.params;
    const mapelData = await MataPelajaran.findOne({ where: { id: id_mapel } });
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const nilaiAkhir = await NilaiAkhirSiswa.findAll({
      where: {
        id_mapel: id_mapel,
        kelas,
        id_tahun_pelajaran
      },
    });
    if (nilaiAkhir.length === 0) {
      return res.status(404).json({ success: false, message: 'No nilai akhir siswa found for the specified mapel and kelas' });
    }
    const nilaiWithMapel = await Promise.all(
      nilaiAkhir.map(async (nilai) => {
        return { ...nilai.toJSON(), mapel: mapelData ? mapelData.mapel : '-' };
      })
    );
    res.json({ success: true, data: nilaiWithMapel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRapotWaliKelas = async (req, res) => {
  try {
    const { kelas } = req.params;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

    const mapelList = await MataPelajaran.findAll();
    if (mapelList.length === 0) {
      return res.status(404).json({ success: false, message: 'No mata pelajaran found' });
    }

    const nilaiCountByMapel = await NilaiAkhirSiswa.findAll({
      attributes: ['id_mapel', [sequelize.fn('COUNT', sequelize.col('id_mapel')), 'count']],
      where: { id_tahun_pelajaran, kelas, submited: 'true' },
      group: ['id_mapel'],
    });
    
    const siswa = await User.count({ where: { kelas, role: 'siswa', key_status: 'active'} });
    const siswaIslam = await User.count({ where: { kelas, role: 'siswa', key_status: 'active', agama: 'Islam'} });
    const siswaHindu = await User.count({ where: { kelas, role: 'siswa', key_status: 'active', agama: 'Hindu'} });
    const siswaKristen = await User.count({ where: { kelas, role: 'siswa', key_status: 'active', agama: 'Kristen'} });
    const siswaKatolik = await User.count({ where: { kelas, role: 'siswa', key_status: 'active', agama: 'Katolik'} });

    const nilaiWithMapel = nilaiCountByMapel.map((item) => {
      const mapel = mapelList.find((mapel) => mapel.id === item.id_mapel);
      return {
        id_mapel: item.id_mapel,
        mapel: mapel ? mapel.mapel : '-',
        jumlah_terkirim: item.dataValues.count,
      };
    });
    res.json({ success: true, data: nilaiWithMapel, mapelList, siswa, siswaIslam, siswaHindu, siswaKristen, siswaKatolik });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNilaiAkhirSiswa = async (req, res) => {
  try {
    const { id_user, id_mapel, kelas, nilai_akhir, capaian_kompetensi } = req.body;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const nilaiAkhir = await NilaiAkhirSiswa.create({ id_user, id_mapel, kelas, nilai_akhir, capaian_kompetensi, id_tahun_pelajaran });
    res.status(201).json({ success: true, message: 'Nilai akhir siswa created successfully', data: nilaiAkhir });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createAllNilaiAkhirSiswa = async (req, res) => {
  try {
    const { nilai_akhir_list } = req.body;

    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

    const results = await Promise.all(
      nilai_akhir_list.map(async (nilai) => {
        const existing = await NilaiAkhirSiswa.findOne({
          where: {
            id_user: nilai.id_user,
            id_mapel: nilai.id_mapel,
            kelas: nilai.kelas,
            id_tahun_pelajaran
          },
        });

        if (existing) {
          return await existing.update({
            nilai_akhir: nilai.nilai_akhir,
            submited: 'true',
          });
        } else {
          return await NilaiAkhirSiswa.create({
            id_user: nilai.id_user,
            id_mapel: nilai.id_mapel,
            kelas: nilai.kelas,
            nilai_akhir: nilai.nilai_akhir,
            capaian_kompetensi: nilai.capaian_kompetensi,
            submited: 'true',
            id_tahun_pelajaran
          });
        }
      })
    );

    res.json({
      success: true,
      message: `${results.length} nilai akhir berhasil disimpan`,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createOrUpdateNilaiAkhirSiswa = async (req, res) => {
  try {
    const { id_user, id_mapel, kelas, nilai_akhir, capaian_kompetensi } = req.body;

    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

    const existing = await NilaiAkhirSiswa.findOne({
      where: { id_user, id_mapel, kelas, id_tahun_pelajaran },
    });

    if (existing) {
      await existing.update({
        nilai_akhir: nilai_akhir || existing.nilai_akhir,
        capaian_kompetensi: capaian_kompetensi || existing.capaian_kompetensi,
      });
      res.json({
        success: true,
        message: 'Nilai akhir siswa updated successfully',
        data: existing,
      });
    } else {
      const newNilaiAkhir = await NilaiAkhirSiswa.create({
        id_user,
        id_mapel,
        kelas,
        nilai_akhir,
        capaian_kompetensi,
        id_tahun_pelajaran
      });
      res.status(201).json({
        success: true,
        message: 'Nilai akhir siswa created successfully',
        data: newNilaiAkhir,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNilaiAkhirSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user, id_mapel, kelas, nilai_akhir, capaian_kompetensi } = req.body;
    const nilaiAkhir = await NilaiAkhirSiswa.findByPk(id);
    if (!nilaiAkhir) {
      return res.status(404).json({ success: false, message: 'Nilai akhir siswa not found' });
    }
    await nilaiAkhir.update({
      id_user: id_user || nilaiAkhir.id_user,
      id_mapel: id_mapel || nilaiAkhir.id_mapel,
      kelas: kelas || nilaiAkhir.kelas,
      nilai_akhir: nilai_akhir || nilaiAkhir.nilai_akhir,
      capaian_kompetensi: capaian_kompetensi || nilaiAkhir.capaian_kompetensi,
    });
    res.json({ success: true, message: 'Nilai akhir siswa updated successfully', data: nilaiAkhir });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNilaiAkhirSiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const nilaiAkhir = await NilaiAkhirSiswa.findByPk(id);
    if (!nilaiAkhir) {
      return res.status(404).json({ success: false, message: 'Nilai akhir siswa not found' });
    }
    await nilaiAkhir.destroy();
    res.json({ success: true, message: 'Nilai akhir siswa deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
