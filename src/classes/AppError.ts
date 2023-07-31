enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

class AppError extends Error {
  status: HttpCode;
  constructor(status: HttpCode, message: string) {
    super(message);
    this.status = status;
  }
}

export { HttpCode, AppError };

new AppError(HttpCode.BAD_REQUEST, 'User not found');
