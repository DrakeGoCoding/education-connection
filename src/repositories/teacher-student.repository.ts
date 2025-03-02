import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TeacherStudent } from '@/entities/teacher-student.entity';

@Injectable()
export class TeacherStudentRepository extends Repository<TeacherStudent> {
  constructor(private dataSource: DataSource) {
    super(TeacherStudent, dataSource.createEntityManager());
  }
}
