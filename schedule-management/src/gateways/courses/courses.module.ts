/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, CourseFollower, CoursesFollowers } from 'src/models';
import { CoursesGateway } from './courses.gateway';
import { CoursesService } from './courses.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseFollower, CoursesFollowers]),
  ],
  providers: [CoursesGateway, CoursesService, JwtService],
  exports: [CoursesGateway],
})
export class CoursesModule {}
