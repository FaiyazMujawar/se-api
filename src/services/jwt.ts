import * as jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, JWT_SECRET } from '../config';

export function sign(
  payload: object,
  expiresIn: string | number = JWT_EXPIRATION
) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
}

export function decode(token: string) {
  return jwt.decode(token);
}

export function verify(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) != undefined;
  } catch (error) {
    return false;
  }
}
