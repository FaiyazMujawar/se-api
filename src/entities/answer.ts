import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Order } from './order';
import { Question } from './question';

@Entity({ tableName: 'answers' })
export class Answer {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'text', nullable: false })
  answer: string;

  @Property({ type: 'text' })
  filepath: string;

  @ManyToOne({
    entity: () => Question,
    deleteRule: 'cascade',
  })
  question: Question;

  @ManyToOne({ entity: () => Order, deleteRule: 'cascade', lazy: true })
  order: Order;
}
