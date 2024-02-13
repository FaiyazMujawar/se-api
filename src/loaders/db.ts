import {
  EntityManager,
  EntityName,
  EntityRepository,
  MikroORM,
} from '@mikro-orm/postgresql';

export class Database {
  private static repositories: { [key: string]: EntityRepository<object> } = {};
  private static orm: MikroORM | null = null;
  private static em: EntityManager | null = null;

  private constructor() {}

  static async getEm() {
    if (Database.orm === null) {
      const globalOrm = await MikroORM.init({
        clientUrl: process.env.DB_URI!,
        entities: ['src/entities'],
      });
      // await globalOrm.schema.dropSchema();
      await globalOrm.schema.updateSchema();
      Database.em = globalOrm.em.fork();
    }

    return Database.em;
  }

  static getRepository(entity: EntityName<object>) {
    const entityName = entity.toString();
    if (Database.repositories?.[entityName] == undefined) {
      Database.repositories[entity.toString()] =
        Database.em.getRepository(entity);
    }

    return Database.repositories[entityName];
  }
}
