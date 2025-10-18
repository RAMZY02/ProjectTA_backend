const { KelasMengajar } = require('../models');

exports.getAllKelasMengajar = async (req, res) => {
    try {
        const kelasMengajar = await KelasMengajar.findAll();
        res.json({ success: true, data: kelasMengajar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getKelasMengajarById = async (req, res) => {
    try {
        const { id } = req.params;
        const kelasMengajar = await KelasMengajar.findByPk(id);

        if (!kelasMengajar) {
            return res.status(404).json({ success: false, message: 'Kelas Mengajar not found' });
        }

        res.json({ success: true, data: kelasMengajar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getKelasMengajarByUserId = async (req, res) => {
    try {
        const { id_user } = req.params;
        const kelasMengajar = await KelasMengajar.findAll({ 
            where: { id_user },
            order: [['kelas', 'ASC']] // Sort by 'kelas' in ascending order
        });

        if (kelasMengajar.length === 0) {
            return res.status(404).json({ success: false, message: 'No Kelas Mengajar found for this user' });
        }

        res.json({ success: true, data: kelasMengajar });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createKelasMengajar = async (req, res) => {
    try {
        const { id_user, kelas, key_status } = req.body;

        const newKelasMengajar = await KelasMengajar.create({
            id_user,
            kelas,
            key_status: key_status || 'active'
        });

        res.status(201).json({ 
            success: true, 
            message: 'Kelas Mengajar created successfully', 
            data: newKelasMengajar 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateKelasMengajar = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_user, kelas, key_status } = req.body;

        const kelasMengajar = await KelasMengajar.findByPk(id);

        if (!kelasMengajar) {
            return res.status(404).json({ success: false, message: 'Kelas Mengajar not found' });
        }

        await kelasMengajar.update({
            id_user: id_user || kelasMengajar.id_user,
            kelas: kelas || kelasMengajar.kelas,
            key_status: key_status || kelasMengajar.key_status
        });

        res.json({ 
            success: true, 
            message: 'Kelas Mengajar updated successfully', 
            data: kelasMengajar 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteKelasMengajar = async (req, res) => {
    try {
        const { id } = req.params;

        const kelasMengajar = await KelasMengajar.findByPk(id);

        if (!kelasMengajar) {
            return res.status(404).json({ success: false, message: 'Kelas Mengajar not found' });
        }

        await kelasMengajar.destroy();

        res.json({ success: true, message: 'Kelas Mengajar deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
