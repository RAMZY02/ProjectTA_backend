const { Soal } = require('../models');
const { Ujian } = require('../models');
const { JawabanSiswa } = require('../models');

exports.getAllSoal = async (req, res) => {
  try {
    const soal = await Soal.findAll({ where: { key_status: 'active' } });
    res.json({ success: true, data: soal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSoalByUjianId = async (req, res) => {
  try {
    const soal = await Soal.findAll({
      where: {
        id_ujian: req.params.id_ujian,
        key_status: 'active'
      }
    });

    if (soal.length === 0) {
      return res.status(404).json({ success: false, message: 'No soal found for the given ujian ID' });
    }

    res.json(soal);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSoalByUrutan = async (req, res) => {
  try {
    const { id_user, id_ujian } = req.params;

    // Ambil semua soal berdasarkan id_ujian dan key_status aktif
    const soalList = await Soal.findAll({
      where: { id_ujian, key_status: 'active' }
    });

    if (soalList.length === 0) {
      return res.status(404).json({ success: false, message: 'No soal found for the given ujian' });
    }

    // Cek apakah sudah ada jawaban_siswa untuk user dan ujian ini
    const existingJawaban = await JawabanSiswa.findAll({
      where: { id_user, id_ujian }
    });

    if (existingJawaban.length === 0) {
      // Generate urutan random unik untuk setiap soal
      const urutanArr = [];
      while (urutanArr.length < soalList.length) {
        const rand = Math.floor(Math.random() * soalList.length) + 1;
        if (!urutanArr.includes(rand)) urutanArr.push(rand);
      }

      // Insert ke jawaban_siswa
      await Promise.all(
        soalList.map((soal, idx) =>
          JawabanSiswa.create({
            id_user,
            id_ujian,
            id_soal: soal.id,
            urutan: urutanArr[idx],
            jawaban: '-',
            nilai: 0
          })
        )
      );
    }

    // Ambil jawaban_siswa yang sudah diinsert, urutkan berdasarkan urutan
    const jawabanSiswaList = await JawabanSiswa.findAll({
      where: { id_user, id_ujian },
      order: [['urutan', 'ASC']]
    });

    // Ambil soal sesuai urutan pada jawaban_siswa
    const soalWithUrutan = await Promise.all(
      jawabanSiswaList.map(async (jawaban) => {
        const soal = await Soal.findOne({
          where: { id: jawaban.id_soal, key_status: 'active' }
        });
        return soal ? { ...soal.toJSON(), jawabanSiswa: jawaban.jawaban } : null;
      })
    );

    const filteredSoalList = soalWithUrutan.filter(item => item !== null);

    res.json(filteredSoalList);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSoalByUjianIdandUserId = async (req, res) => {
  try {
    const soal = await Soal.findAll({
      where: {
      id_ujian: req.params.id_ujian,
      key_status: 'active'
      }
    });

    if (soal.length === 0) {
      return res.status(404).json({ success: false, message: 'No soal found for the given ujian ID' });
    }

    // Import JawabanSiswa model

    // Get id_user from request (assume from query or body)
    const id_user = req.params.id_user;

    // Attach jawabanSiswa to each soal
    const soalWithJawaban = await Promise.all(
      soal.map(async (item) => {
      const jawabanSiswa = await JawabanSiswa.findOne({
        where: {
        id_user: id_user,
        id_ujian: req.params.id_ujian,
        id_soal: item.id
        }
      });
      return {
        ...item.toJSON(),
        jawabanSiswa: jawabanSiswa ? jawabanSiswa.jawaban : null,
        nilaiSiswa: jawabanSiswa ? jawabanSiswa.nilai : null
      };
      })
    );

    res.json(soalWithJawaban);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSoal = async (req, res) => {
  try {
    const { id_ujian, tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_audio } = req.body;

    const newSoal = await Soal.create({ id_ujian, tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_audio });
    await Ujian.increment('jumlah_soal', { by: 1, where: { id: id_ujian } });
    res.status(201).json(newSoal);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSoal = async (req, res) => {
  try {
    const { tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_audio } = req.body;
    const [affectedRows] = await Soal.update(
      { tipe, soal, opsi_a, opsi_b, opsi_c, opsi_d, opsi_e, jawaban, pembahasan, link_video, link_gambar, link_audio },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Soal not found' });
    }

    const updatedSoal = await Soal.findByPk(req.params.id);
    res.json({ success: true, data: updatedSoal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSoal = async (req, res) => {
  try {
    const [affectedRows] = await Soal.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Soal not found' });
    }

    await Ujian.decrement('jumlah_soal', { by: 1, where: { id: req.body.id_ujian } });

    res.json({ success: true, message: 'Soal soft deleted (key_status set to inactive)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};