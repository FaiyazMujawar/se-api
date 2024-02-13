import { initApp } from './app';
import { Database } from './db';

export async function init() {
  const orm = await Database.getEm();
  const app = initApp();
  return app;
}
