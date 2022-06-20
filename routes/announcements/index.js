import { Router } from 'express';
import {
  createNewAnnouncement,
  editAnnouncement,
  likeAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getAnnouncementById,
} from '../../controllers/annoucements.js';
import { authFirewall } from '../../middleware/auth.js';

const router = Router();

// @route   GET all announcements
router.get('/', getAnnouncements);

// @route   GET announcement by id
router.get('/:id', getAnnouncementById);

// @route   POST create announcement MUST BE AUTHENTICATED
router.post('/', authFirewall, createNewAnnouncement);

// @route   PUT edit announcement MUST BE AUTHENTICATED AND AUTHOR
router.put('/update-announcement', authFirewall, editAnnouncement);

// @route   DELETE announcement MUST BE AUTHENTICATED AND ADMIN OR AUTHOR
router.delete('/:announcementId', authFirewall, deleteAnnouncement);

// @route   POST like announcement MUST BE AUTHENTICATED, if already liked, unlike
router.post('/:id/like', authFirewall, likeAnnouncement);

export default router;


