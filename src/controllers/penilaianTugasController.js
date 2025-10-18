const { PenilaianTugas, MataPelajaran, TahunPelajaran } = require('../models');

exports.getAllPenilaianTugas = async (req, res) => {
  try {
    const penilaian = await PenilaianTugas.findAll();
    const penilaianWithMapel = await Promise.all(
      penilaian.map(async (item) => {
        const mapelData = await MataPelajaran.findByPk(item.id_mapel);
        return { ...item.toJSON(), mapel : mapelData.mapel ?? '-' };
      })
    );
    res.json({ success: true, data: penilaianWithMapel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPenilaianTugasByCriteria = async (req, res) => {
  try {
    const { id_user, mapel, kolom } = req.params;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const penilaian = await PenilaianTugas.findOne({
      where: { id_user, mapel, kolom, id_tahun_pelajaran },
    });
    if (!penilaian) {
      return res.status(404).json({ success: false, message: 'Penilaian tugas not found' });
    }
    const mapelData = await MataPelajaran.findByPk(penilaian.id_mapel);
    penilaian.dataValues.mapel = mapelData ? mapelData.mapel : '-';
    res.json({ success: true, data: penilaian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrUpdatePenilaianTugas = async (req, res) => {
  try {
    const { id_user, id_mapel, kelas, kolom, nilai } = req.body;

    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

    // Check if the record already exists
    let penilaian = await PenilaianTugas.findOne({
      where: { id_user, id_mapel, kelas, kolom, id_tahun_pelajaran },
    });

    const mapelData = await MataPelajaran.findByPk(id_mapel);

    if (penilaian) {
      // If exists, update the nilai
      await penilaian.update({ nilai });
      res.json({ success: true, message: 'Penilaian tugas updated successfully', data: {...penilaian.toJSON(), mapel: mapelData ? mapelData.mapel : '-'} });
    } else {
      // If not exists, create a new record
      penilaian = await PenilaianTugas.create({ id_user, id_mapel, kelas, kolom, nilai, id_tahun_pelajaran });
      res.status(201).json({ success: true, message: 'Penilaian tugas created successfully', data: {...penilaian.toJSON(), mapel: mapelData ? mapelData.mapel : '-'}});
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePenilaianTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_user, id_mapel, kelas, kolom, nilai } = req.body;
    const penilaian = await PenilaianTugas.findByPk(id);
    if (!penilaian) {
      return res.status(404).json({ success: false, message: 'Penilaian tugas not found' });
    }
    await penilaian.update({
      id_user: id_user || penilaian.id_user,
      id_mapel: id_mapel || penilaian.id_mapel,
      kelas: kelas || penilaian.kelas,
      kolom: kolom || penilaian.kolom,
      nilai: nilai || penilaian.nilai,
    });
    res.json({ success: true, message: 'Penilaian tugas updated successfully', data: penilaian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePenilaianTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const penilaian = await PenilaianTugas.findByPk(id);
    if (!penilaian) {
      return res.status(404).json({ success: false, message: 'Penilaian tugas not found' });
    }
    await penilaian.destroy();
    res.json({ success: true, message: 'Penilaian tugas deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
