import { EntityManager, MikroORM } from '@mikro-orm/postgresql';
import { DB_URI } from '../config';

export class Database {
  private static orm: MikroORM | null = null;
  private static em: EntityManager | null = null;

  private constructor() {}

  static async getEm() {
    if (Database.orm === null) {
      const globalOrm = await MikroORM.init({
        clientUrl: DB_URI,
        entities: ['src/entities'],
        schemaGenerator: {
          disableForeignKeys: false,
        },
      });
      // await globalOrm.schema.dropSchema();
      await globalOrm.schema.updateSchema();
      Database.em = globalOrm.em.fork();
    }

    return Database.em;
  }
}
