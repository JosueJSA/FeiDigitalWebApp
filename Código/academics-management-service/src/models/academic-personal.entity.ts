/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class AcademicPersonal extends Account {
  @Column({ type: 'varchar', length: 255 })
  fullName!: string;
  @Column({ type: 'varchar', length: 255 })
  position!: string;
  @Column({ type: 'varchar', length: 255 })
  status!: string;
  @Column({ type: 'varchar', length: 255 })
  feiLocationCode: string;
}
