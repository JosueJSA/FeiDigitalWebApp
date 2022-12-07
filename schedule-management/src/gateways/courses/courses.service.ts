/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Course, CourseFollower, CoursesFollowers } from 'src/models';
import { Like, Repository } from 'typeorm';
import { CourseEditDto } from './dtos/course-edit.dto';
import { CourseFilterDto } from './dtos/course-filter.dto';
import { CourseDto } from './dtos/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(CourseFollower)
    private readonly courseFollowerRepository: Repository<CourseFollower>,
    @InjectRepository(CoursesFollowers)
    private readonly coursesFollowersViewRepository: Repository<CoursesFollowers>,
  ) {}

  /**
   * Search courses
   * @primary function
   * @param filters courses filters
   * @returns array of courses or empty array
   */
  async searchCourses(dto: CourseFilterDto): Promise<Course[]> {
    return await this.courseRepository.find({
      where: [
        {
          nrc: dto.nrc === '' ? undefined : Like(`%${dto.nrc}%`),
        },
        {
          name: dto.name === '' ? undefined : Like(`%${dto.name}%`),
        },
      ],
      order: {
        name: 'ASC',
      },
    });
  }

  /**
   * Get courses for an academic
   * @primary function
   * @param idAcademic academic identifier
   * @returns awway of the academic courses or empty array
   */
  async getCoursesByAcademic(idAcademic: string): Promise<Course[]> {
    return await this.courseRepository.find({
      where: { idAcademicPersonal: idAcademic },
      order: {
        name: 'ASC',
      },
    });
  }

  /**
   * Get the courses for student
   * @primary function
   * @param idStudent student identifier
   * @returns the list of courses that students are following
   */
  async getCoursesByFollower(idStudent: string): Promise<CoursesFollowers[]> {
    return await this.coursesFollowersViewRepository.find({
      select: {
        nrc: true,
        name: true,
        idAcademicPersonal: true,
      },
      where: {
        idStudent: idStudent,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  /**
   * Get course by nrc
   * @primary function
   * @param nrc of the course
   * @returns all the information about course
   */
  async getCourse(nrc: string): Promise<Course> {
    const course = await this.verifyGetCourse(nrc);
    return course;
  }

  /**
   * Add the course
   * @primary function
   * @param dto partial data of the new course
   * @returns data of the new course
   */
  async addCourse(dto: CourseDto): Promise<Course> {
    await this.verifyAddCourse(dto);
    return await this.courseRepository.save(this.courseRepository.create(dto));
  }

  /**
   * Update the course
   * @primary function
   * @param dto partial data of the course
   * @returns the complete course information
   */
  async updateCourse(nrc: string, dto: CourseEditDto): Promise<Course> {
    await this.verifyUpdateCourse(nrc, dto);
    await this.courseRepository.update(nrc, dto);
    return await this.courseRepository.findOne({ where: { nrc: dto.nrc } });
  }

  /**
   * Delete the course
   * @primary function
   * @param nrc of the course
   * @returns the course deleted
   */
  async deleteCourse(nrc: string): Promise<any> {
    const course = await this.verifyDelteCourse(nrc);
    return await this.courseRepository.remove(course);
  }

  /**
   * Follow a course
   * @primary function
   * @param nrcCourse curse identifier
   * @param idStudent student identifier
   * @returns data of the course
   */
  async followCourse(
    idStudent: string,
    nrcCourse: string,
  ): Promise<CourseFollower> {
    await this.verifyFollowCourse(idStudent, nrcCourse);
    return await this.courseFollowerRepository.save(
      this.courseFollowerRepository.create({
        idStudent: idStudent,
        nrcCourse: nrcCourse,
      }),
    );
  }

  /**
   * Unfollow a course
   * @primary function
   * @param nrcCourse curse identifier
   * @param idStudent student identifier
   * @returns data of the course
   */
  async removeFollow(idStudent: string, nrcCourse: string): Promise<any> {
    const course = await this.verifyRemoveFollow(idStudent, nrcCourse);
    return await this.courseFollowerRepository.remove(course);
  }

  async verifyGetCourse(nrc: string): Promise<Course> {
    const course = await this.getCoursewByNrc(nrc);
    if (!course) throw new WsException(['El curso no fue encontrado']);
    return course;
  }

  async verifyAddCourse(dto: CourseDto) {
    if (await this.isNrcDuplicated('', dto.nrc))
      throw new WsException(['El Nrc ya ha sido asignado a otro curso']);
  }

  async verifyUpdateCourse(nrc: string, dto: CourseDto): Promise<Course> {
    const course = await this.getCoursewByNrc(nrc);
    if (!course) throw new WsException(['No se encontró el curso']);
    if (await this.isNrcDuplicated(course.nrc, dto.nrc))
      throw new WsException(['El Nrc ya ha sido asignado a otro curso']);
    return course;
  }

  async verifyDelteCourse(nrc: string): Promise<Course> {
    const course = await this.getCoursewByNrc(nrc);
    if (!course) throw new WsException(['No se encontró el curso']);
    return course;
  }

  async verifyFollowCourse(idStudent: string, nrcCourse: string) {
    if (await this.isFollowerRepeated(idStudent, nrcCourse))
      throw new WsException(['Y estás siguiendo este curso']);
    const course = await this.getCoursewByNrc(nrcCourse);
    if (!course) throw new WsException(['No se encontró el curso a seguir']);
    if (course.idAcademicPersonal === idStudent)
      throw new WsException(['No puedes seguir tu propio curso']);
  }

  async verifyRemoveFollow(
    idStudent: string,
    nrcCourse: string,
  ): Promise<CourseFollower> {
    const course = await this.courseFollowerRepository.findOne({
      where: { idStudent: idStudent, nrcCourse: nrcCourse },
    });
    if (!course)
      throw new WsException(['No se encontró el curso con el seguidor']);
    return course;
  }

  private async getCoursewByNrc(nrc: string): Promise<Course> {
    return await this.courseRepository.findOne({ where: { nrc: nrc } });
  }

  private async isFollowerRepeated(idFollower, nrcCourse): Promise<boolean> {
    const course = await this.courseFollowerRepository.findOne({
      where: { idStudent: idFollower, nrcCourse: nrcCourse },
    });
    return course ? true : false;
  }

  private async isNrcDuplicated(
    oldNrc: string,
    newNrc: string,
  ): Promise<boolean> {
    if (!newNrc) return false;
    if (newNrc === oldNrc) return false;
    const course = await this.courseRepository.findOne({
      where: { nrc: newNrc },
    });
    return course ? true : false;
  }
}
