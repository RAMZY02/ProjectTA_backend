const { HistoryUjian, Ujian, MataPelajaran, TahunPelajaran } = require('../models');

exports.getAllHistoryUjian = async (req, res) => {
  try {
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const history = await HistoryUjian.findAll({ where: { id_tahun_pelajaran } });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistoryUjianByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const history = await HistoryUjian.findAll({ where: { id_user: userId, id_tahun_pelajaran } });
    const historyWithUjian = await Promise.all(
      history.map(async (h) => {
        const ujian = await Ujian.findOne({ where: { id: h.id_ujian } });
        const mapelData = await MataPelajaran.findOne({ where: { id: ujian.id_mapel } });
        return {
          ...h.toJSON(),
          ujian: ujian ? {
            ...ujian.toJSON(),
            mapel: mapelData ? mapelData.mapel : '-',
          } : '-',
        };
      })
    );
    res.json(historyWithUjian);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistoryUjianByUserIdUTSandUAS = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const history = await HistoryUjian.findAll({ where: { id_user: userId, id_tahun_pelajaran } });
    const historyWithUjian = await Promise.all(
      history.map(async (h) => {
        const ujian = await Ujian.findOne({ where: { id: h.id_ujian, tipe_ujian: ['UTS', 'UAS'] } });
        
        if (ujian) {
          const mapelData = await MataPelajaran.findOne({ where: { id: ujian.id_mapel } });
          return {
            ...h.toJSON(),
            ujian: ujian ? {
              ...ujian.toJSON(),
              mapel: mapelData ? mapelData.mapel : '-',
            } : '-',
          };
        }
        return null;
      })
    );
    
    const filteredHistory = historyWithUjian.filter(item => item !== null);
    res.json(filteredHistory);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHistoryUjian = async (req, res) => {
  try {
    const { id_ujian, id_user, nilai, kehadiran = 'true', selesai = 'false', diperiksa = 'false' } = req.body;
    const tahunPelajaran = await TahunPelajaran.findOne({ order: [['id', 'DESC']] });
    const id_tahun_pelajaran = tahunPelajaran ? tahunPelajaran.id : 1;
    const history = await HistoryUjian.create({ id_ujian, id_user, nilai, kehadiran, selesai, diperiksa, id_tahun_pelajaran });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHistoryUjian = async (req, res) => {
  try {
    const { id_ujian, id_user, nilai, kehadiran, selesai, diperiksa } = req.body;
    const [affectedRows] = await HistoryUjian.update(
      { id_ujian, id_user, nilai, kehadiran, selesai, diperiksa },
      { where: { id_ujian, id_user } }
    );

    const updated = await HistoryUjian.findByPk(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHistoryUjian = async (req, res) => {
  try {
    const affectedRows = await HistoryUjian.destroy({ where: { id: req.params.id } });

    res.json({ success: true, message: 'History ujian deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
