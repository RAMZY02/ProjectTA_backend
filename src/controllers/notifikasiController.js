const { Notifikasi } = require('../models');

exports.getAllNotifikasi = async (req, res) => {
  try {
    const notifikasi = await Notifikasi.findAll({ where: { id_user: req.user.id } });
    res.json(notifikasi);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotifikasi = async (req, res) => {
  try {
    const { judul, pesan } = req.body;
    const id_user = req.user.id;

    const notifikasi = await Notifikasi.create({ id_user, judul, pesan });
    res.status(201).json({ success: true, data: notifikasi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateNotifikasi = async (req, res) => {
  try {
    const { status } = req.body;
    const [affectedRows] = await Notifikasi.update({ status }, { where: { id: req.params.id } });

    const updatedNotifikasi = await Notifikasi.findByPk(req.params.id);
    res.json({ success: true, data: updatedNotifikasi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotifikasi = async (req, res) => {
  try {
    const affectedRows = await Notifikasi.destroy({ where: { id: req.params.id } });

    res.json({ success: true, message: 'Notifikasi deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    const [affectedRows] = await Notifikasi.update(
      { status: 'dibaca' },
      { where: { id, id_user } }
    );

    const updatedNotifikasi = await Notifikasi.findByPk(id);
    res.json({ success: true, data: updatedNotifikasi });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const id_user = req.user.id;

    const [affectedRows] = await Notifikasi.update(
      { status: 'dibaca' },
      { where: { id_user } }
    );

    res.json({ success: true, message: `${affectedRows} notifikasi marked as read` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};