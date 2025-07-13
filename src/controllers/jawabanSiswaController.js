const { JawabanSiswa } = require('../models');

exports.submitJawaban = async (req, res) => {
  try {
    const { id_ujian, id_soal, jawaban } = req.body;
    const id_user = req.user.id;

    const jawabanSiswa = await JawabanSiswa.create({ id_ujian, id_user, id_soal, jawaban });
    res.status(201).json({ success: true, data: jawabanSiswa });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJawabanById = async (req, res) => {
  try {
    const { userId, ujianId, soalId } = req.params;
    const jawabanSiswa = await JawabanSiswa.findOne({
      where: {
      id_user: userId,
      id_ujian: ujianId,
      id_soal: soalId
      }
    });
    if (!jawabanSiswa) {
      return res.status(404).json({ success: false, message: 'Jawaban not found' });
    }
    res.json(jawabanSiswa);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateJawaban = async (req, res) => {
  try {
    const { jawaban } = req.body;
    const [affectedRows] = await JawabanSiswa.update({ jawaban }, { where: { id: req.params.id } });

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Jawaban not found' });
    }

    const updatedJawaban = await JawabanSiswa.findByPk(req.params.id);
    res.json({ success: true, data: updatedJawaban });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};