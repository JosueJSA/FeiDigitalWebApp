/* eslint-disable prettier/prettier */
import { Column, PrimaryColumn } from 'typeorm';

export abstract class Module {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  building!: string;
}
