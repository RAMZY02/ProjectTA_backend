const { Ujian, User } = require('../models');
const { MengikutiUjian } = require('../models');
const Op = require('sequelize').Op;

exports.getAllUjian = async (req, res) => {
  try {
    const ujian = await Ujian.findAll({ where: { key_status: 'active' } });
    const ujianWithGuruAndUserDone = await Promise.all(
      ujian.map(async (item) => {
        const guru = await User.findOne({ where: { id: item.id_guru } });

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await MengikutiUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        return {
          ...item.toJSON(),
          guru: guru ? guru.nama : null,
          userDone
        };
      })
    );
    res.json(ujianWithGuruAndUserDone);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUjianBelumSelesai = async (req, res) => {
  try {
    const now = new Date();

    const ujian = await Ujian.findAll({
      where: {
        key_status: 'active',
        [Op.or]: [
          {
            tanggal: {
              [Op.gt]: now.toISOString().slice(0, 10)
            }
          },
          {
            tanggal: {
              [Op.eq]: now.toISOString().slice(0, 10)
            },
            selesai: {
              [Op.gt]: now.toTimeString().slice(0, 8)
            }
          }
        ]
      }
    });

    const ujianWithGuruAndUserDone = await Promise.all(
      ujian.map(async (item) => {
        const guru = await User.findOne({ where: { id: item.id_guru } });

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await MengikutiUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        return {
          ...item.toJSON(),
          guru: guru ? guru.nama : null,
          userDone
        };
      })
    );

    res.json(ujianWithGuruAndUserDone);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUjianSedangBerlangsung = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 8);
    const { id_user } = req.query;

    // Cari ujian yang sedang berlangsung
    const ujianSedang = await Ujian.findAll({
      where: {
        key_status: 'active',
        tanggal: today,
        mulai: { [Op.lte]: currentTime },
        selesai: { [Op.gt]: currentTime }
      }
    });

    if (ujianSedang.length === 0) {
      return res.json(false);
    }

    // Cek kehadiran dan selesai di MengikutiUjian
    for (const ujian of ujianSedang) {
      const mengikuti = await MengikutiUjian.findOne({
        where: {
          id_user,
          id_ujian: ujian.id,
          kehadiran: "true",
          selesai: "false"
        }
      });

      if (mengikuti) {
        return res.json(true);
      }
    }

    res.json(false);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUjian = async (req, res) => {
  try {
    const {
      nama,
      mapel,
      tipe_soal,
      tipe_ujian,
      durasi,
      tanggal,
      mulai,
      selesai,
      deskripsi,
      id_guru
    } = req.body;

    const newUjian = await Ujian.create({
      nama,
      mapel,
      tipe_soal,
      tipe_ujian,
      durasi,
      tanggal,
      mulai,
      selesai,
      jumlah_soal : 0,
      deskripsi,
      id_guru,
      key_status: 'active'
    });

    res.status(201).json({ success: true, data: newUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUjian = async (req, res) => {
  try {
    const { nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, deskripsi, id_guru } = req.body;
    const [affectedRows] = await Ujian.update(
      { nama, mapel, tipe_soal, tipe_ujian, durasi, tanggal, mulai, selesai, deskripsi, id_guru },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ujian not found' });
    }

    const updatedUjian = await Ujian.findByPk(req.params.id);
    res.status(200).json({ success: true, data: updatedUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUjian = async (req, res) => {
  console.log(req.params.id_ujian);
  
  try {
    const [affectedRows] = await Ujian.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id_ujian } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Ujian not found' });
    }

    res.status(200).json({ success: true, message: 'Ujian set to inactive successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};