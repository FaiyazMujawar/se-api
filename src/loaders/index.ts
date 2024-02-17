import { initApp } from './app';
import { Database } from './db';

export async function init() {
  await Database.getEm();
  const app = initApp();
  return app;
}
