const { Comment, User, LikeComment, MataPelajaran } = require('../models');

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({ where: { key_status: 'active' } });
    const commentsWithDetails = await Promise.all(
      comments.map(async (item) => {
        const user = await User.findOne({ where: { id: item.id_user } });
        const likes = await LikeComment.findAll({ where: { id_comment: item.id, type: 'Y' } });
        const liked = likes.map((like) => like.id_user);
        const mapelData = await MataPelajaran.findOne({ where: { id: user.id_mapel } });
        if (user && mapelData) {
          user.dataValues.mapel = mapelData.mapel;
        }
        else{
          user.dataValues.mapel = '-';
        }

        return {
          id: item.id,
          id_video: item.id_video,
          komentar: item.komentar,
          user: user ? user : null,
          likes: likes.length,
          liked,
          waktu: item.waktu,
        };
      })
    );
    res.json(commentsWithDetails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { id_video, komentar } = req.body;
    const id_user = req.user.id;

    const comment = await Comment.create({ id_video, id_user, komentar });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCommentAdmin = async (req, res) => {
  try {
    const { id_video, komentar, id_user } = req.body;

    const comment = await Comment.create({ id_video, id_user, komentar });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }
    res.json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentByVideoId = async (req, res) => {
  try {
    const { id_video } = req.params;
    const comments = await Comment.findAll({ where: { id_video, key_status: 'active' } });
    const commentsWithDetails = await Promise.all(
      comments.map(async (item) => {
        const user = await User.findOne({ where: { id: item.id_user } });
        const likes = await LikeComment.findAll({ where: { id_comment: item.id, type: 'Y' } });
        const liked = likes.map((like) => like.id_user);
        const mapelData = await MataPelajaran.findOne({ where: { id: user.id_mapel } });
        if (user && mapelData) {
          user.dataValues.mapel = mapelData.mapel;
        }
        else{
          user.dataValues.mapel = '-';
        }

        return {
          id: item.id,
          id_video: item.id_video,
          komentar: item.komentar,
          user: user ? user : null,
          likes: likes.length,
          liked,
          waktu: item.waktu,
        };
      })
    );

    if (comments.length === 0) {
      return res.status(404).json({ success: false, message: 'No comments found for this video' });
    }

    res.json(commentsWithDetails);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_video, komentar, id_user } = req.body;
    const [affectedRows] = await Comment.update(
      { id_video, komentar, id_user },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const updatedComment = await Comment.findByPk(id);
    res.json({ success: true, data: updatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const [affectedRows] = await Comment.update(
      { key_status: 'inactive' },
      { where: { id } }
    );

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.json({ success: true, message: 'Comment soft-deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.likeComment = async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const { commentId } = req.params;

    // Check if the comment exists
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if the user already liked the comment
    const existingLike = await LikeComment.findOne({ where: { id_comment: commentId, id_user: userId, type: 'Y' } });
    if (existingLike) {
      return res.status(400).json({ success: false, message: 'User already liked this comment' });
    }

    const existingNetral = await LikeComment.findOne({ where: { id_comment: commentId, id_user: userId, type: '-' } });
    if(existingNetral) {
      await LikeComment.update(
        { type: 'Y' },
        { where: { id_comment: commentId, id_user: userId, type: '-' } }
      );
    }
    else{
      // Add the like
      await LikeComment.create({ id_comment: commentId, id_video: videoId, id_user: userId, type: 'Y' });
    }


    // Fetch updated comment details
    const likes = await LikeComment.findAll({ where: { id_comment: commentId, type: 'Y' } });
    const likedUsers = likes.map((like) => like.id_user);
    const user = await User.findOne({ where: { id: comment.id_user } });

    await Comment.increment('likes', { by: 1, where: { id: commentId } });

    const response = {
      id: comment.id,
      id_video: comment.id_video,
      komentar: comment.komentar,
      user: user ?  user : null,
      likes: likes.length,
      liked : likedUsers,
      waktu: comment.waktu,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const { userId, videoId } = req.body;
    const { commentId } = req.params;

    // Check if the comment exists
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if the user has liked the comment
    const existingLike = await LikeComment.findOne({ where: { id_comment: commentId, id_user: userId, type: 'Y' } });
    if (!existingLike) {
      return res.status(400).json({ success: false, message: 'User has not liked this comment' });
    }

    // Remove the like
    await LikeComment.update(
      { type: '-' },
      { where: { id_comment: commentId, id_user: userId, type: 'Y' } }
    );

    // Fetch updated comment details
    const likes = await LikeComment.findAll({ where: { id_comment: commentId, type: 'Y' } });
    const likedUsers = likes.map((like) => like.id_user);
    const user = await User.findOne({ where: { id: comment.id_user } });

    await Comment.decrement('likes', { by: 1, where: { id: commentId } });

    const response = {
      id: comment.id,
      id_video: comment.id_video,
      komentar: comment.komentar,
      user: user ?  user : null,
      likes: likes.length,
      liked : likedUsers,
      waktu: comment.waktu,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





