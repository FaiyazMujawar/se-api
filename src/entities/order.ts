import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Answer } from './answer';
import { Service } from './service';
import { User } from './user';

@Entity({ tableName: 'orders' })
export class Order {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne({ entity: () => Service, deleteRule: 'cascade', nullable: false })
  service: Service;

  @OneToMany({ entity: () => Answer, mappedBy: (answer) => answer.order })
  answers = new Collection<Answer>(this);

  @ManyToOne({ entity: () => User, nullable: false })
  createdBy: User;

  @Property({ type: 'string' })
  status: OrderStatus = 'PENDING';
}

export type OrderStatus = 'PENDING' | 'PROCESSED';
