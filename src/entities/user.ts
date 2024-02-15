import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string' })
  firstname: string;

  @Property({ type: 'string' })
  lastname: string;

  @Property({ type: 'string', nullable: false, unique: true })
  email: string;

  @Property({ type: 'string', nullable: false })
  password: string;

  @Property({ type: 'integer', nullable: false, unique: true })
  contact: string;

  @Property({ type: 'string' })
  role: UserRole = 'USER';
}

export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'USER';
