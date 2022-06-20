import Announcement from '../models/announcement.js';
import User from '../models/user.js';

const getAnnouncements = async (req, res) => {
  /**
   * Get all annoucements
   */
  try {
    const announcements = await Announcement.find({});
    return res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnnouncementById = async (req, res) => {
  /**
   * Get annoucement
   */
  try {
    const announcement = await Announcement.findById(req.params.id);
    return res.status(200).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewAnnouncement = async (req, res) => {
  /**
   * Create new annoucement
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

    const announcement = await Announcement.create({
      content,
      author: userID,
    });

    return res.status(201).json(announcement);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const editAnnouncement = async (req, res) => {
  /**
   * Edit annoucement
   * User must be logged in
   * User must be the author of the annoucement
   */
  try {
    const { newContent, announcementId } = req.body;
    const { userID } = req.user;

    // Validate user input
    if (!(newContent || announcementId || userID)) {
      return res
        .status(400)
        .send('Missing required fields one of [newContent, announcementId]');
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).send('Announcement not found');
    }

    if (announcement.author.toString() !== userID) {
      return res
        .status(401)
        .send('You are not the author of this announcement');
    }

    await announcement.updateOne({ content: newContent });

    return res.status(200).json(announcement);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likeAnnouncement = async (req, res) => {
  /**
   * Like annoucement
   * User must be logged in
   * If user already liked the announcement, it will be removed from the list
   */
  try {
    const { announcementId } = req.body;
    const { userID } = req.user;

    // Validate user input
    if (!(announcementId || userID)) {
      return res
        .status(400)
        .send('Missing required fields one of [announcementId]');
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).send('Announcement not found');
    }

    if (announcement.likes.includes(userID)) {
      // Remove user from likes if he already liked the announcement
      await announcement.updateOne({
        $pull: { likes: userID },
      });

      return res.status(200).json(announcement);
    }

    await announcement.updateOne({
      $push: { likes: userID },
    });

    return res.status(200).json(announcement);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  /**
   * Delete annoucement
   * User must be logged in
   * User must be the author of the annoucement or admin
   */
  try {
    const { announcementId } = req.params;
    const { userID } = req.user;

    // Validate user input
    if (!(announcementId || userID)) {
      return res
        .status(400)
        .send('Missing required fields one of [announcementId]');
    }

    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).send('Announcement not found');
    }

    const connectedUser = await User.findById(userID);

    if (!connectedUser) {
      return res.status(404).send('User not found');
    }

    if (
      announcement.author.toString() !== userID &&
      connectedUser.role !== 'admin'
    ) {
      return res
        .status(401)
        .send('You are not the author of this announcement nor an admin');
    }

    await announcement.remove();

    return res.status(200).json(announcement);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  createNewAnnouncement,
  editAnnouncement,
  likeAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getAnnouncementById,
};
