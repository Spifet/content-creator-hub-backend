import { Router } from 'express';
import {
  getComments,
  getCommentById,
  createNewComment,
  editComment,
  likeComment,
  deleteComment,
} from '../../controllers/comments.js';
import { authFirewall } from '../../middleware/auth.js';

const router = Router();

// @route   GET all comments
router.get('/', getComments);

// @route   GET comment by id
router.get('/:id', getCommentById);

// @route   POST create comment MUST BE AUTHENTICATED
router.post('/', authFirewall, createNewComment);

// @route   PUT edit comment MUST BE AUTHENTICATED AND AUTHOR
router.put('/update-comment', authFirewall, editComment);

// @route   DELETE comment MUST BE AUTHENTICATED AND ADMIN OR AUTHOR
router.delete('/:commentId', authFirewall, deleteComment);

// @route   POST like comment MUST BE AUTHENTICATED, if already liked, unlike
router.post('/:id/like', authFirewall, likeComment);

export default router;
