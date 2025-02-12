import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { Teacher } from '@/entities/teacher.entity';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(private dataSource: DataSource) {
    super(Teacher, dataSource.createEntityManager());
  }

  findOneByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  findByEmails(emails: string[]) {
    return this.findBy({ email: In(emails) });
  }
}
