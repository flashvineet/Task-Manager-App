export default class ApiResponse {
  constructor({ statusCode = 200, message = 'OK', data = null, meta = null }) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}
