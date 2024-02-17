import { NextFunction, Request, Response, Router } from 'express';
import { OrderStatus } from '../entities/order';
import { hasAnyRole } from '../middlewares/has_any_role';
import { validateToken } from '../middlewares/validate_token';
import { createOrder, getOrderById, getOrders } from '../services/order';

const router = Router();

router.get(
  '/',
  validateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await getOrders(
        (req.query.status ?? 'PENDING') as OrderStatus
      );
      return res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validateToken,
  hasAnyRole('ADMIN', 'SUPERADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await createOrder(req.body, req.user);
      return res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  validateToken,
  hasAnyRole('ADMIN', 'SUPERADMIN'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await getOrderById(req.params.id);
      return res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
