import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 140,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
