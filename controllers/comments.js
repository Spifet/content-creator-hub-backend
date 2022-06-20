import Comment from '../models/comment.js';
import User from '../models/user.js';

const getComments = async (req, res) => {
  /**
   * Get all comments
   */
  try {
    const comments = await Comment.find({});
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getCommentById = async (req, res) => {
  /**
   * Get comment
   */
  try {
    const comment = await Comment.findById(req.params.id);
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createNewComment = async (req, res) => {
  /**
   * Create new comment
   * User must be logged in
   */
  try {
    const { content } = req.body;
    const { userID } = req.user;

    // Validate user input
    if (!(content || userID)) {
      return res
        .status(400)
        .send('Missing required fields one of [content, userID]');
    }

    const comment = await Comment.create({
      content,
      author: userID,
    });

    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const editComment = async (req, res) => {
  /**
   * Edit comment
   * User must be logged in
   * User must be the author of the comment
   */
  try {
    const { newContent, commentId } = req.body;
    const { userID } = req.user;

    // Validate user input
    if (!(newContent || userID)) {
      return res
        .status(400)
        .send('Missing required fields one of [newContent, userID]');
    }

    const comment = await Comment.findById(commentId);

    if (comment.author.toString() !== userID) {
      return res.status(401).send('You are not the author of this comment');
    }

    comment.updateOne({ content: newContent });

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likeComment = async (req, res) => {
  /**
   * Like comment
   * User must be logged in
   * If user already liked the comment, it will be removed from the list
   */
  try {
    const { commentId } = req.body;
    const { userID } = req.user;

    // Validate user input
    if (!(commentId || userID)) {
      return res.status(400).send('Missing required fields one of [commentId]');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    if (comment.likes.includes(userID)) {
      // Remove user from likes if he already liked the comment
      await comment.updateOne({
        $pull: { likes: userID },
      });

      return res.status(200).json(comment);
    }

    await comment.updateOne({
      $push: { likes: userID },
    });

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteComment = async (req, res) => {
  /**
   * Delete comment
   * User must be logged in
   * User must be the author of the comment or admin
   */
  try {
    const { commentId } = req.params;
    const { userID } = req.user;

    // Validate user input
    if (!(commentId || userID)) {
      return res.status(400).send('Missing required fields one of [commentId]');
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    const connectedUser = await User.findById(userID);

    if (!connectedUser) {
      return res.status(404).send('User not found');
    }

    if (
      comment.author.toString() !== userID &&
      connectedUser.role !== 'admin'
    ) {
      return res
        .status(401)
        .send('You are not the author of this comment nor an admin');
    }

    await comment.remove();

    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  getComments,
  getCommentById,
  createNewComment,
  editComment,
  likeComment,
  deleteComment,
};
