/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Encrypter } from 'src/encryption';
import { AcademicPersonal } from 'src/models';
import { Like, Repository } from 'typeorm';
import {
  AcademicPersonalDto,
  AcademicPersonalEditDto,
  AccountDto,
} from './dtos';
import { AcademicFilterDto } from './dtos/academic-filter.dto';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(AcademicPersonal)
    private readonly academicsRepository: Repository<AcademicPersonal>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @primary function
   * @param dto the filter data for searching
   * @returns partial academic information
   */
  async searchAcademics(dto: AcademicFilterDto): Promise<AcademicPersonal[]> {
    const students = await this.decryptAcademicsList(
      await this.academicsRepository.find(),
    );
    return dto.email.length > 0
      ? this.getAcademicsByEmail(dto.email, students)
      : this.getAcademicsByName(dto.fullName, students);
  }

  /**
   * Takes the id of the academic an return its complete information
   * @param id only input for get the academic
   * @returns complete academic
   */
  async getAcademic(id: string): Promise<AcademicPersonal> {
    const academic = await this.verifyGetAcademic(id);
    return await this.decryptAcademic(academic);
  }

  /**
   * Takes the id of the academic and returns a short data for request
   * @param id only input for get the academic
   * @returns partial academic information
   */
  async getShortAcademic(id: string): Promise<AcademicPersonal> {
    const academic = await this.verifyGetShortAcademic(id);
    return await this.decryptShortAcademic(academic);
  }

  /**
   * Rceive the academic data to create a new academic object
   * @param dto: the academic data
   * @returns the access token for the academic
   */
  async addAcademic(dto: AcademicPersonalDto): Promise<any> {
    const encryptedAcademic = await this.encryptAcademic(dto);
    await this.verifyAddAcademic(encryptedAcademic);
    const academic = await this.academicsRepository.save(
      this.academicsRepository.create({
        ...encryptedAcademic,
        status: 'Disponible',
      }),
    );
    return await this.generateToken(academic);
  }

  /**
   * Receive the academic complete for update
   * @param dto: new data of the academic
   * @returns the complete academic information
   */
  async updateAcademic(
    id: string,
    dto: AcademicPersonalEditDto,
  ): Promise<AcademicPersonal> {
    const encryptedAcademic = await this.encryptAcademicUpdate(dto);
    const academic = await this.verifyUpdateAcademic(id, encryptedAcademic);
    return await this.decryptAcademic(
      await this.academicsRepository.save(
        Object.assign(academic, encryptedAcademic),
      ),
    );
  }

  /**
   * Receive the account of an anonymous user to get the access token
   * @param dto contains the email and password
   * @returns the access token for the account
   */
  async signInAcademic(dto: AccountDto): Promise<any> {
    const academic = await this.verifySignIn(dto);
    return await this.generateToken(academic);
  }

  async decryptShortAcademic(
    academic: AcademicPersonal,
  ): Promise<AcademicPersonal> {
    return {
      ...academic,
      fullName: await Encrypter.desencrypt(academic.fullName),
      email: await Encrypter.desencrypt(academic.email),
    };
  }

  async decryptAcademic(academic: AcademicPersonal): Promise<AcademicPersonal> {
    return {
      ...academic,
      email: await Encrypter.desencrypt(academic.email),
      fullName: await Encrypter.desencrypt(academic.fullName),
      password: await Encrypter.desencrypt(academic.password),
    };
  }

  async encryptAcademicUpdate(
    academic: AcademicPersonalEditDto,
  ): Promise<AcademicPersonalEditDto> {
    return {
      ...academic,
      email: await Encrypter.encrypt(academic.email),
      password: await Encrypter.encrypt(academic.password),
      fullName: await Encrypter.encrypt(academic.fullName),
    };
  }

  async decryptAcademicsList(
    academics: AcademicPersonal[],
  ): Promise<AcademicPersonal[]> {
    const decryptedAcademics: Array<AcademicPersonal> = [];
    for (let academic of academics) {
      decryptedAcademics.push(await this.decryptAcademic(academic));
    }
    return decryptedAcademics;
  }

  getAcademicsByName(
    name: string,
    academics: AcademicPersonal[],
  ): AcademicPersonal[] {
    const academicsReturn: AcademicPersonal[] = [];
    academics.forEach((academic) => {
      if (academic.fullName.toLowerCase().indexOf(name.toLowerCase()) >= 0)
        academicsReturn.push({
          id: academic.id,
          fullName: academic.fullName,
          email: academic.email,
        } as AcademicPersonal);
    });
    return academicsReturn;
  }

  getAcademicsByEmail(
    email: string,
    academics: AcademicPersonal[],
  ): AcademicPersonal[] {
    const academicsReturn: AcademicPersonal[] = [];
    academics.forEach((academic) => {
      if (academic.email.toLowerCase().indexOf(email.toLowerCase()) >= 0)
        academicsReturn.push({
          id: academic.id,
          fullName: academic.fullName,
          email: academic.email,
        } as AcademicPersonal);
    });
    return academicsReturn;
  }

  async encryptAcademic(
    academic: AcademicPersonalDto,
  ): Promise<AcademicPersonalDto> {
    return {
      email: await Encrypter.encrypt(academic.email),
      password: await Encrypter.encrypt(academic.password),
      fullName: await Encrypter.encrypt(academic.fullName),
      position: academic.position,
      feiLocationCode: academic.feiLocationCode,
    };
  }

  async verifyUpdateAcademic(
    id: string,
    academicForm: AcademicPersonalEditDto,
  ): Promise<AcademicPersonal> {
    const academic = await this.getAcademicById(id);
    if (!academic)
      throw new WsException(['No se encontró al académico en el sistema']);
    if (await this.isEmailDuplicated(academic.email, academicForm.email))
      throw new WsException(['El email del académico ya ha sido asignado']);
    return academic;
  }

  async verifyGetShortAcademic(id: string): Promise<AcademicPersonal> {
    const academic = await this.getShortAcademicById(id);
    if (!academic) throw new WsException(['El académico no fue encontrado']);
    return academic;
  }

  async verifyAddAcademic(academicForm: AcademicPersonalDto) {
    if (await this.isEmailDuplicated('', academicForm.email))
      throw new WsException(['El email ya fue asignado a otro académico']);
  }

  async verifyGetAcademic(id: string): Promise<AcademicPersonal> {
    const academic = await this.getAcademicById(id);
    if (!academic) throw new WsException(['El académico no fue encontrado']);
    return academic;
  }

  async generateToken(academic: AcademicPersonal): Promise<any> {
    const payload = { id: academic.id, name: academic.fullName };
    return {
      id: academic.id,
      fullName: await Encrypter.desencrypt(academic.fullName),
      email: await Encrypter.desencrypt(academic.email),
      token: await this.jwtService.signAsync(payload),
    };
  }

  async verifySignIn(dto: AccountDto): Promise<AcademicPersonal> {
    const academic = await this.getAcademicByEmail(
      await Encrypter.encrypt(dto.email),
    );
    if (!academic)
      throw new WsException(['No se contró ningun académico con ese email']);
    if (academic.password !== (await Encrypter.encrypt(dto.password)))
      throw new WsException(['Tu contraseña no coincide con el email']);
    return academic;
  }

  private async getAcademicById(id: string): Promise<AcademicPersonal> {
    return await this.academicsRepository.findOne({ where: { id: id } });
  }

  private async getShortAcademicById(id: string): Promise<AcademicPersonal> {
    return await this.academicsRepository.findOne({
      select: {
        id: true,
        fullName: true,
        email: true,
        position: true,
        status: true,
        updated: true,
        feiLocationCode: true,
      },
      where: { id: id },
    });
  }

  private async getAcademicByEmail(email: string): Promise<AcademicPersonal> {
    return await this.academicsRepository.findOne({
      where: { email: email },
    });
  }

  private async isEmailDuplicated(
    oldEmail: string,
    newEmail: string,
  ): Promise<boolean> {
    if (!newEmail) return false;
    if (newEmail === oldEmail) return false;
    const academic = await this.academicsRepository.findOne({
      where: { email: newEmail },
    });
    return academic ? true : false;
  }
}
