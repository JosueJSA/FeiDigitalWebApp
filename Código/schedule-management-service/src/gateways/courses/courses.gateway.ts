/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Socket, Server } from 'socket.io';
import { jwtConstants } from 'src/auth';
import {
  ADD_COURSE,
  ADD_COURSE_EVENT,
  DELETE_COURSE,
  DELETE_COURSE_EVENT,
  ERROR_COURSE_EVENT,
  FOLLOW_COURSE,
  FOLLOW_COURSE_EVENT,
  GET_COURSE,
  GET_COURSES_BY_ACADEMIC,
  GET_COURSES_BY_ACADEMIC_EVENT,
  GET_COURSES_FOR_FOLLOWER,
  GET_COURSES_FOR_FOLLOWER_EVENT,
  GET_COURSE_EVENT,
  SEARCH_COURSES,
  SEARCH_COURSES_EVENT,
  UNFOLLOW_COURSE,
  UNFOLLOW_COURSE_EVENT,
  UPDATE_COURSE,
  UPDATE_COURSE_EVENT,
} from './constants';
import { CoursesService } from './courses.service';
import { CourseEditDto } from './dtos/course-edit.dto';
import { CourseFilterDto } from './dtos/course-filter.dto';
import { CourseDto } from './dtos/course.dto';

@WebSocketGateway({ namespace: 'courses' })
export class CoursesGateway {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer() server: Server;

  /**
   * Search the courses that atch with th values received
   * @event 'search-courses'
   * @returns {'search-courses-response' | 'error-course-response'}
   */
  @SubscribeMessage(SEARCH_COURSES)
  async handleSearchCourseEvent(client: Socket, payload: CourseFilterDto) {
    try {
      this.verifyToken(client, true);
      await validateCourseFilterDto(payload);
      client.emit(
        SEARCH_COURSES_EVENT,
        await this.coursesService.searchCourses(payload),
      );
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Get courses by academic
   * @event 'get-course-by-academic'
   * @returns {'get-course-by-academic-response' | 'error-course-response'}
   */
  @SubscribeMessage(GET_COURSES_BY_ACADEMIC)
  async handleGetCoursesByAcademic(
    client: Socket,
    payload: { idAcademic: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateAcademicForCouse(payload.idAcademic);
      client.emit(
        GET_COURSES_BY_ACADEMIC_EVENT,
        await this.coursesService.getCoursesByAcademic(payload.idAcademic),
      );
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Get courses by student
   * @event 'get-courses-for-follower'
   * @returns {'get-courses-for-follower-response' | 'error-course-response'}
   */
  @SubscribeMessage(GET_COURSES_FOR_FOLLOWER)
  async handleGetCoursesByFollower(
    client: Socket,
    payload: { idStudent: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateIdStudent(payload.idStudent);
      client.emit(
        GET_COURSES_FOR_FOLLOWER_EVENT,
        await this.coursesService.getCoursesByFollower(payload.idStudent),
      );
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Get generic course
   * @event 'get-course'
   * @returns {'get-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(GET_COURSE)
  async handleGetCourseEvent(client: Socket, payload: { nrc: string }) {
    try {
      this.verifyToken(client, true);
      verifyNrcCourse(payload.nrc);
      client.emit(
        GET_COURSE_EVENT,
        await this.coursesService.getCourse(payload.nrc),
      );
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Add course
   * @event 'add-course'
   * @returns {'add-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(ADD_COURSE)
  async handleAddCourseEvent(client: Socket, payload: CourseDto) {
    try {
      this.verifyToken(client, true);
      await validateCourseDto(payload);
      client.emit(
        ADD_COURSE_EVENT,
        await this.coursesService.addCourse(payload),
      );
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Update course
   * @event 'update-course'
   * @returns {'update-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(UPDATE_COURSE)
  async handleUpdateCourseEvent(
    client: Socket,
    payload: { nrc: string; course: CourseEditDto },
  ) {
    try {
      this.verifyToken(client, true);
      await validateCourseEditDto(payload.nrc, payload.course);
      const course = await this.coursesService.updateCourse(
        payload.nrc,
        payload.course,
      );
      client.emit(UPDATE_COURSE_EVENT, course);
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * delete course
   * @event 'delete-course'
   * @returns {'delete-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(DELETE_COURSE)
  async handleDeleteCourseEvent(client: Socket, payload: { nrc: string }) {
    try {
      this.verifyToken(client, true);
      validateNrcForDelete(payload.nrc);
      const response = await this.coursesService.deleteCourse(payload.nrc);
      client.emit(DELETE_COURSE_EVENT, response);
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * Follow a course
   * @event 'follow-course'
   * @returns {'follow-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(FOLLOW_COURSE)
  async handleFollorCourseEvent(
    client: Socket,
    payload: { idStudent: string; nrcCourse: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateFollower(payload.idStudent, payload.nrcCourse);
      const followCourse = await this.coursesService.followCourse(
        payload.idStudent,
        payload.nrcCourse,
      );
      client.emit(FOLLOW_COURSE_EVENT, followCourse);
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  /**
   * unfllow a course
   * @event 'unfollow-course'
   * @returns {'unfollow-course-response' | 'error-course-response'}
   */
  @SubscribeMessage(UNFOLLOW_COURSE)
  async handleUnfollowCourseEvent(
    client: Socket,
    payload: { idStudent: string; nrcCourse: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateFollow(payload.idStudent, payload.nrcCourse);
      const response = await this.coursesService.removeFollow(
        payload.idStudent,
        payload.nrcCourse,
      );
      client.emit(UNFOLLOW_COURSE_EVENT, response);
    } catch (error) {
      client.emit(ERROR_COURSE_EVENT, error);
    }
  }

  verifyToken(socket: Socket, onlyAcademic: boolean) {
    try {
      const token = socket.handshake.headers.token
        ? socket.handshake.headers.token
        : socket.handshake.auth.token;
      this.jwtService.verify(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: false,
      });
    } catch (error: any) {
      throw new WsException(['No autorizado']);
    }
  }
}

function validateFollower(idStudent: string, nrcCourse: string) {
  if (
    (idStudent === undefined || idStudent === null || idStudent === '') &&
    (nrcCourse === undefined || nrcCourse === null || nrcCourse === '')
  )
    throw new WsException(['Se requieren datos del estudainte y del curso']);
  if (idStudent.length === 0)
    throw new WsException(['Se requiere el identificador del estudiante']);
  if (nrcCourse.length === 0)
    throw new WsException(['Se requiere el identificador del curso']);
  if (idStudent.length > 100)
    throw new WsException([
      'El identificador del estudiante no ebe exceder los 100 caracteres',
    ]);
  if (nrcCourse.length > 50)
    throw new WsException([
      'El Nrc del curso no puede superar los 50 caracteres',
    ]);
}

function validateAcademicForCouse(idAcademic: string) {
  if (idAcademic === undefined)
    throw new WsException(['Se requiere el identificador del académico']);
  if (idAcademic.length > 100)
    throw new WsException([
      'El identificador no puede ser mayor a 100 caracteres',
    ]);
}

function validateNrcForDelete(nrc: string) {
  if (nrc.length === 0)
    throw new WsException(['Se requiere el identificador del curso']);
  if (nrc.length > 50)
    throw new WsException(['El Nrc no puede contener más de 50 caracteres']);
}

function validateIdStudent(idStudent: string) {
  if (!idStudent)
    throw new WsException(['Se requiere el nombre del estudiante']);
  if (idStudent.length > 100)
    throw new WsException([
      'El identificador del estudiante no debe superar los 100 caracteres',
    ]);
}

function validateFollow(idStudent: string, nrcCourse: string) {
  if (!idStudent)
    throw new WsException(['Se requiere el identificador del estudiante']);
  if (idStudent.length > 100)
    throw new WsException([
      'El identificador del estudiante no ebe exceder los 100 caracteres',
    ]);
  if (!nrcCourse) throw new WsException(['Se requiere el NRC del curso']);
  if (nrcCourse.length > 50)
    throw new WsException(['El Nrc no debe ser mayor a 50 caracteres']);
}

function verifyNrcCourse(nrc: string) {
  if (nrc === undefined || nrc === null || nrc === '')
    throw new WsException(['Se requiere el NRC del curso']);
  if (nrc.length > 50)
    throw new WsException(['El Nrc no debe ser mayor a 50 caracteres']);
}

async function validateCourseDto(object: CourseDto) {
  const validations = await validate(Object.assign(new CourseDto(), object));
  getMessage(validations);
}

async function validateCourseFilterDto(object: CourseFilterDto) {
  if (
    (object.nrc === undefined || object.nrc === null || object.nrc === '') &&
    (object.name === undefined || object.name === null || object.name === '')
  )
    throw new WsException(['No puedes buscar sin un criterio']);
  if (object.nrc.length > 50)
    throw new WsException(['El Nrc no puede contener más de 50 caracteres']);
  if (object.name.length > 99)
    throw new WsException([
      'El Nombre del curso no puede contener más de 99 caracteres',
    ]);
  const valdiations = await validate(
    Object.assign(new CourseFilterDto(), object),
  );
  getMessage(valdiations);
}

async function validateCourseEditDto(nrc: string, object: CourseEditDto) {
  if (nrc === undefined || nrc === null || nrc === '')
    throw new WsException(['Se requiere el NRC del curso a editar']);
  if (nrc.length > 50)
    throw new WsException(['El Nrc no puede superar los 50 caracteres']);
  const validations = await validate(Object.assign(new CourseDto(), object));
  getMessage(validations);
}

function getMessage(message: any) {
  const messages: Array<any> = [];
  if (message.length > 0) {
    message.forEach((element) => {
      messages.push(...Object.values(element.constraints));
    });
  }
  if (messages.length > 0) throw new WsException(messages);
}
