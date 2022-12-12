import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants, JwtStrategy } from 'src/auth';
import { AcademicPersonal, Account } from 'src/models';
import { AcademicsGateway } from './academics.gateway';
import { AcademicsService } from './academics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, AcademicPersonal]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AcademicsGateway, AcademicsService, JwtStrategy],
})
export class AcademicsModule {}
