/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { StudentsModule } from './modules/students/students.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TYPEORM_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    StudentsModule,
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
      // validationSchema: Joi.object({
      //   NODE_ENV: Joi.string()
      //     .valid('development', 'production')
      //     .default('development'),
      // }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
