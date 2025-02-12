import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Student } from '@/entities/student.entity';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(private dataSource: DataSource) {
    super(Student, dataSource.createEntityManager());
  }

  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  findByEmails(emails: string[]) {
    return this.findBy({ email: In(emails) });
  }
}
