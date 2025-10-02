import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';
import User from '../models/User.js';

export const auth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, 'Missing token');

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');

    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }
  next();
};
