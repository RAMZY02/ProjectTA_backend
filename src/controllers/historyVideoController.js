const { HistoryVideo, VideoEdukasi, LikeVideo, User, MataPelajaran } = require('../models');

exports.getAllHistory = async (req, res) => {
  try {
    const history = await HistoryVideo.findAll();
    res.json(history);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHistoryByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await HistoryVideo.findAll({
      where: { id_user: userId },
      order: [['timestamps', 'DESC']]
    });
    const historyWithVideo = await Promise.all(
      history.map(async (h) => {
      const video = await VideoEdukasi.findOne({ where: { id: h.id_video } });
      if (!video) {
        return {
        ...h.toJSON(),
        video: null,
        };
      }
      const likes = await LikeVideo.findAll({ where: { id_video: video.id, type: 'Y' } });
      const liked = likes.map((like) => like.id_user);
      const user = await User.findByPk(video.id_user);
      const mapelData = await MataPelajaran.findByPk(video.id_mapel);
      if (mapelData) {
        video.dataValues.mapel = mapelData.mapel;
      } else {
        video.dataValues.mapel = '-';
      }

      return {
        ...h.toJSON(),
        video: {
        ...video.dataValues,
        liked: liked,
        nama_user: user ? user.nama : null
        },
      };
      })
    );
    res.json(historyWithVideo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrUpdateHistory = async (req, res) => {
  try {
    const { id_user, id_video } = req.body;

    // Check if history already exists
    let history = await HistoryVideo.findOne({ where: { id_user, id_video } });

    if (history) {
      // Update the existing history's timestamp
      history = await history.update({ timestamps: new Date() });
    } else {
      // Create a new history record
      history = await HistoryVideo.create({ id_user, id_video });

      // Increment views on VideoEdukasi
      const video = await VideoEdukasi.findByPk(id_video);
      if (video) {
        await video.increment('views');
      }
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await HistoryVideo.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'History not found' });
    }
    res.json({ success: true, message: 'History deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};