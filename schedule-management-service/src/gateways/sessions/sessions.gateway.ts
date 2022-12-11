/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import {
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  WsException,
} from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/auth';
import {
  ADD_CLASS_SESSION,
  ADD_CLASS_SESSION_EVENT,
  CLASS_SESSIONS_REQUESTERS,
  CLASS_SESSION_ERROR_EVENT,
  DELETE_CLASS_SESSION,
  DELETE_CLASS_SESSION_EVENT,
  END_CLASS_SESSION,
  END_CLASS_SESSION_EVENT,
  GET_ACTIVATED_SESSIONS,
  GET_ACTIVATED_SESSIONS_EVENT,
  GET_ACTIVATED_SESSION_BY_ACADEMIC,
  GET_ACTIVATED_SESSION_BY_ACADEMIC_EVENT,
  GET_SEESION_BY_ID,
  GET_SEESION_BY_ID_EVENT,
  GET_SESSIONS_BY_COURSE,
  GET_SESSIONS_BY_COURSE_EVENT,
  GET_SESSIONS_FOR_ACADEMIC,
  GET_SESSIONS_FOR_ACADEMIC_EVENT,
  GET_SESSIONS_FOR_FOLLOWER,
  GET_SESSIONS_FOR_FOLLOWER_EVENT,
  START_CLASS_SESSION,
  START_CLASS_SESSION_EVENT,
  UPDATE_CLASS_SESSION,
  UPDATE_CLASS_SESSION_EVENT,
  UPDATE_FOR_REQUESTERS,
} from './constants';
import { clearDate, convertToMiliseconds } from './constants/aux-functions';
import { SessionDto } from './dtos/session.dto';
import { SessionsService } from './sessions.service';

@WebSocketGateway({ namespace: 'sessions' })
export class SessionsGateway {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer() server: Server;

  /**
   * Get sessions by id
   * @event 'get-class-session-by-id'
   * @returns {'get-class-session-by-id-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_SEESION_BY_ID)
  async handleGetSessionById(client: Socket, payload: { id: string }) {
    try {
      this.verifyToken(client, true);
      validateIdForGetSession(payload.id);
      const session = await this.sessionsService.getClassSessionById(
        payload.id,
      );
      client.emit(GET_SEESION_BY_ID_EVENT, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Get sessions by id
   * @event 'get-actived-sessions'
   * @returns {'get-activated-sessions-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_ACTIVATED_SESSIONS)
  async handleGetActivatedSessions(client: Socket) {
    try {
      this.verifyToken(client, true);
      const sessions = await this.sessionsService.getAllClassSessionsActive();
      client.emit(GET_ACTIVATED_SESSIONS_EVENT, sessions);
      client.join(CLASS_SESSIONS_REQUESTERS);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Get sessions by academic
   * @event 'get-class-session-by-id'
   * @returns {'get-class-session-by-id-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_ACTIVATED_SESSION_BY_ACADEMIC)
  async handleGetActivatedSessionByAcademic(
    client: Socket,
    payload: { idAcademic: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateAcademicForSessions(payload.idAcademic);
      const session = await this.sessionsService.getSessionActivedByAcademic(
        payload.idAcademic,
      );
      client.emit(GET_ACTIVATED_SESSION_BY_ACADEMIC_EVENT, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Get sessions by academic
   * @event 'get-sessions-for-academic'
   * @returns {'get-sessions-for-academic-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_SESSIONS_FOR_ACADEMIC)
  async hanleGetSessionsByAcademic(
    client: Socket,
    payload: { date: Date; idAcademic: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateAcademicDateForSessions(payload.date, payload.idAcademic);
      const sessions = await this.sessionsService.getClassSessionsForTeacher(
        payload.date,
        payload.idAcademic,
      );
      client.emit(GET_SESSIONS_FOR_ACADEMIC_EVENT, sessions);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Get sessions by follower
   * @event 'get-sessions-for-follower'
   * @returns {'get-sessions-for-follower-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_SESSIONS_FOR_FOLLOWER)
  async hanleGetSessionsbyFollower(
    client: Socket,
    payload: { date: Date; idFollower: string },
  ) {
    try {
      this.verifyToken(client, true);
      validateFollowerDateForSessions(payload.date, payload.idFollower);
      const sessions = await this.sessionsService.getClassSessionsForFollower(
        payload.date,
        payload.idFollower,
      );
      client.emit(GET_SESSIONS_FOR_FOLLOWER_EVENT, sessions);
      client.join(CLASS_SESSIONS_REQUESTERS);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Get sessions by course
   * @event 'get-sessions-for-follower'
   * @returns {'get-sessions-for-follower-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(GET_SESSIONS_BY_COURSE)
  async hanleGetSessionsByCourse(client: Socket, payload: { nrc: string }) {
    try {
      this.verifyToken(client, true);
      validateNrc(payload.nrc);
      const sessions = await this.sessionsService.getClassSessionsByCourse(
        payload.nrc,
      );
      client.emit(GET_SESSIONS_BY_COURSE_EVENT, sessions);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Start class session
   * @event 'start-class-session'
   * @returns {'start-class-session-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(START_CLASS_SESSION)
  async handleStartClassSession(client: Socket, payload: { idClass: string }) {
    try {
      this.verifyToken(client, true);
      validateStartRequest(payload.idClass);
      const session = await this.sessionsService.startClassSession(
        payload.idClass,
      );
      client.emit(START_CLASS_SESSION_EVENT, session);
      client.join(CLASS_SESSIONS_REQUESTERS);
      this.server
        .to(CLASS_SESSIONS_REQUESTERS)
        .emit(UPDATE_FOR_REQUESTERS, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * End class session
   * @event 'end-class-session'
   * @returns {'class-sessions-requesters' | 'class-session-error-response'}
   */
  @SubscribeMessage(END_CLASS_SESSION)
  async handleEndClassSession(client: Socket, payload: { idClass: string }) {
    try {
      this.verifyToken(client, true);
      validateEndRequest(payload.idClass);
      const session = await this.sessionsService.endClassSession(
        payload.idClass,
      );
      client.emit(END_CLASS_SESSION_EVENT, session);
      client.join(CLASS_SESSIONS_REQUESTERS);
      this.server
        .to(CLASS_SESSIONS_REQUESTERS)
        .emit(UPDATE_FOR_REQUESTERS, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Add class session
   * @event 'add-class-session'
   * @returns {'add-class-session-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(ADD_CLASS_SESSION)
  async handleAddClassSession(client: Socket, payload: SessionDto) {
    try {
      this.verifyToken(client, true);
      await validateClassSessionDto(payload);
      const session = await this.sessionsService.addClassSession(payload);
      client.emit(ADD_CLASS_SESSION_EVENT, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Update class session
   * @event 'update-class-session'
   * @returns {'update-class-session-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(UPDATE_CLASS_SESSION)
  async handleUpdateClassSession(
    client: Socket,
    payload: { id: string; session: SessionDto },
  ) {
    try {
      this.verifyToken(client, true);
      await valdiateClassSessionEditDto(payload.id, payload.session);
      const session = await this.sessionsService.updateClassSession(
        payload.id,
        payload.session,
      );
      client.emit(UPDATE_CLASS_SESSION_EVENT, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
    }
  }

  /**
   * Delete class session
   * @event 'delete-class-session'
   * @returns {'delete-class-session-response' | 'class-session-error-response'}
   */
  @SubscribeMessage(DELETE_CLASS_SESSION)
  async handleDeleteClassSession(client: Socket, payload: { id: string }) {
    try {
      this.verifyToken(client, true);
      validateIdForDelete(payload.id);
      const session = await this.sessionsService.deleteClassSession(payload.id);
      client.emit(DELETE_CLASS_SESSION_EVENT, session);
    } catch (error) {
      client.emit(CLASS_SESSION_ERROR_EVENT, error);
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

async function valdiateClassSessionEditDto(id: string, object: SessionDto) {
  if (id === undefined || id === null || id === '')
    throw new WsException(['Se requiere el identificador de la calse']);
  if (id.length > 100)
    throw new WsException([
      'El identificador de la calse no puede ser mayor a 100 caracteres',
    ]);
  await validateClassSessionDto(object);
}

function validateIdForGetSession(id: string) {
  if (id.length === 0)
    throw new WsException(['Se requiere el identificador de la sesión']);
  if (id.length > 100)
    throw new WsException([
      'El identificador no puede superar los 100 caracteres',
    ]);
}

function validateAcademicForSessions(idAcademic: string) {
  if (idAcademic.length === 0)
    throw new WsException(['Se requiere el ifentificador el académico']);
  if (idAcademic.length > 100)
    throw new WsException([
      'El identificador no debe superar los 100 caracteres',
    ]);
}

function validateAcademicDateForSessions(date: Date, idAcademic: string) {
  if (!date || date.toString().length === 0)
    throw new WsException(['Se requiere la fecha para obtener las clases']);
  if (idAcademic.length === 0)
    throw new WsException(['Se requiere el identificador del académico']);
  if (idAcademic.length > 100)
    throw new WsException([
      'El identificador del académico no puede superar los 100 caracteres',
    ]);
}

function validateFollowerDateForSessions(date: Date, idFollower: string) {
  if (!date || date.toString().length === 0)
    throw new WsException(['Se requiere la fecha para obtener las clases']);
  if (idFollower.length === 0)
    throw new WsException(['Se requiere el identificador del estudiante']);
  if (idFollower.length > 100)
    throw new WsException([
      'El identificador del estudiante no puede superar los 100 caracteres',
    ]);
}

function validateNrc(nrc: string) {
  if (nrc.length === 0) throw new WsException(['Se requiere el Nrc del curso']);
  if (nrc.length > 50)
    throw new WsException(['El Nrc no puede superar los 50 caracteres']);
}

function validateStartRequest(idClass: string) {
  if (idClass === undefined || idClass === null || idClass === '')
    throw new WsException(['Se requiere el identificador de la clase']);
  if (idClass.length > 100)
    throw new WsException([
      'El identificador de la clase no puede superar los 100 caracteres',
    ]);
}

function validateEndRequest(idClass: string) {
  if (idClass === undefined || idClass === null || idClass === '')
    throw new WsException(['Se requiere el identificador de la clase']);
  if (idClass.length > 100)
    throw new WsException([
      'El identificador de la clase no puede superar los 100 caracteres',
    ]);
}

function validateIdForDelete(id: string) {
  if (id.length === 0)
    throw new WsException(['Se requiere el identificador de la clase']);
  if (id.length > 100)
    throw new WsException([
      'El identificador de la clase no puede contener más de 100 caracteres',
    ]);
}

async function validateClassSessionDto(object: SessionDto) {
  const validations = await validate(Object.assign(new SessionDto(), object));
  getMessage(validations);
  if (
    convertToMiliseconds(object.endTime) <=
    convertToMiliseconds(object.initialTime)
  )
    throw new WsException([
      'La hora de fin de la clase debe ser mayor a la de inicio',
    ]);
  if (object.repeated && object.classDateEnd === undefined)
    throw new WsException([
      'Se requiere la fecha de fin para repetir la clase',
    ]);
  if (
    object.repeated &&
    clearDate(object.classDateEnd) <= clearDate(object.classDate)
  )
    throw new WsException([
      'La fecha de fin de las clases debe ser mayor a la fecha de inicio',
    ]);
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
