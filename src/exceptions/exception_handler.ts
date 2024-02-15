import Express from 'express';
import { ApiError } from './ApiError';

export function exceptionHandler(
  error: ApiError | any,
  _: Express.Request,
  res: Express.Response,
  next: Express.NextFunction
) {
  if (error == undefined) next();

  console.log(error);

  let status = 500;
  let message = 'Something went wrong';

  if (error.code == '23505') {
    status = 400;
    message = error.detail;
  }

  if (error instanceof ApiError) {
    status = error.statusCode;
    message = error.message;
  }

  return res.status(status).json({ message });
}
