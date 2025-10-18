const { TahunPelajaran } = require('../models');

exports.getAllTahunPelajaran = async (req, res) => {
  try {
    const tahunPelajaran = await TahunPelajaran.findAll();
    res.json({ success: true, data: tahunPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTahunPelajaranById = async (req, res) => {
  try {
    const { id } = req.params;
    const tahunPelajaran = await TahunPelajaran.findByPk(id);
    if (!tahunPelajaran) {
      return res.status(404).json({ success: false, message: 'Tahun pelajaran not found' });
    }
    res.json({ success: true, data: tahunPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTahunPelajaran = async (req, res) => {
  try {
    const { tahun, semester } = req.body;
    const tahunPelajaran = await TahunPelajaran.create({ tahun, semester });
    res.status(201).json({ success: true, message: 'Tahun pelajaran created successfully', data: tahunPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTahunPelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { tahun, semester } = req.body;
    const tahunPelajaran = await TahunPelajaran.findByPk(id);
    if (!tahunPelajaran) {
      return res.status(404).json({ success: false, message: 'Tahun pelajaran not found' });
    }
    await tahunPelajaran.update({ tahun: tahun || tahunPelajaran.tahun, semester: semester || tahunPelajaran.semester });
    res.json({ success: true, message: 'Tahun pelajaran updated successfully', data: tahunPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTahunPelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const tahunPelajaran = await TahunPelajaran.findByPk(id);
    if (!tahunPelajaran) {
      return res.status(404).json({ success: false, message: 'Tahun pelajaran not found' });
    }
    await tahunPelajaran.destroy();
    res.json({ success: true, message: 'Tahun pelajaran deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
