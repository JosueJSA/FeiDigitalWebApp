/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Student extends Account {
  @Column({ type: 'varchar', length: 255 })
  name!: string;
  @Column({ type: 'varchar', length: 255 })
  status!: string;
}
