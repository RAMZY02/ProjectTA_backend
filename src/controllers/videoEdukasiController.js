const { VideoEdukasi, LikeVideo} = require('../models');

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await VideoEdukasi.findAll({ where: { key_status: 'active' } });
    const videosWithDetails = await Promise.all(
      videos.map(async (item) => {
        const likes = await LikeVideo.findAll({ where: { id_video: item.id, type: 'Y' } });
        const liked = likes.map((like) => like.id_user);

        return {
          ...item.dataValues,
          liked: liked,
        };
      })
    );
    res.json(videosWithDetails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLastIdVideo = async (req, res) => {
  try {
    const lastVideo = await VideoEdukasi.findOne({
      order: [['id', 'DESC']]
    });

    if (!lastVideo) {
      return res.status(404).json({ success: false, message: 'No videos found' });
    }

    res.json({idvideo : lastVideo.id});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createVideo = async (req, res) => {
  try {
    const { id_user, judul, mata_pelajaran, link_video, kelas, views, likes, deskripsi } = req.body;

    const newVideo = await VideoEdukasi.create({
      id_user,
      judul,
      mata_pelajaran,
      link_video,
      kelas,
      views: views || 0,
      likes: likes || 0,
      deskripsi,
      key_status: 'active'
    });
    res.status(201).json({ success: true, data: newVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateVideo = async (req, res) => {
  try {
    const { judul, mata_pelajaran, link_video, kelas, views, likes, deskripsi } = req.body;
    const [affectedRows] = await VideoEdukasi.update(
      { judul, mata_pelajaran, link_video, kelas, views, likes, deskripsi },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    const updatedVideo = await VideoEdukasi.findByPk(req.params.id);
    res.json({ success: true, data: updatedVideo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const [affectedRows] = await VideoEdukasi.update(
      { key_status: 'inactive' },
      { where: { id: req.params.id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    res.json({ success: true, message: 'Video soft deleted (key_status set to inactive)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    // Check if the video exists
    const video = await VideoEdukasi.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if the user already liked the video
    const existingLike = await LikeVideo.findOne({ where: { id_video: videoId, id_user: userId, type: 'Y' } });
    if (existingLike) {
      return res.status(400).json({ success: false, message: 'User already liked this video' });
    }

    const existingNetral = await LikeVideo.findOne({ where: { id_video: videoId, id_user: userId, type: '-' } });
    if (existingNetral) {
      await LikeVideo.update(
        { type: 'Y' },
        { where: { id_video: videoId, id_user: userId, type: '-' } }
      );
    } else {
      await LikeVideo.create({ id_video: videoId, id_user: userId, type: 'Y' });
    }

    await VideoEdukasi.increment('likes', { by: 1, where: { id: videoId } });

    // Fetch updated video details
    const likes = await LikeVideo.findAll({ where: { id_video: videoId, type: 'Y' } });
    const likedUsers = likes.map((like) => like.id_user);

    res.json({
      ...video.dataValues,
      likes: video.likes + 1,
      liked: likedUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unlikeVideo = async (req, res) => {
  try {
    const { userId } = req.body;
    const { videoId } = req.params;

    // Check if the video exists
    const video = await VideoEdukasi.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if the user has liked the video
    const existingLike = await LikeVideo.findOne({ where: { id_video: videoId, id_user: userId, type: 'Y' } });
    if (!existingLike) {
      return res.status(400).json({ success: false, message: 'User has not liked this video' });
    }

    await LikeVideo.update(
      { type: '-' },
      { where: { id_video: videoId, id_user: userId, type: 'Y' } }
    );

    await VideoEdukasi.decrement('likes', { by: 1, where: { id: videoId } });

    // Fetch updated video details
    const likes = await LikeVideo.findAll({ where: { id_video: videoId, type: 'Y' } });
    const likedUsers = likes.map((like) => like.id_user);

    res.json({
      ...video.dataValues,
      likes: video.likes - 1,
      liked: likedUsers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};