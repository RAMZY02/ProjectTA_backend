const { Ujian, User, HistoryUjian, MataPelajaran, TahunPelajaran } = require('../models');
const Op = require('sequelize').Op;

exports.getAllUjian = async (req, res) => {
  try {
    const ujian = await Ujian.findAll({ where: { key_status: 'active'} });
    const ujianWithGuruAndUserDone = await Promise.all(
      ujian.map(async (item) => {
        const guru = await User.findOne({ where: { id: item.id_guru } });
        
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(item.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await HistoryUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        // Hitung jumlah siswa berdasarkan id_ujian
        const totalSiswa = await HistoryUjian.count({
          where: { id_ujian: item.id, selesai: 'true' }
        });

        const diperiksa = await HistoryUjian.count({
          where: { id_ujian: item.id, diperiksa: 'true' }
        });

        return {
          ...item.toJSON(),
          guru: guru ? guru.nama : null,
          mapel: namaMapel, // Mengganti ID mapel dengan nama mapel
          userDone,
          totalSiswa: totalSiswa ?? 0,
          diperiksa: diperiksa ?? 0
        };
      })
    );
    res.json(ujianWithGuruAndUserDone);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUjianByIdMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    const ujian = await Ujian.findAll({
      where: {
        key_status: 'active',
        id_mapel 
      }
    });

    const ujianWithGuruAndUserDone = await Promise.all(
      ujian.map(async (item) => {
        const guru = await User.findOne({ where: { id: item.id_guru } });
        
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(item.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await HistoryUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        // Hitung jumlah siswa berdasarkan id_ujian
        const totalSiswa = await HistoryUjian.count({
          where: { id_ujian: item.id, selesai: 'true' }
        });

        const diperiksa = await HistoryUjian.count({
          where: { id_ujian: item.id, diperiksa: 'true' }
        });

        return {
          ...item.toJSON(),
          guru: guru ? guru.nama : null,
          mapel: namaMapel,
          userDone,
          totalSiswa: totalSiswa ?? 0,
          diperiksa: diperiksa ?? 0
        };
      })
    );

    res.json(ujianWithGuruAndUserDone);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUjianByIdGuru = async (req, res) => {
  try {
    const { id_guru } = req.params;

    const ujian = await Ujian.findAll({
      where: {
        key_status: 'active',
        id_guru
      },
      order: [['id', 'DESC']] // Sort by createdAt in descending order
    });

    if (!ujian || ujian.length === 0) {
      return res.json(ujian);
    }

    const ujianWithDetails = await Promise.all(
      ujian.map(async (item) => {
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(item.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await HistoryUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        // Hitung jumlah siswa berdasarkan id_ujian
        const totalSiswa = await HistoryUjian.count({
          where: { id_ujian: item.id, selesai: 'true' }
        });

        const diperiksa = await HistoryUjian.count({
          where: { id_ujian: item.id, diperiksa: 'true' }
        });

        return {
          ...item.toJSON(),
          mapel: namaMapel, // Mengganti ID mapel dengan nama mapel
          userDone,
          totalSiswa: totalSiswa ?? 0,
          diperiksa: diperiksa ?? 0
        };
      })
    );

    res.json(ujianWithDetails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getKoreksiUjianByIdGuru = async (req, res) => {
  try {
    const { id_guru } = req.params;

    const ujian = await Ujian.findAll({
      where: {
        key_status: 'active',
        id_guru,
        tipe_soal: { [Op.ne]: 'Pilihan Ganda' } // Exclude ujian with tipe_soal 'Pilihan Ganda'
      },
      order: [['id', 'DESC']] // Sort by createdAt in descending order
    });

    if (!ujian || ujian.length === 0) {
      return res.json(ujian);
    }

    const ujianWithDetails = await Promise.all(
      ujian.map(async (item) => {
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(item.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await HistoryUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        // Hitung jumlah siswa berdasarkan id_ujian
        const totalSiswa = await HistoryUjian.count({
          where: { id_ujian: item.id, selesai: 'true' }
        });

        const diperiksa = await HistoryUjian.count({
          where: { id_ujian: item.id, diperiksa: 'true' }
        });

        return {
          ...item.toJSON(),
          mapel: namaMapel, // Mengganti ID mapel dengan nama mapel
          userDone,
          totalSiswa: totalSiswa ?? 0,
          diperiksa: diperiksa ?? 0
        };
      })
    );

    res.json(ujianWithDetails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUjianHarianByIdMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    const ujian = await Ujian.findAll({
      where: {
        key_status: 'active',
        id_mapel,
        tipe_ujian: 'ujian harian'
      }
    });

    res.json(ujian);
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
        [Op.and]: [
          {
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
          },
          {
            [Op.or]: [
              {
                kelas: req.params.kelas,
              },
              {
                tingkatan: req.params.kelas.substring(0, 1),
              }
            ]
          }
        ]
      }
    });

    const ujianWithGuruAndUserDone = await Promise.all(
      ujian.map(async (item) => {
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(item.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';

        // Filter berdasarkan agama jika mata pelajaran terkait agama
        const agamaRelatedSubjects = ['islam', 'hindu', 'kristen', 'katolik'];
        const isAgamaRelated = agamaRelatedSubjects.some(subject =>
          namaMapel.toLowerCase().includes(subject)
        );

        if (isAgamaRelated) {
          const user = await User.findByPk(req.params.id_user); // Ambil data user berdasarkan id_user
          if (!user || !namaMapel.toLowerCase().includes(user.agama.toLowerCase())) {
            return null; // Skip ujian jika agama user tidak sesuai
          }
        }

        const guru = await User.findOne({ where: { id: item.id_guru } });

        // Ambil semua user yang sudah selesai ujian ini
        const mengikuti = await HistoryUjian.findAll({
          where: { id_ujian: item.id, selesai: "true" },
          attributes: ['id_user']
        });
        const userDone = mengikuti.map(m => m.id_user);

        return {
          ...item.toJSON(),
          mapel: namaMapel, // Mengganti ID mapel dengan nama mapel
          guru: guru ? guru.nama : null,
          userDone
        };
      })
    );

    // Filter out null values (ujian yang tidak sesuai agama)
    const filteredUjian = ujianWithGuruAndUserDone.filter(item => item !== null);

    res.json(filteredUjian);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUjianSedangBerlangsung = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentTime = now.toTimeString().slice(0, 8);
    const { id_user } = req.params;

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
      return res.status(404).json(ujianSedang);
    }

    // Cek kehadiran dan selesai di HistoryUjian
    for (const ujian of ujianSedang) {
      const mengikuti = await HistoryUjian.findOne({
        where: {
          id_user,
          id_ujian: ujian.id,
          kehadiran: "true",
          selesai: "false"
        }
      });

      if (mengikuti) {
        // Ambil data mata pelajaran berdasarkan ID
        const mataPelajaran = await MataPelajaran.findByPk(ujian.id_mapel);
        const namaMapel = mataPelajaran ? mataPelajaran.mapel : 'Unknown';
        
        // Return the exam data with subject name
        return res.status(200).json({
          ...ujian.toJSON(),
          mapel: namaMapel,
        });
      }
    }

    // If no exam found where user is participating
    res.status(404).json({ message: "Tidak ada ujian yang sedang diikuti" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUjian = async (req, res) => {
  try {
    const {
      nama,
      id_mapel,
      tingkatan,
      kelas,
      tipe_soal,
      tipe_ujian,
      tanggal,
      mulai,
      selesai,
      deskripsi,
      kode,
      id_guru
    } = req.body;

    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;

    const newUjian = await Ujian.create({
      nama,
      id_mapel,
      tingkatan,
      kelas,
      tipe_soal,
      tipe_ujian,
      tanggal,
      mulai,
      selesai,
      jumlah_soal : 0,
      deskripsi,
      kode,
      id_guru,
      key_status: 'active',
      id_tahun_pelajaran
    });

    res.status(201).json({ success: true, data: newUjian });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUjian = async (req, res) => {
  try {
    const { nama, id_mapel, tingkatan, kelas, tipe_soal, tipe_ujian, tanggal, mulai, selesai, deskripsi, id_guru } = req.body;
    const [affectedRows] = await Ujian.update(
      { nama, id_mapel, tingkatan, kelas, tipe_soal, tipe_ujian, tanggal, mulai, selesai, deskripsi, id_guru },
      { where: { id: req.params.id } }
    );

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


    res.status(200).json({ success: true, message: 'Ujian set to inactive successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};