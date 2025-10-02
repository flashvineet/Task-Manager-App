export default class ApiError extends Error {
  constructor(statusCode, message, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    if (stack) this.stack = stack;
  }
}
