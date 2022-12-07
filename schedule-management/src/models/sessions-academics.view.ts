/* eslint-disable prettier/prettier */
import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { ClassSession } from './class-session.entity';
import { Classroom } from './classroom.entity';
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
      .from(ClassSession, 'session')
      .innerJoin(Course, 'course', 'course.nrc = session.courseNrc')
      .innerJoin(
        Classroom,
        'classroom',
        'classroom.code = session.classroomCode',
      ),
})
export class SessionsAcademics {
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
}
