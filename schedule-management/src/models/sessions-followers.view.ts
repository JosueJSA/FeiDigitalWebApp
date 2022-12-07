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
      .select('session.id', 'id')
      .addSelect('session.classDate', 'classDate')
      .addSelect('session.initialTime', 'initialTime')
      .addSelect('session.endTime', 'endTime')
      .addSelect('session.repeated', 'repeated')
      .addSelect('session.classDateEnd', 'classDateEnd')
      .addSelect('session.updated', 'updated')
      .addSelect('classroom.code', 'classroomCode')
      .addSelect('classroom.name', 'classroomName')
      .addSelect('classroom.building', 'building')
      .addSelect('classroom.status', 'classroomStatus')
      .addSelect('classroom.idClass', 'idClass')
      .addSelect('course.nrc', 'nrc')
      .addSelect('course.name', 'name')
      .addSelect('course.idAcademicPersonal', 'idAcademicPersonal')
      .addSelect('follower.idStudent', 'idStudent')
      .from(CourseFollower, 'follower')
      .innerJoin(Course, 'course', 'course.nrc = follower.nrcCourse')
      .innerJoin(ClassSession, 'session', 'session.courseNrc = course.nrc')
      .innerJoin(
        Classroom,
        'classroom',
        'classroom.code = session.classroomCode',
      ),
})
export class SessionsFollowers {
  @ViewColumn()
  id: string;

  @ViewColumn()
  classDate: Date;

  @ViewColumn()
  initialTime: number;

  @ViewColumn()
  endTime: number;

  @ViewColumn()
  repeated: boolean;

  @ViewColumn()
  classDateEnd: Date;

  @ViewColumn()
  updated: Date;

  @ViewColumn()
  nrc: string;

  @ViewColumn()
  name: string;

  @ViewColumn()
  classroomCode: string;

  @ViewColumn()
  classroomName: string;

  @ViewColumn()
  building: string;

  @ViewColumn()
  classroomStatus: string;

  @ViewColumn()
  idClass: string;

  @ViewColumn()
  idAcademicPersonal: string;

  @ViewColumn()
  idStudent: string;
}
