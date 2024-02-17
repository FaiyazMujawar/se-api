import Express from 'express';
import fileUpload from 'express-fileupload';
import AuthRoutes from '../controllers/auth';
import OrderRoutes from '../controllers/order';
import ServicesRoutes from '../controllers/service';
import Uploads from '../controllers/upload';
import { exceptionHandler } from '../exceptions/exception_handler';

export function initApp() {
  const app = Express();
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));
  app.use(
    fileUpload({
      safeFileNames: true,
      preserveExtension: 10,
    })
  );

  app.get('/health', (_, res) => {
    return res.status(200).json({
      message: 'OK',
    });
  });

  app.use('/auth', AuthRoutes);
  app.use('/services', ServicesRoutes);
  app.use('/orders', OrderRoutes);
  app.use('/uploads', Uploads);

  app.use(exceptionHandler);
  return app;
}
