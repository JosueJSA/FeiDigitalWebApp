/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SERVER_PORT } from 'config/constants';
import { generateTypeormConfigFile } from 'scripts';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 7270;

  generateTypeormConfigFile(config);

  app.enableCors();
  await app.listen(port);
  logger.log(`Server running in ${await app.getUrl()}`);
}
bootstrap();
