const { MengikutiUjian } = require('../models');

exports.joinUjian = async (req, res) => {
  try {
    const { id_user, id_ujian } = req.body;

    const mengikutiUjian = await MengikutiUjian.create({ id_user, id_ujian });
    res.status(201).json({ success: true, data: mengikutiUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSelesai = async (req, res) => {
  try {
    const { id_user, id_ujian } = req.params;
    const [updated] = await MengikutiUjian.update(
      { selesai: 'true' },
      { where: { id_user, id_ujian } }
    );
    if (updated === 0) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Field selesai updated to true' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMengikutiUjianById = async (req, res) => {
  try {
    const { id_user, id_ujian } = req.params;
    const mengikutiUjian = await MengikutiUjian.findOne({
      where: { id_user, id_ujian }
    });
    if (!mengikutiUjian) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json(mengikutiUjian);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllMengikutiUjian = async (req, res) => {
  try {
    const mengikutiUjianList = await MengikutiUjian.findAll();
    res.json({ success: true, data: mengikutiUjianList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};