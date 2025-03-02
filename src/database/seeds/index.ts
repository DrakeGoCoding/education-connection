import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { Student } from '@/entities/student.entity';
import { Teacher } from '@/entities/teacher.entity';
import { AppModule } from '@/modules/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const studentRepository = dataSource.getRepository(Student);
  const teacherRepository = dataSource.getRepository(Teacher);

  const students = Array.from({ length: 40 }).map((_, index) => ({
    email: `student${index + 1}@gmail.com`,
    isSuspended: Math.random() > 0.5,
  }));

  await studentRepository.save(students);

  const teachers = Array.from({ length: 5 }).map((_, index) => ({
    email: `teacher${index + 1}@gmail.com`,
  }));

  await teacherRepository.save(teachers);
}

bootstrap().catch((error) => console.error(error));
