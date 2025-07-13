const { HistoryVideo, VideoEdukasi, LikeVideo } = require('../models');

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

      return {
        ...h.toJSON(),
        video: {
        ...video.dataValues,
        liked: liked,
        },
      };
      })
    );
    res.json(historyWithVideo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createHistory = async (req, res) => {
    try {
        const { id_user, id_video } = req.body;
        const newHistory = await HistoryVideo.create({ id_user, id_video });

        // Tambahkan views pada VideoEdukasi
        const video = await VideoEdukasi.findByPk(id_video);
        if (video) {
            await video.increment('views');
        }

        res.status(201).json(newHistory);
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