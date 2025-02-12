/* eslint-disable @typescript-eslint/unbound-method */
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { GetNotificationReceivableStudentsDto } from '@/dtos/get-notification-receivable-students.dto';
import { RegisterStudentsDto } from '@/dtos/register-students.dto';
import { SuspendStudentDto } from '@/dtos/suspend-student.dto';
import { Student } from '@/entities/student.entity';
import { Teacher } from '@/entities/teacher.entity';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { TeacherService } from '@/services/teacher.service';

describe('TeacherService', () => {
  let teacherService: TeacherService;
  let teacherRepository: TeacherRepository;
  let studentRepository: StudentRepository;
  let teacherStudentRepository: TeacherStudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: TeacherRepository,
          useValue: {
            findOne: jest.fn(),
            findOneByEmail: jest.fn(),
            findByEmails: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            findOne: jest.fn(),
            findOneByEmail: jest.fn(),
            findByEmails: jest.fn(),
            registerStudents: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            getNotificationReceivableStudents: jest.fn(),
          },
        },
        {
          provide: TeacherStudentRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    teacherService = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    studentRepository = module.get<StudentRepository>(StudentRepository);
    teacherStudentRepository = module.get<TeacherStudentRepository>(
      TeacherStudentRepository
    );
  });

  it('should be defined', () => {
    expect(teacherService).toBeDefined();
  });
  //
  describe('registerStudent', () => {
    it('should throw an error if the teacher does not exist', async () => {
      jest.spyOn(teacherRepository, 'findOneByEmail').mockResolvedValue(null);

      const mockDto: RegisterStudentsDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudents(mockDto)).rejects.toThrow(
        new HttpException('Teacher not found', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw an error if any student does not exist', async () => {
      jest
        .spyOn(teacherRepository, 'findOneByEmail')
        .mockResolvedValue({ id: 1 } as Teacher);
      jest.spyOn(studentRepository, 'findByEmails').mockResolvedValue([]);

      const mockDto: RegisterStudentsDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudents(mockDto)).rejects.toThrow(
        new HttpException('Some students not found', HttpStatus.BAD_REQUEST)
      );
    });

    it('should save teacher-student associations when data is valid', async () => {
      jest
        .spyOn(teacherRepository, 'findOneByEmail')
        .mockResolvedValue({ id: 1 } as Teacher);
      jest
        .spyOn(studentRepository, 'findByEmails')
        .mockResolvedValue([{ id: 2 }] as Student[]);
      // jest.spyOn(teacherStudentRepository, 'save').mockResolvedValue();

      const mockDto: RegisterStudentsDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await teacherService.registerStudents(mockDto);

      expect(teacherStudentRepository.save).toHaveBeenCalledWith([
        { teacherId: 1, studentId: 2 },
      ]);
    });
  });
  //
  describe('getCommonStudents', () => {
    it('should throw an error if any teacher does not exist', async () => {
      jest.spyOn(teacherRepository, 'findByEmails').mockResolvedValue([]);

      const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];

      await expect(
        teacherService.getCommonStudents({ teacher: teacherEmails })
      ).rejects.toThrow(
        new HttpException('Some teachers not found', HttpStatus.BAD_REQUEST)
      );
    });

    it('should return a list of common students', async () => {
      jest
        .spyOn(teacherRepository, 'findByEmails')
        .mockResolvedValue([{ id: 1 }, { id: 2 }] as Teacher[]);
      jest
        .spyOn(studentRepository, 'getCommonStudents')
        .mockResolvedValue([
          { email: 'studentjon@gmail.com' },
          { email: 'studentbob@gmail.com' },
        ] as Student[]);

      const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];

      const result = await teacherService.getCommonStudents({
        teacher: teacherEmails,
      });

      expect(result).toEqual({
        students: ['studentjon@gmail.com', 'studentbob@gmail.com'],
      });
    });
  });
  //
  describe('suspendStudent', () => {
    it('should throw an error if the student does not exist', async () => {
      jest.spyOn(studentRepository, 'findOneByEmail').mockResolvedValue(null);

      const mockDto: SuspendStudentDto = {
        student: 'studentmary@gmail.com',
      };

      await expect(teacherService.suspendStudent(mockDto)).rejects.toThrow(
        new HttpException('Student not found', HttpStatus.BAD_REQUEST)
      );
    });

    it('should suspend the student if they exist', async () => {
      jest
        .spyOn(studentRepository, 'findOneByEmail')
        .mockResolvedValue({ id: 1 } as Student);
      jest
        .spyOn(studentRepository, 'suspendStudent')
        .mockResolvedValue(null as never);

      const mockDto: SuspendStudentDto = {
        student: 'studentmary@gmail.com',
      };

      await teacherService.suspendStudent(mockDto);

      expect(studentRepository.suspendStudent).toHaveBeenCalledWith({ id: 1 });
    });
  });
  //
  describe('getNotificationReceivableStudents', () => {
    it('should throw an error if the teacher does not exist', async () => {
      jest.spyOn(teacherRepository, 'findOneByEmail').mockResolvedValue(null);

      const mockDto: GetNotificationReceivableStudentsDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students!',
      };

      await expect(
        teacherService.getNotificationReceivableStudents(mockDto)
      ).rejects.toThrow(
        new HttpException('Teacher not found', HttpStatus.BAD_REQUEST)
      );
    });

    it('should return recipients for notifications', async () => {
      jest
        .spyOn(teacherRepository, 'findOneByEmail')
        .mockResolvedValue({ id: 1 } as Teacher);
      jest
        .spyOn(studentRepository, 'getNotificationReceivableStudents')
        .mockResolvedValue([
          { email: 'studentagnes@gmail.com' },
          { email: 'studentmiche@gmail.com' },
        ] as Student[]);

      const mockDto: GetNotificationReceivableStudentsDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello @studentagnes@gmail.com @studentmiche@gmail.com',
      };

      const result =
        await teacherService.getNotificationReceivableStudents(mockDto);

      expect(result).toEqual({
        recipients: ['studentagnes@gmail.com', 'studentmiche@gmail.com'],
      });
    });
  });
});
