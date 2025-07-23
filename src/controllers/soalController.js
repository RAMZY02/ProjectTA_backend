const { Soal } = require('../models');
const { Ujian } = require('../models');

exports.getAllSoal = async (req, res) => {
  try {
    const soal = await Soal.findAll({ where: { key_status: 'active' } });
    res.json({ success: true, data: soal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSoalByUjianId = async (req, res) => {
  try {
    const soal = await Soal.findAll({
      where: {
        id_ujian: req.params.id_ujian,
        key_status: 'active'
      }
    });

    if (soal.length === 0) {
      return res.status(404).json({ success: false, message: 'No soal found for the given ujian ID' });
    }

    res.json(soal);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSoal = async (req, res) => {
  try {
    const { id_ujian, tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_file, link_audio } = req.body;

    const newSoal = await Soal.create({ id_ujian, tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_file, link_audio });
    await Ujian.increment('jumlah_soal', { by: 1, where: { id: id_ujian } });
    res.status(201).json(newSoal);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSoal = async (req, res) => {
  try {
    const { tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_file, link_audio } = req.body;
    const [affectedRows] = await Soal.update(
      { tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_file, link_audio },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Soal not found' });
    }

    const updatedSoal = await Soal.findByPk(req.params.id);
    res.json({ success: true, data: updatedSoal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSoal = async (req, res) => {
  try {
    const [affectedRows] = await Soal.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Soal not found' });
    }

    await Ujian.decrement('jumlah_soal', { by: 1, where: { id: req.body.id_ujian } });

    res.json({ success: true, message: 'Soal soft deleted (key_status set to inactive)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};