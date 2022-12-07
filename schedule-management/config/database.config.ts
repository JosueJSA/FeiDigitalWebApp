import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import {
  Course,
  ClassSession,
  CourseFollower,
  Classroom,
  SessionsAcademics,
  SessionsClassrooms,
  SessionsFollowers,
  CoursesFollowers,
} from 'src/models';

function typeOrmModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false,
    },
    entities: [
      Course,
      ClassSession,
      CourseFollower,
      Classroom,
      SessionsAcademics,
      SessionsClassrooms,
      SessionsFollowers,
      CoursesFollowers,
    ],
    autoLoadEntities: true,
    synchronize: false,
    logging: true,
    logger: 'file',
  };
}

export default registerAs('database', () => ({
  config: typeOrmModuleOptions(),
}));
