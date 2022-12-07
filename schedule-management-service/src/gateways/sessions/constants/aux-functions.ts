/* eslint-disable prettier/prettier */

import { Classroom, ClassSession, Course } from 'src/models';
import { SessionDto } from '../dtos/session.dto';

export const convertToMiliseconds = (date: Date): number => {
  const cleanDate = new Date(date);
  const hours = cleanDate.getHours() * 3600000;
  const minutes = cleanDate.getMinutes() * 60000;
  const seconds = cleanDate.getSeconds() * 1000;
  return hours + minutes + seconds;
};

export const convertToDateTime = (miliseconds: number): Date => {
  const hours = Math.floor(miliseconds / 3600000);
  const minutes = Math.floor((miliseconds - hours * 3600000) / 60000);
  const seconds = Math.floor(
    (miliseconds - hours * 3600000 - minutes * 60000) / 1000,
  );
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};

export const clearDate = (date: Date) => {
  return new Date(new Date(date).toDateString());
};

export const createClass = (
  session: SessionDto,
  classroom: Classroom,
  course: Course,
): ClassSession => {
  const classSession = new ClassSession();
  classSession.initialTime = convertToMiliseconds(session.initialTime);
  classSession.endTime = convertToMiliseconds(session.endTime);
  classSession.classDate = session.classDate;
  classSession.repeated = session.repeated;
  classSession.classDateEnd = session.classDateEnd;
  classSession.classroom = classroom;
  classSession.course = course;
  return classSession;
};

export const assignDetailsToClass = (
  entity: ClassSession,
  dto: SessionDto,
  classroom: Classroom,
  course: Course,
): ClassSession => {
  entity.initialTime = convertToMiliseconds(new Date(dto.initialTime));
  entity.endTime = convertToMiliseconds(new Date(dto.endTime));
  entity.classDate = dto.classDate;
  entity.repeated = dto.repeated;
  entity.classDateEnd = dto.classDateEnd;
  entity.classroom = classroom;
  entity.course = course;
  return entity;
};
