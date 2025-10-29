const e = require('express');
const { Hadiah, User, MataPelajaran } = require('../models');

exports.getAllHadiah = async (req, res) => {
  try {
    const hadiah = await Hadiah.findAll({
      where: { key_status: 'active' }
    });
    res.json(hadiah);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHadiah = async (req, res) => {
  try {
    const { nama, poin, stok, link_gambar, kategori, key_status } = req.body;
    const hadiah = await Hadiah.create({
      nama,
      poin,
      stok,
      link_gambar: link_gambar || '-',
      kategori: kategori || '-',
      key_status: key_status || 'active'
    });
    res.status(201).json({ success: true, data: hadiah });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHadiah = async (req, res) => {
  try {
    const { nama, poin, stok, link_gambar, kategori, key_status } = req.body;
    const [affectedRows] = await Hadiah.update(
      { 
        nama, 
        poin, 
        stok, 
        link_gambar: link_gambar || '-', 
        kategori: kategori || '-', 
        key_status: key_status || 'active' 
      },
      { where: { id: req.params.id } }
    );

    const updatedHadiah = await Hadiah.findByPk(req.params.id);
    res.json({ success: true, data: updatedHadiah });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHadiah = async (req, res) => {
  try {
    const [affectedRows] = await Hadiah.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id } }
    );

    res.json({ success: true, message: 'Hadiah soft deleted (key_status set to inactive)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.tukarHadiah = async (req, res) => {
  try {
    const { userId, hadiahId } = req.body;

    // Ambil user dan hadiah
    const user = await User.findByPk(userId);
    const hadiah = await Hadiah.findByPk(hadiahId);
    const mapelData = await MataPelajaran.findByPk(user.id_mapel);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }
    if (!hadiah) {
      return res.status(404).json({ success: false, message: 'Hadiah tidak ditemukan' });
    }

    // Cek poin user
    if (user.poin < hadiah.poin) {
      return res.status(400).json({ success: false, message: 'Poin tidak mencukupi' });
    }

    // Cek stok hadiah
    if (hadiah.stok < 1) {
      return res.status(400).json({ success: false, message: 'Tidak ada stok' });
    }

    // Transaksi: kurangi poin user dan stok hadiah
    user.poin -= hadiah.poin;
    hadiah.stok -= 1;
    await user.save();
    await hadiah.save();

    res.json({user: {...user.toJSON(), mapel : mapelData ? mapelData.mapel : '-'}, hadiah : hadiah});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};