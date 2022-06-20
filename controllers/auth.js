import { comparePassword, hashPassword } from '../helpers/passwordHash.js';
import User from '../models/user.js';
import { createToken } from '../utils/jwt.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user && (await comparePassword(password, user.password))) {
      const token = createToken(user._id, user.email);
      user.updateOne({ token });
      return res.status(200).json({ token });
    }

    return res.status(400).send('Invalid Credentials');
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
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

export { login, register };