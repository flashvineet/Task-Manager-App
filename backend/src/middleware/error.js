import ApiResponse from '../utils/ApiResponse.js';

export const notFound = (_req, res, _next) => {
  return res.status(404).json(new ApiResponse({ statusCode: 404, message: 'Route not found' }));
};

export const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') console.error(err);
  return res.status(status).json(new ApiResponse({ statusCode: status, message }));
};
