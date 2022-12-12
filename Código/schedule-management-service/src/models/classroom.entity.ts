/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany } from 'typeorm';
import { ClassSession } from './class-session.entity';
import { Module } from './module.entity';

@Entity()
export class Classroom extends Module {
  @Column({ type: 'varchar', length: 255 })
  status!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  idClass?: string;

  @OneToMany(() => ClassSession, (session) => session.classroom)
  classes: ClassSession[];
}
