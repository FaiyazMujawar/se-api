import Express from 'express';
import { UserRole } from '../entities/user';
import { ApiError } from '../exceptions/ApiError';

export function hasAnyRole(...roles: UserRole[]) {
  return function (
    req: Express.Request,
    _: Express.Response,
    next: Express.NextFunction
  ) {
    try {
      if (req.user == undefined) {
        throw new ApiError(ApiError.FORBIDDEN, 'User needs to be logged in');
      }
      if (!roles.includes(req.user.role)) {
        throw new ApiError(ApiError.UNAUTHORIZED, 'Insufficient roles');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}
