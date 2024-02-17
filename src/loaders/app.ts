import Express from 'express';
import AuthRoutes from '../controllers/auth';
import OrderRoutes from '../controllers/order';
import ServicesRoutes from '../controllers/service';
import { exceptionHandler } from '../exceptions/exception_handler';

export function initApp() {
  const app = Express();
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));

  app.get('/health', (_, res) => {
    return res.status(200).json({
      message: 'OK',
    });
  });

  app.use('/auth', AuthRoutes);
  app.use('/services', ServicesRoutes);
  app.use('/orders', OrderRoutes);

  app.use(exceptionHandler);
  return app;
}
