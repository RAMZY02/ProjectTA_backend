const { PengumpulanTugas, User } = require('../models');

exports.getAllPengumpulan = async (req, res) => {
  try {
    const pengumpulan = await PengumpulanTugas.findAll();
    res.json({ success: true, data: pengumpulan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPengumpulanByTugasId = async (req, res) => {
  try {
    const { id_tugas } = req.params;
    const pengumpulan = await PengumpulanTugas.findAll({
      where: { id_tugas }
    });

    const pengumpulWithUser = await Promise.all(pengumpulan.map(async (item) => {
      const user = await User.findByPk(item.id_user, {
        exclude: ['password']
      });
      return {
        ...item.toJSON(),
        siswa: user || null // Tambahkan informasi user jika ada
      };
    }));

    res.json(pengumpulWithUser);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getPengumpulanByUserId = async (req, res) => {
  try {
    const { id_user } = req.params;
    const pengumpulan = await PengumpulanTugas.findAll({
      where: { id_user }
    });

    res.json({ success: true, data: pengumpulan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPengumpulanByTugasAndUser = async (req, res) => {
  try {
    const { id_tugas, id_user } = req.params;
    const pengumpulan = await PengumpulanTugas.findOne({
      where: { id_tugas, id_user }
    });

    if (!pengumpulan) {
      return res.status(404).json({ success: false, message: 'Pengumpulan not found' });
    }

    res.json({ success: true, data: pengumpulan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrUpdatePengumpulan = async (req, res) => {
  try {
    const {
      id_user,
      id_tugas,
      link_video,
      link_gambar,
      link_audio,
      link_file,
      deskripsi,
      nilai
    } = req.body;

    // Check if the record already exists
    let pengumpulan = await PengumpulanTugas.findOne({
      where: { id_user, id_tugas }
    });

    if (pengumpulan) {
      // Update the existing record
      await pengumpulan.update({
        link_video: link_video || pengumpulan.link_video,
        link_gambar: link_gambar || pengumpulan.link_gambar,
        link_audio: link_audio || pengumpulan.link_audio,
        link_file: link_file || pengumpulan.link_file,
        deskripsi: deskripsi || pengumpulan.deskripsi,
        nilai: nilai || pengumpulan.nilai
      });

      return res.json({ 
        success: true, 
        message: 'Pengumpulan tugas updated successfully', 
        data: pengumpulan 
      });
    }

    // Create a new record if it doesn't exist
    const newPengumpulan = await PengumpulanTugas.create({
      id_user,
      id_tugas,
      link_video: link_video || '-',
      link_gambar: link_gambar || '-',
      link_audio: link_audio || '-',
      link_file: link_file || '-',
      deskripsi: deskripsi || '-',
      nilai: nilai || 0
    });

    res.status(201).json({ 
      success: true, 
      message: 'Pengumpulan tugas created successfully', 
      data: newPengumpulan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePengumpulan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      link_video,
      link_gambar,
      link_audio,
      link_file,
      deskripsi,
      nilai
    } = req.body;

    const pengumpulan = await PengumpulanTugas.findByPk(id);

    if (!pengumpulan) {
      return res.status(404).json({ success: false, message: 'Pengumpulan not found' });
    }

    await pengumpulan.update({
      link_video: link_video || pengumpulan.link_video,
      link_gambar: link_gambar || pengumpulan.link_gambar,
      link_audio: link_audio || pengumpulan.link_audio,
      link_file: link_file || pengumpulan.link_file,
      deskripsi: deskripsi || pengumpulan.deskripsi,
      nilai: nilai || pengumpulan.nilai
    });

    res.json({ 
      success: true, 
      message: 'Pengumpulan tugas updated successfully', 
      data: pengumpulan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePengumpulanNilai = async (req, res) => {
  try {
    const { id, nilai } = req.params;

    const pengumpulan = await PengumpulanTugas.findByPk(id);

    if (!pengumpulan) {
      return res.status(404).json({ success: false, message: 'Pengumpulan not found' });
    }

    await pengumpulan.update({ nilai: nilai || pengumpulan.nilai });

    res.json({ 
      success: true, 
      message: 'Nilai updated successfully', 
      data: pengumpulan 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePengumpulan = async (req, res) => {
  try {
    const { id } = req.params;
    const pengumpulan = await PengumpulanTugas.findByPk(id);

    if (!pengumpulan) {
      return res.status(404).json({ success: false, message: 'Pengumpulan not found' });
    }

    await pengumpulan.destroy();

    res.json({ success: true, message: 'Pengumpulan tugas deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};