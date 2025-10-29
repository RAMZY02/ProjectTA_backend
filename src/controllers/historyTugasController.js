const { HistoryTugas, PengumpulanTugas } = require('../models');

exports.getAllHistoryTugas = async (req, res) => {
    try {
        const history = await HistoryTugas.findAll();
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getHistoryTugasByPengumpulanId = async (req, res) => {
    try {
        const { id_user, id_tugas } = req.params;
        const id_pengumpulan_tugas = await PengumpulanTugas.findOne({
            where: { id_user, id_tugas },
            attributes: ['id']
        }).then(record => record ? record.id : null);
        const history = await HistoryTugas.findAll({ where: { id_pengumpulan_tugas: id_pengumpulan_tugas } });
        res.json(history);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createHistoryTugas = async (req, res) => {
    try {
        const { id_user, id_tugas } = req.body;
        const id_pengumpulan_tugas = await PengumpulanTugas.findOne({
            where: { id_user, id_tugas },
            attributes: ['id']
        }).then(record => record ? record.id : null);
        const history = await HistoryTugas.create({ id_pengumpulan_tugas });
        res.status(201).json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateHistoryTugas = async (req, res) => {
    try {
        const { id_pengumpulan_tugas } = req.body;
        const [affectedRows] = await HistoryTugas.update(
            { id_pengumpulan_tugas },
            { where: { id: req.params.id } }
        );

        const updated = await HistoryTugas.findByPk(req.params.id);
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteHistoryTugas = async (req, res) => {
    try {
        const affectedRows = await HistoryTugas.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: 'History tugas deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
