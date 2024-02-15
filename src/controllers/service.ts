import { NextFunction, Request, Response, Router } from 'express';
import { Service } from '../entities/service';
import { Database } from '../loaders/db';
import { hasAnyRole } from '../middlewares/has_any_role';
import { validateToken } from '../middlewares/validate_token';

const router = Router();
const { getEm } = Database;

router.get('/', async (_: Request, res: Response, next: NextFunction) => {
  try {
    const em = await getEm();
    const services = (await em.findAll(Service, {
      populate: ['questions'],
    })) as Service[];
    return res.status(200).json(services);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const em = await getEm();
    const service = (await em.findOneOrFail(Service, { id })) as Service;
    return res.status(200).json(service);
  } catch (error) {
    next(error);
  }
});

router.post(
  '/',
  validateToken,
  hasAnyRole('ADMIN', 'SUPERADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const em = await getEm();
      const service = em.create(Service, req.body) as Service;
      await em.persistAndFlush(service);
      return res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateToken,
  hasAnyRole('ADMIN', 'SUPERADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const em = await getEm();
      const service = await em.findOneOrFail(Service, { id: req.params.id });
      const request = em.create(Service, req.body);
      updateService(service, request);
      await em.flush();
      return res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validateToken,
  hasAnyRole('ADMIN', 'SUPERADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const em = await getEm();
      const service = await em.findOneOrFail(Service, { id: req.params.id });
      await em.removeAndFlush(service);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
);

// Helper functions

function updateService(old: Service, updated: Service) {
  old.name = updated.name ?? old.name;
  old.description = updated.description ?? old.description;
  old.questions = updated.questions ?? old.questions;
  old.type = updated.type ?? old.type;
  old.price = updated.price ?? old.price;
}

export default router;
