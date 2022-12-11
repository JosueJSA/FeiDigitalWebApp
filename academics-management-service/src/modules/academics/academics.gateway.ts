/* eslint-disable prettier/prettier */
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { validate } from 'class-validator';
import { Socket, Server } from 'socket.io';
import { JwtAuthGuard, jwtConstants } from 'src/auth';
import { AcademicsService } from './academics.service';
import {
  ADD_ACADEMIC,
  ADD_ACADEMIC_EVENT,
  ERROR_ACADEMIC_EVENT,
  GET_ACADEMIC,
  GET_ACADEMIC_EVENT,
  GET_SHORT_ACADEMIC,
  GET_SHORT_ACADEMIC_EVENT,
  REQUESTERS_ROOM,
  SEARCH_ACADEMICS,
  SEARCH_ACADEMICS_EVENT,
  SIGNIN_ACADEMIC,
  SIGNIN_ACADEMIC_EVENT,
  UPDATE_ACADEMIC,
  UPDATE_ACADEMIC_EVENT,
} from './constants';
import {
  AcademicFilterDto,
  AcademicPersonalDto,
  AcademicPersonalEditDto,
  AccountDto,
} from './dtos';

@ApiBearerAuth()
@WebSocketGateway()
export class AcademicsGateway {
  constructor(
    private readonly academicsService: AcademicsService,
    private readonly jwtService: JwtService,
  ) {}
  @WebSocketServer() server: Server;
  logger = new Logger('Bootstrap');

  /**
   * Search the academics that atch with th values received
   * @params filters from dto
   * @event 'search-academics'
   * @returns {'search-academics-response' | 'error-academic-response'}
   */
  @SubscribeMessage(SEARCH_ACADEMICS)
  async handleSearchAcademicsEvent(client: Socket, payload: AcademicFilterDto) {
    try {
      this.verifyToken(client, false);
      await validateAcademicFilterDto(payload);
      client.emit(
        SEARCH_ACADEMICS_EVENT,
        await this.academicsService.searchAcademics(payload),
      );
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
    }
  }

  /**
   * Get academic found by identifier
   * @params academic identifier
   * @event 'get-academic'
   * @returns {'get-academic-response' | 'error-academic-response'}
   */
  @SubscribeMessage(GET_ACADEMIC)
  async handleGetAcademicEvent(client: Socket, payload: { id: string }) {
    try {
      this.verifyToken(client, false);
      validateGetAcademicParams(payload.id);
      client.emit(
        GET_ACADEMIC_EVENT,
        await this.academicsService.getAcademic(payload.id),
      );
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
    }
  }

  /**
   * Get partial academic info found by identifier
   * @params academic identifier
   * @event 'get-short-academic'
   * @returns {'get-short-academic-response' | 'error-academic-response'}
   */
  @SubscribeMessage(GET_SHORT_ACADEMIC)
  async handleGetShortAcademicEvent(client: Socket, payload: { id: string }) {
    try {
      this.verifyToken(client, false);
      validateGetAcademicParams(payload.id);
      client.join(REQUESTERS_ROOM);
      client.emit(
        GET_SHORT_ACADEMIC_EVENT,
        await this.academicsService.getShortAcademic(payload.id),
      );
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
    }
  }

  /**
   * Add new academic
   * @params academic information
   * @event 'add-academic'
   * @returns {'add-academic-response' | 'error-academic-response'}
   */
  @SubscribeMessage(ADD_ACADEMIC)
  async handleAddAcademicEvent(client: Socket, payload: AcademicPersonalDto) {
    try {
      await validateAcademicDto(payload);
      client.emit(
        ADD_ACADEMIC_EVENT,
        await this.academicsService.addAcademic(payload),
      );
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
    }
  }

  /**
   * The academic information is updated
   * @params new academic information
   * @event 'update-academic'
   * @returns {'update-academic-response' | 'error-academic-response'}
   */
  @SubscribeMessage(UPDATE_ACADEMIC)
  async handleUpdateAcademicEvent(
    client: Socket,
    payload: { id: string; academic: AcademicPersonalEditDto },
  ) {
    try {
      this.verifyToken(client, true);
      await validateAcademicEditDto(payload.id, payload.academic);
      client.join(REQUESTERS_ROOM);
      const academic = await this.academicsService.updateAcademic(
        payload.id,
        payload.academic,
      );
      client.emit(UPDATE_ACADEMIC_EVENT, academic);
      this.server.to(REQUESTERS_ROOM).emit(GET_SHORT_ACADEMIC_EVENT, {
        fullName: academic.fullName,
        id: academic.id,
        email: academic.email,
        position: academic.position,
        feiLocationCode: academic.feiLocationCode,
        updated: academic.updated,
        status: academic.status,
      });
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
    }
  }

  /**
   * A new academic want to init session
   * @params account information
   * @event 'sign-in-academic'
   * @returns {'sign-in-academic-response' | 'error-academic-response'}
   */
  @SubscribeMessage(SIGNIN_ACADEMIC)
  async handleSignInAcademicEvent(client: Socket, payload: AccountDto) {
    try {
      await validateAccountDto(payload);
      client.emit(
        SIGNIN_ACADEMIC_EVENT,
        await this.academicsService.signInAcademic(payload),
      );
    } catch (error) {
      client.emit(ERROR_ACADEMIC_EVENT, error);
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

async function validateAcademicDto(object: AcademicPersonalDto) {
  const validations = await validate(
    Object.assign(new AcademicPersonalDto(), object),
  );
  getMessage(validations);
}

async function validateAccountDto(object: AccountDto) {
  const validations = await validate(Object.assign(new AccountDto(), object));
  getMessage(validations);
}

async function validateAcademicFilterDto(object: AcademicFilterDto) {
  const validations = await validate(
    Object.assign(new AcademicFilterDto(), object),
  );
  getMessage(validations);
  if (object.email.length === 0 && object.fullName.length === 0)
    throw new WsException(['No puedes buscar sin un criterio']);
  if (object.email.length > 99)
    throw new WsException(['El email no puede tener más de 99 caracteres']);
  if (object.fullName.length > 99)
    throw new WsException(['El nombre no puede tener más de 99 caracteres']);
}

async function validateAcademicEditDto(
  id: string,
  object: AcademicPersonalEditDto,
) {
  if (id === undefined || id === null || id === '')
    throw new WsException(['Se requiere el identificador del académico']);
  if (id.length > 50)
    throw new WsException([
      'El identificador del académico no puede ser mayor a 50 caracteres',
    ]);
  const validations = await validate(
    Object.assign(new AcademicPersonalEditDto(), object),
  );
  getMessage(validations);
}

function validateGetAcademicParams(id: string) {
  if (id === undefined || id === null || id === '')
    throw new WsException(['Se requiere el identificador del académico']);
  if (id.length > 50)
    throw new WsException([
      'El identificador del académico no puede ser mayor a 50 caracteres',
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
