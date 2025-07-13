const { Ujian, User } = require('../models');

exports.getAllUjian = async (req, res) => {
  try {
    const ujian = await Ujian.findAll({ where: { key_status: 'active' } });
    const ujianWithGuru = await Promise.all(
      ujian.map(async (item) => {
        const guru = await User.findOne({ where: { id: item.id_guru } });
        return {
          ...item.toJSON(),
          guru: guru ? guru.nama : null,
        };
      })
    );
    res.json(ujianWithGuru);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUjian = async (req, res) => {
  try {
    const { nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, jumlah_soal, deskripsi, id_guru } = req.body;

    const newUjian = await Ujian.create({ nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, jumlah_soal, deskripsi, id_guru });
    res.status(201).json({ success: true, data: newUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUjian = async (req, res) => {
  try {
    const { nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, jumlah_soal, deskripsi, id_guru } = req.body;
    const [affectedRows] = await Ujian.update(
      { nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, jumlah_soal, deskripsi, id_guru },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ujian not found' });
    }

    const updatedUjian = await Ujian.findByPk(req.params.id);
    res.status(200).json({ success: true, data: updatedUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUjian = async (req, res) => {
  console.log(req.params.id_ujian);
  
  try {
    const [affectedRows] = await Ujian.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id_ujian } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ujian not found' });
    }

    res.status(200).json({ success: true, message: 'Ujian set to inactive successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};