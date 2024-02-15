import * as jwt from 'jsonwebtoken';

export function sign(
  payload: object,
  expiresIn: string | number = process.env.JWT_EXPIRATION
) {
  return jwt.sign(payload, process.env.SECRET, {
    expiresIn,
  });
}

export function decode(token: string) {
  return jwt.decode(token);
}

export function verify(token: string) {
  return jwt.verify(token, process.env.SECRET) != undefined;
}
