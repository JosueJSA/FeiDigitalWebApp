/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import {
  SessionsAcademics,
  Classroom,
  ClassSession,
  Course,
  SessionsClassrooms,
  SessionsFollowers,
} from 'src/models';
import {
  Between,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  assignDetailsToClass,
  clearDate,
  convertToMiliseconds,
  createClass,
} from './constants/aux-functions';
import { SessionDto } from './dtos';

const DAYS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(ClassSession)
    private readonly sessionsRepository: Repository<ClassSession>,
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(SessionsAcademics)
    private readonly sessionsAcademicsViewRepository: Repository<SessionsAcademics>,
    @InjectRepository(SessionsClassrooms)
    private readonly sessionsClassroomsViewRepository: Repository<SessionsClassrooms>,
    @InjectRepository(SessionsFollowers)
    private readonly sessionsFollowersViewRepository: Repository<SessionsFollowers>,
  ) {}

  /**
   * Get all sessions actived by any academic
   * @primary function
   * @returns array of sessions or empty array
   */
  async getAllClassSessionsActive(): Promise<SessionsClassrooms[]> {
    return await this.sessionsClassroomsViewRepository.find({
      select: {
        id: true,
        name: true,
        nrc: true,
        idAcademicPersonal: true,
        classroomCode: true,
        classroomStatus: true,
      },
    });
  }

  /**
   * Get sessions initialized by academic
   * @primary function
   * @returns array of sessions or empty array
   */
  async getSessionActivedByAcademic(
    idAcademic: string,
  ): Promise<SessionsAcademics> {
    return await this.verifySessions(idAcademic);
  }

  /**
   * Get sessions by academic identifier
   * @primary function
   * @returns array of sessions or empty array
   */
  async getClassSessionById(id: string): Promise<SessionsAcademics> {
    return await this.verifySessionsById(id);
  }

  /**
   * Get session of a course
   * @primary function
   * @returns array of sessions or empty array
   */
  async getClassSessionsByCourse(nrc: string): Promise<ClassSession[]> {
    return await this.sessionsRepository.find({
      where: { course: { nrc: nrc } },
      relations: { classroom: true },
    });
  }

  /**
   * Start a session
   * @primary function
   * @returns session started
   */
  async startClassSession(idClass: string): Promise<SessionsAcademics> {
    const session = await this.verifyStartSession(idClass);
    await this.updateClassroomStatus(idClass, session.classroomCode, 'Ocupado');
    return await this.sessionsAcademicsViewRepository.findOne({
      where: { id: session.id },
    });
  }

  async verifyStartSession(idClass: string): Promise<SessionsAcademics> {
    const session = await this.sessionsAcademicsViewRepository.findOne({
      where: { id: idClass },
    });
    if (!session) throw new WsException(['No se encontró la clase']);
    /*
    if (isOutOfTime(new Date(), session.initialTime, session.endTime))
      throw new BadRequestException(
        'No es posible iniciar la clase debido a la hora',
      );
      */
    if (session.classroomStatus !== 'Libre')
      throw new WsException(['El aula esta ocupada']);
    if (
      (await this.checkAcademicSessions(session.idAcademicPersonal)).length > 0
    )
      throw new WsException(['El académico ya tiene ocupada un aula']);
    return session;
  }

  /**
   * End a session
   * @primary function
   * @returns session ended
   */
  async endClassSession(idClass: string): Promise<SessionsAcademics> {
    const session = await this.verifyEndSession(idClass);
    await this.updateClassroomStatus(idClass, session.classroomCode, 'Libre');
    return await this.sessionsAcademicsViewRepository.findOne({
      where: { id: session.idClass },
    });
  }

  /**
   * Get class sessions in a specific date
   * @primary function
   * @returns array of sessions
   */
  async getClassSessionsForTeacher(
    date: Date,
    idAcademic: string,
  ): Promise<SessionsAcademics[]> {
    const sessions: SessionsAcademics[] = [];
    const result = await this.sessionsAcademicsViewRepository.find({
      where: { idAcademicPersonal: idAcademic },
    });
    result.forEach((session) => {
      if (session.repeated) {
        if (isAround(session.classDate, session.classDateEnd, date)) {
          if (compareDays(session.classDate, date)) sessions.push(session);
        }
      } else {
        if (compareDates(session.classDate, date)) {
          sessions.push(session);
        }
      }
    });
    return sessions;
  }

  /**
   * Get class sessions in a specific date
   * @primary function
   * @returns array of sessions
   */
  async getClassSessionsForFollower(
    date: Date,
    idStudent: string,
  ): Promise<SessionsFollowers[]> {
    const sessions: SessionsFollowers[] = [];
    const result = await this.sessionsFollowersViewRepository.find({
      where: { idStudent: idStudent },
    });
    result.forEach((session) => {
      if (session.repeated) {
        if (isAround(session.classDate, session.classDateEnd, date)) {
          if (compareDays(session.classDate, date)) sessions.push(session);
        }
      } else {
        if (compareDates(session.classDate, date)) {
          sessions.push(session);
        }
      }
    });
    return sessions;
  }

  /**
   * Update a session
   * @primary function
   * @returns sessio updated
   */
  async addClassSession(dto: SessionDto): Promise<ClassSession> {
    const course = await this.verifyCourse(dto);
    const classroom = await this.verifyClassroom(dto);
    if ((await this.validateClassSession(dto)).length > 0)
      throw new WsException(['Ya existen clases que interfieren con tu clase']);
    return await this.sessionsRepository.save(
      createClass(dto, classroom, course),
    );
  }

  /**
   * Update a session
   * @primary function
   * @returns session updated
   */
  async updateClassSession(id: string, dto: SessionDto): Promise<ClassSession> {
    const session = await this.getClassDetailsById(id);
    if (!session) throw new WsException(['La clase no existe']);
    const course = await this.getCoursewByNrc(dto.courseNrc);
    if (!course) throw new WsException(['El curso no existe']);
    const classroom = await this.getClassroomByCode(dto.classroomCode);
    if (!classroom) throw new WsException(['El aula no fue encontrada']);
    if ((await this.validateClassSession(dto, id)).length > 0)
      throw new WsException(['Ya existen clases que interfieren con tu clase']);
    return await this.sessionsRepository.save(
      assignDetailsToClass(session, dto, classroom, course),
    );
  }

  /**
   * Delete a session
   * @primary function
   * @returns session deleted
   */
  async deleteClassSession(id: string): Promise<boolean> {
    const session = await this.sessionsRepository.findOne({
      where: { id: id },
    });
    if (!session) throw new WsException(['La clase no existe']);
    await this.sessionsRepository.remove([session]);
    return true;
  }

  async validateClassSession(
    session: SessionDto,
    id?: string,
  ): Promise<SessionsAcademics[]> {
    let sessions: SessionsAcademics[] = [];
    if (session.repeated) {
      sessions = await this.validateClassSessionSeries(session, id);
    } else {
      sessions = await this.validateUniqueClassSession(session, id);
    }
    return sessions;
  }

  async verifyCourse(dto: SessionDto): Promise<Course> {
    const course = await this.getCoursewByNrc(dto.courseNrc);
    if (!course) throw new WsException(['El curso no existe']);
    return course;
  }

  async verifySessionsById(id: string): Promise<SessionsAcademics> {
    const session = await this.sessionsAcademicsViewRepository.findOne({
      where: { id: id },
    });
    if (!session) throw new WsException(['No se encontró la reunion']);
    return session;
  }

  async verifyClassroom(dto: SessionDto): Promise<Classroom> {
    const classroom = await this.getClassroomByCode(dto.classroomCode);
    if (!classroom) throw new WsException(['El aula no fue encontrada']);
    return classroom;
  }

  async validateClassSessionSeries(
    dto: SessionDto,
    id?: string,
  ): Promise<SessionsAcademics[]> {
    const classesSelected: SessionsAcademics[] = [];
    const classes = await this.getClassesByPeriod(dto, id);
    classes.forEach((session) => {
      if (session.repeated) {
        if (
          isBetween(session.classDate, dto.classDate, dto.classDateEnd) ||
          isBetween(session.classDateEnd, dto.classDate, dto.classDateEnd) ||
          isAround(session.classDate, session.classDateEnd, dto.classDate)
        ) {
          if (compareDays(session.classDate, dto.classDate))
            classesSelected.push(session);
        }
      } else {
        if (isBetween(session.classDate, dto.classDate, dto.classDateEnd)) {
          if (compareDays(session.classDate, dto.classDate))
            classesSelected.push(session);
        }
      }
    });
    return classesSelected;
  }

  async verifySessions(idAcademic: string): Promise<SessionsAcademics> {
    const session = await this.sessionsClassroomsViewRepository.findOne({
      where: { idAcademicPersonal: idAcademic },
    });
    if (!session)
      throw new WsException(['No se encontró ninguna sesión activa']);
    return session;
  }

  async validateUniqueClassSession(
    dto: SessionDto,
    id?: string,
  ): Promise<SessionsAcademics[]> {
    const classesSelected: SessionsAcademics[] = [];
    const classes = await this.getClassesByPeriod(dto, id);
    classes.forEach((session) => {
      if (session.repeated) {
        if (isAround(session.classDate, session.classDateEnd, dto.classDate)) {
          if (compareDays(session.classDate, dto.classDate))
            classesSelected.push(session);
        }
      } else {
        if (compareDates(session.classDate, dto.classDate)) {
          classesSelected.push(session);
        }
      }
    });
    return classesSelected;
  }

  private async getClassesByPeriod(
    session: SessionDto,
    id?: string,
  ): Promise<SessionsAcademics[]> {
    const initTime = convertToMiliseconds(new Date(session.initialTime));
    const endTime = convertToMiliseconds(new Date(session.endTime));
    const idClass = id === undefined || id === '' ? 'none' : id;
    return await this.sessionsAcademicsViewRepository.find({
      where: [
        {
          id: Not(idClass),
          initialTime: Between(initTime, endTime),
          classroomCode: session.classroomCode,
        },
        {
          id: Not(idClass),
          endTime: Between(initTime, endTime),
          classroomCode: session.classroomCode,
        },
        {
          id: Not(idClass),
          initialTime: LessThanOrEqual(initTime),
          endTime: MoreThanOrEqual(endTime),
          classroomCode: session.classroomCode,
        },
      ],
    });
  }

  private async getClassByAcademic(
    idAcademic: string,
  ): Promise<SessionsClassrooms> {
    return await this.sessionsClassroomsViewRepository.findOne({
      where: { idAcademicPersonal: idAcademic },
    });
  }

  private async getCoursewByNrc(nrc: string): Promise<Course> {
    return await this.courseRepository.findOne({ where: { nrc: nrc } });
  }

  private async getClassroomByCode(code: string): Promise<Classroom> {
    return await this.classroomRepository.findOne({ where: { code: code } });
  }

  private async getClassDetailsById(id: string) {
    return await this.sessionsRepository.findOne({ where: { id: id } });
  }

  async verifyEndSession(idClass: string): Promise<SessionsAcademics> {
    const session = await this.sessionsClassroomsViewRepository.findOne({
      where: { id: idClass },
    });
    if (!session) throw new WsException(['No se encontró la clase']);
    return session;
  }

  async updateClassroomStatus(
    idClass: string,
    classroomCode: string,
    status: string,
  ): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOne({
      where: { code: classroomCode },
    });
    classroom.status = status;
    classroom.idClass = idClass;
    if (status === 'Libre') classroom.idClass = '';
    return await this.classroomRepository.save(classroom);
  }

  async checkAcademicSessions(
    idAcademic: string,
  ): Promise<SessionsClassrooms[]> {
    return await this.sessionsClassroomsViewRepository.find({
      where: { idAcademicPersonal: idAcademic },
    });
  }
}

const isBetween = (date: Date, start: Date, end: Date) => {
  return (
    clearDate(date) >= clearDate(start) && clearDate(date) <= clearDate(end)
  );
};

const isAround = (start: Date, end: Date, date: Date) => {
  return (
    clearDate(start) <= clearDate(date) && clearDate(end) >= clearDate(date)
  );
};

const compareDays = (dateOne: Date, dateTwo: Date) => {
  return DAYS[new Date(dateOne).getDay()] === DAYS[new Date(dateTwo).getDay()];
};

const compareDates = (dateOne: Date, dateTwo: Date) => {
  return (
    clearDate(dateOne).toDateString() === clearDate(dateTwo).toDateString()
  );
};

const isOutOfTime = (date: Date, start: number, end: number) => {
  return (
    convertToMiliseconds(date) < start || convertToMiliseconds(date) >= end
  );
};
