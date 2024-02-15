import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Question } from './question';

@Entity({ tableName: 'services' })
export class Service {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string', nullable: false })
  name: string;

  @Property({ type: 'string', nullable: false })
  description: string;

  @OneToMany({
    entity: () => Question,
    mappedBy: (question: Question) => question.service,
    orphanRemoval: true,
  })
  questions = new Collection<Question>(this);

  @Property({ type: 'string' })
  type: ServiceType = 'ONLINE';

  @Property({ type: 'real', nullable: false })
  price: number = 0;
}

export type ServiceType = 'ONLINE' | 'IN_PERSON';
