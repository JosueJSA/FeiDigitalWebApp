/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CoursesModule } from './gateways/courses/courses.module';
import { SessionsModule } from './gateways/sessions/sessions.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TYPEORM_CONFIG } from 'config/constants';
import * as Joi from '@hapi/joi';
import databaseConfig from 'config/database.config';

@Module({
  imports: [
    CoursesModule,
    SessionsModule,
    CoursesModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG);
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // .env.development
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
      }),
    }),
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
