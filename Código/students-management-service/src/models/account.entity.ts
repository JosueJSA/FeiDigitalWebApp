/* eslint-disable prettier/prettier */
import { Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ unique: true, type: 'varchar', length: 255 })
  email!: string;
  @Column({ type: 'varchar', length: 255 })
  password!: string;
  @UpdateDateColumn({ type: 'timestamp' })
  updated!: Date;
}
