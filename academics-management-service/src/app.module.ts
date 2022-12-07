/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AcademicPersonal, Account } from './models';
import * as Joi from '@hapi/joi';
import { AcademicsModule } from './modules/academics/academics.module';
import { TYPEORM_CONFIG } from './config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    AcademicsModule,
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
  providers: [],
})
export class AppModule {}
