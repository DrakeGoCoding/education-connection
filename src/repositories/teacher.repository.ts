import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Teacher } from '@/entities/teacher.entity';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  /**
   * Finds a teacher by their email address.
   *
   * @param email - The email address of the teacher to find.
   *
   * @returns A promise that resolves to the teacher entity if found, otherwise null.
   */
  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * Finds teachers by their email addresses.
   *
   * @param emails - An array of teacher email addresses to search for.
   *
   * @returns A promise that resolves to an array of teachers with the given emails.
   */
  findByEmails(emails: string[]) {
    return this.findBy({ email: In(emails) });
  }
}
