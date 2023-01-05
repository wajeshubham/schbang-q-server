import CustomResponse from "./customResponse.js";

class CustomError extends Error {
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   */
  constructor(message, statusCode, res) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.sendErrResponse(res);
  }

  sendErrResponse(res) {
    return res
      .status(this.statusCode)
      .json(new CustomResponse(this.statusCode, this.message, [], {}));
  }
}

export default CustomError;
