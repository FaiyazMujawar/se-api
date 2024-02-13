import Express from 'express';
import AuthRoutes from '../controllers/auth';

export function initApp() {
  const app = Express();
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    return res.status(200).json({
      message: 'OK',
    });
  });

  app.use('/auth', AuthRoutes);

  app.use((error, _, res, next) => {
    if (error != undefined) {
      if (error.code == '23505') {
        return res.status(400).json({
          message: error.detail,
        });
      }
      return res.status(500).json({
        message: error.message,
      });
    }
    next();
  });
  return app;
}
