/* eslint-disable prettier/prettier */
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Course } from './course.entity';

@Entity()
export class CourseFollower {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  idStudent!: string;

  @PrimaryColumn({ type: 'varchar', length: 255 })
  nrcCourse: string;

  @ManyToOne(() => Course, (course) => course.followers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nrcCourse' })
  course!: Course;
}
