/* eslint-disable prettier/prettier */
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './config';
import { generateTypeormConfigFile } from './scripts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const config = app.get(ConfigService);
  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 7271;

  generateTypeormConfigFile(config);

  app.enableCors();
  await app.listen(port);
  logger.log(`Server running in ${await app.getUrl()}`);
}
bootstrap();
