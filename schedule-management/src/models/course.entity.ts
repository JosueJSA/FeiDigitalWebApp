/* eslint-disable prettier/prettier */
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ClassSession } from './class-session.entity';
import { CourseFollower } from './course-follower.entity';

@Entity()
export class Course {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  nrc!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255 })
  idAcademicPersonal!: string;

  @OneToMany(() => ClassSession, (session) => session.course)
  classes: ClassSession[];

  @OneToMany(() => CourseFollower, (follower) => follower.course)
  followers: CourseFollower[];
}
