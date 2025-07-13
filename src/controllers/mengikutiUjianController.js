const { MengikutiUjian } = require('../models');

exports.joinUjian = async (req, res) => {
  try {
    const { id_ujian } = req.body;
    const id_user = req.user.id;

    const mengikutiUjian = await MengikutiUjian.create({ id_user, id_ujian });
    res.status(201).json({ success: true, data: mengikutiUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStatusUjian = async (req, res) => {
  try {
    const mengikutiUjian = await MengikutiUjian.findByPk(req.params.id);
    if (!mengikutiUjian) {
      return res.status(404).json({ success: false, message: 'Ujian not found' });
    }
    res.json({ success: true, data: mengikutiUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};