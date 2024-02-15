const statusText = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  500: 'INTERNAL_SERVER_ERROR',
};

/**
 * Class for representing any error occuring in the API
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  constructor(statusCode = 500, message = 'Something went wrong.') {
    super(message);
    this.statusCode = statusCode;
    this.code = statusText[statusCode];
  }

  public static readonly BAD_REQUEST = 400;

  public static get UNAUTHORIZED() {
    return 401;
  }

  public static readonly FORBIDDEN = 403;

  public static readonly NOT_FOUND = 404;

  public static readonly INTERNAL_SERVER_ERROR = 500;
}
