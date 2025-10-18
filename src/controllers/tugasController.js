const { Tugas, PengumpulanTugas, TahunPelajaran } = require('../models');

// GET all tugas
exports.getAllTugas = async (req, res) => {
  try {
    const tugas = await Tugas.findAll();
    res.json({ success: true, data: tugas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET tugas by kelas
exports.getTugasByKelas = async (req, res) => {
  try {
    const { kelas, id_user } = req.params;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const tugas = await Tugas.findAll({ where: { kelas, id_tahun_pelajaran } });

    if (!tugas || tugas.length === 0) {
      return res.status(404).json({ success: false, message: 'No tugas found for the specified kelas' });
    }

    const tugasWithSubmissionStatus = await Promise.all(
      tugas.map(async (tugasItem) => {
        const submission = await PengumpulanTugas.findOne({
          where: { id_user, id_tugas: tugasItem.id }
        });
        return {
          ...tugasItem.toJSON(),
          mengumpulkan: submission ? true : false
        };
      })
    );

    res.json({ success: true, data: tugasWithSubmissionStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET tugas by id_user
exports.getTugasByIdUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const tugas = await Tugas.findAll({ where: { id_user }, order: [['id', 'DESC']] });

    res.json(tugas);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE tugas
exports.createTugas = async (req, res) => {
  try {
    const {
      id_user,
      nama,
      deskripsi,
      kelas,
      link_video,
      link_gambar,
      link_audio,
      link_file,
      deadline,
      id_tahun_pelajaran
    } = req.body;

    const newTugas = await Tugas.create({
      id_user,
      nama,
      deskripsi,
      kelas,
      link_video: link_video || '-',
      link_gambar: link_gambar || '-',
      link_audio: link_audio || '-',
      link_file: link_file || '-',
      deadline,
      id_tahun_pelajaran
    });

    res.status(201).json({ 
      success: true, 
      message: 'Tugas created successfully', 
      data: newTugas 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE tugas
exports.updateTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_user,
      nama,
      deskripsi,
      kelas,
      link_video,
      link_gambar,
      link_audio,
      link_file,
      deadline
    } = req.body;

    const tugas = await Tugas.findByPk(id);

    if (!tugas) {
      return res.status(404).json({ success: false, message: 'Tugas not found' });
    }

    await tugas.update({
      id_user: id_user || tugas.id_user,
      nama: nama || tugas.nama,
      deskripsi: deskripsi || tugas.deskripsi,
      kelas: kelas || tugas.kelas,
      link_video: link_video || tugas.link_video,
      link_gambar: link_gambar || tugas.link_gambar,
      link_audio: link_audio || tugas.link_audio,
      link_file: link_file || tugas.link_file,
      deadline: deadline || tugas.deadline
    });

    res.json({ 
      success: true, 
      message: 'Tugas updated successfully', 
      data: tugas 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE tugas
exports.deleteTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const tugas = await Tugas.findByPk(id);

    if (!tugas) {
      return res.status(404).json({ success: false, message: 'Tugas not found' });
    }

    await tugas.destroy();

    res.json({ success: true, message: 'Tugas deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
