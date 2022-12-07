/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Classroom } from './classroom.entity';
import { Course } from './course.entity';

@Entity()
export class ClassSession {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamp' })
  classDate!: Date;

  @Column({ type: 'bigint' })
  initialTime!: number;

  @Column({ type: 'bigint' })
  endTime!: number;

  @Column({ type: 'boolean' })
  repeated!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  classDateEnd?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated!: Date;

  @ManyToOne(() => Course, (course) => course.classes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  course!: Course;

  @ManyToOne(() => Classroom, (classroom) => classroom.classes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  classroom!: Classroom;
}
