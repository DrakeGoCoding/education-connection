import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Student } from '@/entities/student.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';
import { Teacher } from '@/entities/teacher.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  /**
   * Finds a student by their email.
   *
   * @param email - Student's email.
   *
   * @returns The student with the given email, or null if not found.
   */
  findOneByEmail(email: string): Promise<Student | null> {
    return this.findOne({ where: { email } });
  }

  /**
   * Finds students by their email addresses.
   *
   * @param emails - An array of student email addresses to search for.
   *
   * @returns A promise that resolves to an array of students with the given emails.
   */
  findByEmails(emails: string[]): Promise<Student[]> {
    return this.findBy({ email: In(emails) });
  }

  /**
   * Finds the students that are common to all the given teachers.
   *
   * @param teachers - An array of teachers to search for.
   *
   * @returns A promise that resolves to an array of students that are common
   *          to all the given teachers.
   */
  getCommonStudents(teachers: Teacher[]): Promise<Student[]> {
    return this.dataSource
      .createQueryBuilder()
      .select('*')
      .from(Student, 's')
      .innerJoin(
        (subQuery) =>
          subQuery
            // select student_id from the `TeacherStudent` table
            .select('ts.student_id')
            .from(TeacherStudent, 'ts')
            // filter the results based on the `teacher_id` being in the array of `teachers`
            .where(
              `ts.teacher_id IN (${teachers.map((teacher) => teacher.id).join(',')})`
            )
            // group the results by `student_id`
            .groupBy('ts.student_id')
            // filter the groups to only include those with a count equal to the number of `teachers`
            .having(`COUNT(ts.student_id) = ${teachers.length}`),
        'subQuery',
        'subQuery.student_id = s.id'
      )
      .execute();
  }

  suspendStudent(student: Student) {
    return this.update({ id: student.id }, { isSuspended: true });
  }

  async getNotificationReceivableStudents(
    teacherId: Teacher['id'],
    studentEmails: string[]
  ): Promise<Student[]> {
    return this.dataSource
      .createQueryBuilder()
      .select(['s.id', 's.email'])
      .from(Student, 's')
      .leftJoin(TeacherStudent, 'ts', 'ts.student_id = s.id')
      .where('s.is_suspended is false')
      .andWhere(
        `s.email IN (:...studentEmails) OR ts.teacher_id = :teacherId`,
        {
          // if studentEmails is empty, add an empty string to avoid an empty array
          studentEmails: !studentEmails.length ? [''] : studentEmails,
          teacherId,
        }
      )
      .getMany();
  }
}
