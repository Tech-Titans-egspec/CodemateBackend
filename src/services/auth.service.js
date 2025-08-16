import User from "../models/user.model.js";
import { hashPassword,comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from '../utils/tokenUtils.js';

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user._id);
  return { token, user: { id: user._id, name: user.name, email: user.email } };
};


export const registerNewUser = async ({ username, email, password, phoneNumber }) => {
  const hashedPassword = await hashPassword(password);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    phoneNumber
  });

  return await user.save();
};
