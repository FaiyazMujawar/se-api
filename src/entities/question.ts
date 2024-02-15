import {
  Entity,
  LoadStrategy,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Service } from './service';

@Entity({ tableName: 'questions' })
export class Question {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string', nullable: false })
  text: string;

  @Property({ type: 'bool' })
  required: boolean = false;

  @Property({ type: 'string' })
  type: AnswerType = 'TEXT';

  @ManyToOne(() => Service, {
    strategy: LoadStrategy.SELECT_IN,
    lazy: true,
    deleteRule: 'cascade',
  })
  service!: Service;
}

export type AnswerType = 'TEXT' | 'FILE';
