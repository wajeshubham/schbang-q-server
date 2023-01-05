class CustomResponse {
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {any[]} errors
   * @param {any} data
   */
  constructor(statusCode, message, errors, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode >= 200 && statusCode < 300;
    this.errors = errors;
    this.data = data;
  }
}

export default CustomResponse;
