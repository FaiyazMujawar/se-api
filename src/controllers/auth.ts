import { compareSync, hashSync } from 'bcrypt';
import { Router } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../entities/user';
import { Database } from '../loaders/db';
import { decode, sign, verify } from '../services/jwt';
import { LoginRequest } from '../types/app';

const router = Router();

router.post('/register', async (req, res, next) => {
  // TODO: Email & mobile number verification
  try {
    const repository = Database.getRepository(User);
    const user = repository.create(req.body) as User;
    user.password = hashSync(user.password, 10);
    await (await Database.getEm()).persistAndFlush(user);
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginRequest;
    const user = (await Database.getRepository(User).findOneOrFail({
      email,
    })) as User;

    if (!compareSync(password, user.password)) {
      throw new Error('Password incorrect');
    }
    return res.status(200).json(toTokens(user));
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!verify(refreshToken)) {
    throw new Error('Invalid token');
  }
  const { uid } = decode(refreshToken) as JwtPayload;
  const user = (await Database.getRepository(User).findOneOrFail({
    id: uid,
  })) as User;
  return res.status(200).json(toTokens(user));
});

function toTokens(user: User) {
  return {
    token: sign({ uid: user.id }),
    refreshToken: sign({ uid: user.id }, process.env.REFRESH_TOKEN_EXPIRATION),
  };
}

export default router;
