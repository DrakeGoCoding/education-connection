import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, In } from 'typeorm';

import { Student } from '@/entities/student.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';
import { Teacher } from '@/entities/teacher.entity';
import { StudentRepository } from '@/repositories/student.repository';

describe('StudentRepository', () => {
  let studentRepository: StudentRepository;

  const mockFindOne = jest.fn();
  const mockFindBy = jest.fn();

  const mockCreateQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    getMany: jest.fn(),
  };

  const mockDataSource = {
    createQueryBuilder: jest.fn().mockReturnValue(mockCreateQueryBuilder),
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    studentRepository = module.get<StudentRepository>(StudentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('should return a student by email', async () => {
      const studentEmail = 'student@example.com';
      const student: Student = { email: studentEmail } as Student;

      mockFindOne.mockResolvedValue(student);
      studentRepository.findOne = mockFindOne;

      const result = await studentRepository.findOneByEmail(studentEmail);

      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: studentEmail },
      });
      expect(result).toEqual(student);
    });

    it('should throw an error if student not found', async () => {
      const studentEmail = 'student@example.com';

      mockFindOne.mockResolvedValue(undefined);
      studentRepository.findOne = mockFindOne;

      await expect(
        studentRepository.findOneByEmail(studentEmail)
      ).resolves.toBe(undefined);
    });
  });

  describe('findByEmails', () => {
    it('should return a list of students by their emails', async () => {
      const studentEmails = ['student1@example.com', 'student2@example.com'];
      const students = [
        { email: studentEmails[0] },
        { email: studentEmails[1] },
      ] as Student[];

      mockFindBy.mockResolvedValue(students);
      studentRepository.findBy = mockFindBy;

      const result = await studentRepository.findByEmails(studentEmails);

      expect(mockFindBy).toHaveBeenCalledWith({
        email: In(studentEmails),
      });
      expect(result).toEqual(students);
    });

    it('should return an empty array if no students found', async () => {
      const studentEmails = ['student1@example.com', 'student2@example.com'];

      mockFindBy.mockResolvedValue([]);
      studentRepository.findBy = mockFindBy;

      const result = await studentRepository.findByEmails(studentEmails);

      expect(mockFindBy).toHaveBeenCalledWith({
        email: In(studentEmails),
      });
      expect(result).toEqual([]);
    });
  });

  describe('getCommonStudents', () => {
    it('should return a list of common students among the given teachers', async () => {
      const teachers = [{ id: 1 }, { id: 2 }] as Teacher[];
      const students = [{ id: 1, email: 'student@example.com' }] as Student[];

      mockCreateQueryBuilder.execute.mockResolvedValue(students);

      const result = await studentRepository.getCommonStudents(teachers);

      expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockCreateQueryBuilder.from).toHaveBeenCalledWith(Student, 's');
      expect(mockCreateQueryBuilder.innerJoin).toHaveBeenCalled();
      expect(mockCreateQueryBuilder.execute).toHaveBeenCalled();
      expect(result).toEqual(students);
    });
  });

  describe('getNotificationReceivableStudents', () => {
    it('should return a list of students who can receive a notification', async () => {
      const teacherId = 1;
      const studentEmails = ['student1@example.com', 'student2@example.com'];

      const mockResolvedValue = [
        { id: 1, email: 'student1@example.com' },
        { id: 2, email: 'student2@example.com' },
      ] as Student[];

      mockCreateQueryBuilder.getMany.mockResolvedValue(mockResolvedValue);

      const result = await studentRepository.getNotificationReceivableStudents(
        teacherId,
        studentEmails
      );

      expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith([
        's.id',
        's.email',
      ]);
      expect(mockCreateQueryBuilder.from).toHaveBeenCalledWith(Student, 's');
      expect(mockCreateQueryBuilder.leftJoin).toHaveBeenCalledWith(
        TeacherStudent,
        'ts',
        'ts.student_id = s.id'
      );
      expect(mockCreateQueryBuilder.where).toHaveBeenCalledWith(
        's.is_suspended is false'
      );
      expect(mockCreateQueryBuilder.andWhere).toHaveBeenCalledWith(
        `s.email IN (:...studentEmails) OR ts.teacher_id = :teacherId`,
        {
          studentEmails: !studentEmails.length ? [''] : studentEmails,
          teacherId,
        }
      );
      expect(mockCreateQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockResolvedValue);
    });
  });
});
