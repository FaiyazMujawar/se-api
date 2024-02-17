import Express from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/user';
import { ApiError } from '../exceptions/ApiError';
import { Database } from '../loaders/db';
import { decode, verify } from '../services/jwt';

const { getEm } = Database;

export async function validateToken(
  req: Express.Request,
  _: Express.Response,
  next: Express.NextFunction
) {
  try {
    const authorization = req.headers['authorization'];
    if (authorization == undefined || !authorization.startsWith('Bearer ')) {
      throw new ApiError(ApiError.FORBIDDEN, 'Invalid authorization header');
    }
    const token = authorization.substring(7);
    if (!verify(token)) throw new ApiError(ApiError.FORBIDDEN, 'Invalid Token');

    const { uid } = decode(token) as JwtPayload;
    const em = await getEm();
    const user = await em.findOne(User, { id: uid });
    req.user = user as User;

    next();
  } catch (error) {
    next(error);
  }
}
