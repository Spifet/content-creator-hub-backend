import { hashPassword, comparePassword } from '../helpers/passwordHash.js';
import User from '../models/user.js';
import { createToken } from '../utils/jwt.js';

const getUsers = async (req, res) => {
  /**
   * get all users from the DB
   */
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  /**
   * req.params.id is the id of the user we want to get
   */
  try {
    const user = await User.findById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  /**
   * user.userID comes from the verfiyToken middleware that extract the userID
   * from the currently sent token aka the connected user
   *
   */
  try {
    const user = await User.findById(req.user.userID);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  /**
   * req.body contains params for the user we want to create
   */
  try {
    // phone number is optional
    // email must be unique
    const { firstName, lastName, email, password, confirmPassword, phone } =
      req.body;

    // Validate user input
    if (!(email || password || firstName || lastName)) {
      return res
        .status(400)
        .send(
          'Missing required fields one of [email, password, firstName, lastName]'
        );
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: await hashPassword(password),
      phone: phone || '',
      token: '',
    });

    const token = createToken(user._id, user.email);

    user.updateOne({ token });

    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateMyProfile = async (req, res) => {
  /**
   * req.body contains params for the user we want to update
   * req.user.userID comes from the verfiyToken middleware that extract the userID
   * from the currently sent token aka the connected user
   */
  try {
    const { firstName, lastName, phone, email } = req.body;
    const { userID } = req.user;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    user.updateOne({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone,
      email: email || user.email,
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateMyPassword = async (req, res) => {
  /**
   * req.user.userID comes from the verfiyToken middleware that extract the userID
   * from the currently sent token aka the connected user
   */
  try {
    const { password, confirmPassword, oldPassword } = req.body;
    const { userID } = req.user;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).send('User Not Found');
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Passwords do not match');
    }

    if (!(await comparePassword(oldPassword, user.password))) {
      return res.status(400).send('Old Password is incorrect');
    }

    user.updateOne({ password: await hashPassword(password) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  /**
   * req.params.user_to_delete is the id of the user we want to delete
   * req.user.userID comes from the verfiyToken middleware that extract the userID
   * from the currently sent token aka the connected user
   */
  try {
    const { user_to_delete } = req.params; // user_to_delete is the id of the user we want to delete
    const { userID } = req.user; // userID is the id of the connected user
    const userConnected = await User.findById(userID);

    if (!userConnected) {
      return res.status(404).send('User Connected Not Found');
    }

    // Only the user connected can delete his own account or if connected user is admin
    if (
      userConnected._id.toString() !== user_to_delete ||
      userConnected.role !== 'admin'
    ) {
      return res.status(401).send('You are not authorized to delete this user');
    }

    const userToDelete = await User.findById(user_to_delete);

    if (!userToDelete) {
      return res.status(404).send('User To Delete Not Found');
    }

    await userToDelete.remove();

    return res.status(200).json({ message: 'User Deleted', userToDelete });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export {
  getUsers,
  getUser,
  getMe,
  createUser,
  updateMyProfile,
  updateMyPassword,
  deleteUser,
};