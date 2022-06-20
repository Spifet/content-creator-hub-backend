import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateMyPassword,
  updateMyProfile,
} from '../../controllers/users.js';
import { authFirewall } from '../../middleware/auth.js';

const router = Router();

// @route   GET all users
router.get('/', getUsers);

// @route   GET user by id
router.get('/:id', getUser);

// @route   POST create user MUST BE AUTHENTICATED
router.post('/', authFirewall, createUser);

// @route   DELETE user by id MUST BE AUTHENTICATED AND ADMIN
router.delete('/:user_to_delete', authFirewall, deleteUser);

// @route   PUT update user profile MUST BE AUTHENTICATED
router.put('/update-profile', authFirewall, updateMyProfile);

// @route   PUT update user password MUST BE AUTHENTICATED
router.put('/update-password', authFirewall, updateMyPassword);

// @route   GET currently connected user profile MUST BE AUTHENTICATED
router.get('/me', authFirewall, getMe);

export default router;
