const { Kupon } = require('../models');
const { Hadiah } = require('../models');

exports.getAllKupon = async (req, res) => {
  try {
    const userId = req.params.userId;
    const kupon = await Kupon.findAll();
    const kuponWithHadiah = await Promise.all(
      kupon.map(async (k) => {
        const hadiah = await Hadiah.findOne({ where: { id: k.id_hadiah } });
        return {
          ...k.toJSON(),
          hadiah: hadiah ? hadiah.toJSON() : null,
        };
      })
    );
    return res.json(kuponWithHadiah);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getKuponByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const kupon = await Kupon.findAll({ 
      where: { 
        id_user: userId,
        status: 'unclaimed'
      } 
    });
    const kuponWithHadiah = await Promise.all(
      kupon.map(async (k) => {
        const hadiah = await Hadiah.findOne({ where: { id: k.id_hadiah } });
        return {
          ...k.toJSON(),
          hadiah: hadiah ? hadiah.toJSON() : null,
        };
      })
    );
    return res.json(kuponWithHadiah);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createKupon = async (req, res) => {
  try {
    const { id_hadiah, id_user, kode, tipe } = req.body;

    // Calculate the expiration date (1 month from now)
    const currentDate = new Date();
    const kadaluarsa = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    kadaluarsa.setDate(1);

    const kupon = await Kupon.create({ id_hadiah, id_user, kode, tipe, kadaluarsa });
    res.status(201).json(kupon);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateKupon = async (req, res) => {
  try {
    const { id_hadiah, kode, tipe, status } = req.body;
    const [affectedRows] = await Kupon.update({ id_hadiah, kode, tipe, status }, { where: { id: req.params.id } });

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kupon not found' });
    }

    const updatedKupon = await Kupon.findByPk(req.params.id);
    res.json({ success: true, data: updatedKupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.claimKupon = async (req, res) => {
  try {
    const kuponId = req.params.id;
    const [affectedRows] = await Kupon.update(
      { status: 'claimed' },
      { where: { id: kuponId } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kupon not found' });
    }

    const updatedKupon = await Kupon.findByPk(kuponId);
    res.json({ success: true, data: updatedKupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteKupon = async (req, res) => {
  try {
    const affectedRows = await Kupon.destroy({ where: { id: req.params.id } });

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kupon not found' });
    }

    res.json({ success: true, message: 'Kupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};