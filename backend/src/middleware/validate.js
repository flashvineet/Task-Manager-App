import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

export const validate = (schema) => (req, _res, next) => {
  const data = ['GET', 'DELETE'].includes(req.method) ? req.query : req.body;
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }
  if (['GET', 'DELETE'].includes(req.method)) req.query = result.data;
  else req.body = result.data;
  next();
};
