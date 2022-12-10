/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist';
import { JwtAuthGuard } from 'src/auth/jwt.guard.auth';
import {
  AccountDto,
  StudentDto,
  StudentEditDto,
  StudentFilterDto,
} from './dtos';
import { StudentsService } from './students.service';

@ApiBearerAuth()
@ApiTags('Students module')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Takes filter values and returns the list of students
   * @param filters two optional values to search
   * @returns list of students or empty array`
   */
  @UseGuards(JwtAuthGuard)
  @Post('search')
  async getStudentsByFilters(@Body() filters: StudentFilterDto) {
    await this.verifyStudentFilter(filters);
    return await this.studentsService.searchStudents(filters);
  }

  /**
   * Takes the id of a student and returns all its data
   * @param id only input to retrieve the student
   * @returns student full data`
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return await this.studentsService.getStudent(id);
  }

  /**
   * Takes the id of a student and returns its id, name and access_token
   * @param id only input to retrieve the student
   * @returns partial student and access_token
   */
  @Post()
  async addStudent(@Body() student: StudentDto) {
    return await this.studentsService.addStudent(student);
  }

  /**
   * Takes the email and password of a student and returns its access_token
   * @param account contains the email and password
   * @returns id, name and access_token for the student
   */
  @Post('auth/login')
  async signIn(@Body() account: AccountDto) {
    return await this.studentsService.signInStudent(account);
  }

  /**
   * Takes the id and partial data from student to update it
   * @param id only input to retrieve the student
   * @Param student partial values of the student to update it
   * @returns full student with updated data
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() student: StudentEditDto,
  ) {
    return await this.studentsService.updateStudent(id, student);
  }

  async verifyStudentFilter(dto: StudentFilterDto) {
    let nameSize = 0;
    let emailSize = 0;
    try {
      emailSize = dto.email.length;
      nameSize = dto.name.length;
    } catch (error) {
      throw new BadRequestException([
        'Se requiere un criterio para la búsqueda',
      ]);
    }
    if (emailSize === 0 && nameSize === 0)
      throw new BadRequestException(['No puedes buscar sin un criterio']);
    if (emailSize > 90)
      throw new BadRequestException([
        'El email no puede contener más de 90 caracteres',
      ]);
    if (nameSize > 99)
      throw new BadRequestException([
        'El nombre no puede contener más de 99 caracteres',
      ]);
  }
}
