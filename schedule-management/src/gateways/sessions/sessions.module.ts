/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  SessionsAcademics,
  Classroom,
  ClassSession,
  Course,
  SessionsFollowers,
} from 'src/models';
import { SessionsClassrooms } from 'src/models/sessions-classrooms.view';
import { SessionsGateway } from './sessions.gateway';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassSession,
      Classroom,
      Course,
      SessionsAcademics,
      SessionsClassrooms,
      SessionsFollowers,
    ]),
  ],
  providers: [SessionsGateway, SessionsService, JwtService],
  exports: [SessionsGateway],
})
export class SessionsModule {}
