/* eslint-disable prettier/prettier */
import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { ClassSession } from './class-session.entity';
import { Classroom } from './classroom.entity';
import { CourseFollower } from './course-follower.entity';
import { Course } from './course.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('course.nrc', 'nrc')
      .addSelect('course.name', 'name')
      .addSelect('course.idAcademicPersonal', 'idAcademicPersonal')
      .addSelect('follower.idStudent', 'idStudent')
      .from(CourseFollower, 'follower')
      .innerJoin(Course, 'course', 'course.nrc = follower.nrcCourse'),
})
export class CoursesFollowers {
  @ViewColumn()
  nrc: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  idAcademicPersonal: string;

  @ViewColumn()
  idStudent: string;
}
