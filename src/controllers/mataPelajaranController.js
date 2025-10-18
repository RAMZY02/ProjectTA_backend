const { MataPelajaran, User } = require('../models');

exports.getAllMataPelajaran = async (req, res) => {
  try {
    const mataPelajaran = await MataPelajaran.findAll({
      where: { key_status: 'active' }
    });
    res.json({ success: true, data: mataPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMataPelajaranById = async (req, res) => {
  try {
    const { id } = req.params;
    const mataPelajaran = await MataPelajaran.findByPk(id);
    if (!mataPelajaran) {
      return res.status(404).json({ success: false, message: 'Mata pelajaran not found' });
    }
    res.json({ success: true, data: mataPelajaran });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMataPelajaranSiswa = async (req, res) => {
  try {
    const { id_user } = req.params;
    const mataPelajaran = await MataPelajaran.findAll();
    if (!mataPelajaran) {
      return res.json(mataPelajaran);
    }
    const filteredMataPelajaran = await Promise.all(
      mataPelajaran.map(async (item) => {
        // Filter berdasarkan agama jika mata pelajaran terkait agama
        const namaMapel = item.mapel;

        const agamaRelatedSubjects = ['islam', 'hindu', 'kristen', 'katolik'];
        const isAgamaRelated = agamaRelatedSubjects.some(subject =>
          namaMapel.toLowerCase().includes(subject)
        );

        if (isAgamaRelated) {
          const user = await User.findByPk(id_user);
          if (!user || !namaMapel.toLowerCase().includes(user.agama.toLowerCase())) {
            return null; // Skip mapel jika agama user tidak sesuai
          }
        }

        return item;
      }
    ));

    const mapel = filteredMataPelajaran.filter(item => item !== null);
    res.json({ success: true, data: mapel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMataPelajaran = async (req, res) => {
  try {
    const { mapel } = req.body;
    
    // Validasi input
    if (!mapel) {
      return res.status(400).json({ success: false, message: 'Nama mata pelajaran harus diisi' });
    }
    
    // Cek apakah mata pelajaran sudah ada
    const existingMataPelajaran = await MataPelajaran.findOne({
      where: { mapel }
    });
    
    if (existingMataPelajaran) {
      return res.status(400).json({ success: false, message: 'Mata pelajaran sudah ada' });
    }
    
    // Buat mata pelajaran baru
    const newMataPelajaran = await MataPelajaran.create({
      mapel,
      key_status: 'active'
    });
    
    res.status(201).json({ 
      success: true, 
      message: 'Mata pelajaran created successfully', 
      data: newMataPelajaran 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMataPelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const { mapel, key_status } = req.body;
    
    const mataPelajaran = await MataPelajaran.findByPk(id);
    if (!mataPelajaran) {
      return res.status(404).json({ success: false, message: 'Mata pelajaran not found' });
    }
    
    // Jika mengubah nama mapel, cek apakah nama sudah digunakan
    if (mapel && mapel !== mataPelajaran.mapel) {
      const existingMataPelajaran = await MataPelajaran.findOne({
        where: { mapel }
      });
      
      if (existingMataPelajaran) {
        return res.status(400).json({ success: false, message: 'Nama mata pelajaran sudah digunakan' });
      }
    }
    
    await mataPelajaran.update({
      mapel: mapel || mataPelajaran.mapel,
      key_status: key_status || mataPelajaran.key_status
    });
    
    res.json({ 
      success: true, 
      message: 'Mata pelajaran updated successfully', 
      data: mataPelajaran 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMataPelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const mataPelajaran = await MataPelajaran.findByPk(id);
    
    if (!mataPelajaran) {
      return res.status(404).json({ success: false, message: 'Mata pelajaran not found' });
    }
    
    // Soft delete dengan mengubah status menjadi inactive
    await mataPelajaran.update({ key_status: 'inactive' });
    
    res.json({ success: true, message: 'Mata pelajaran deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.restoreMataPelajaran = async (req, res) => {
  try {
    const { id } = req.params;
    const mataPelajaran = await MataPelajaran.findByPk(id);
    
    if (!mataPelajaran) {
      return res.status(404).json({ success: false, message: 'Mata pelajaran not found' });
    }
    
    // Restore dengan mengubah status menjadi active
    await mataPelajaran.update({ key_status: 'active' });
    
    res.json({ success: true, message: 'Mata pelajaran restored successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};