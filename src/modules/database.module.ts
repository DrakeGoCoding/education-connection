import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { DatabaseController } from '@/controllers/database.controller';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { DatabaseService } from '@/services/database.service';

@Module({
  controllers: [DatabaseController],
  providers: [
    DatabaseService,
    TeacherRepository,
    StudentRepository,
    TeacherStudentRepository,
  ],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(__dirname, '..', 'entities', '*.entity.{ts,js}')],
        migrations: [join(__dirname, '..', 'database/migrations', '*.{ts,js}')],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
