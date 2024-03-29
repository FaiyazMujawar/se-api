import { init } from './loaders';

init()
  .then((app) => {
    const PORT: number = (process.env.PORT ?? 3000) as number;
    app.listen(3000, () =>
      console.log(`Server started on http://localhost:${PORT}`)
    );
  })
  .catch(console.error);
