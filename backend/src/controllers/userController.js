import httpStatus from 'http-status';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse({ data: req.user }));
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, bio, avatarUrl } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...(name && { name }), ...(bio && { bio }), ...(avatarUrl && { avatarUrl }) } },
    { new: true }
  ).select('-password');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json(new ApiResponse({ message: 'Profile updated', data: user }));
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password');
  res.json(new ApiResponse({ data: users }));
});
