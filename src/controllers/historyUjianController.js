const { HistoryUjian, Ujian } = require('../models');

exports.getAllHistoryUjian = async (req, res) => {
  try {
    const history = await HistoryUjian.findAll();
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistoryUjianByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const history = await HistoryUjian.findAll({ where: { id_user: userId } });
    const historyWithUjian = await Promise.all(
      history.map(async (h) => {
        const ujian = await Ujian.findOne({ where: { id: h.id_ujian } });
        return {
          ...h.toJSON(),
          ujian: ujian ? ujian.toJSON() : null,
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
    const history = await HistoryUjian.findAll({ where: { id_user: userId } });
    const historyWithUjian = await Promise.all(
      history.map(async (h) => {
        const ujian = await Ujian.findOne({ where: { id: h.id_ujian, tipe_ujian: ['UTS', 'UAS'] } });
        if (ujian) {
          return {
            ...h.toJSON(),
            ujian: ujian.toJSON(),
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
    const { id_ujian, id_user, nilai } = req.body;
    const history = await HistoryUjian.create({ id_ujian, id_user, nilai });
    res.status(201).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHistoryUjian = async (req, res) => {
  try {
    const { id_ujian, id_user, nilai } = req.body;
    const [affectedRows] = await HistoryUjian.update({ id_ujian, id_user, nilai }, { where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'History ujian not found' });
    }
    const updated = await HistoryUjian.findByPk(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHistoryUjian = async (req, res) => {
  try {
    const affectedRows = await HistoryUjian.destroy({ where: { id: req.params.id } });
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'History ujian not found' });
    }
    res.json({ success: true, message: 'History ujian deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
