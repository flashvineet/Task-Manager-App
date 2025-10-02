import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (userId, role) =>
  jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Email already in use');

  const user = await User.create({ name, email, password });
  const token = signToken(user._id, user.role);
  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role };

  res.status(201).json(new ApiResponse({
    statusCode: 201,
    message: 'User registered',
    data: { user: safeUser, token }
  }));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }
  const token = signToken(user._id, user.role);
  const safeUser = { _id: user._id, name: user.name, email: user.email, role: user.role };

  res.json(new ApiResponse({ message: 'Logged in', data: { user: safeUser, token } }));
});
