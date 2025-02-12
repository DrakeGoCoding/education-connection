import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, In } from 'typeorm';

import { Teacher } from '@/entities/teacher.entity';
import { TeacherRepository } from '@/repositories/teacher.repository';

describe('TeacherRepository', () => {
  let teacherRepository: TeacherRepository;

  const mockFindOne = jest.fn();
  const mockFindBy = jest.fn();

  const mockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('should return a teacher by email', async () => {
      const teacherEmail = 'teacher@example.com';
      const teacher: Teacher = { email: teacherEmail } as Teacher;

      mockFindOne.mockResolvedValue(teacher);
      teacherRepository.findOne = mockFindOne;

      const result = await teacherRepository.findOneByEmail(teacherEmail);

      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: teacherEmail },
      });
      expect(result).toEqual(teacher);
    });

    it('should throw an error if teacher not found', async () => {
      const teacherEmail = 'teacher@example.com';

      mockFindOne.mockResolvedValue(undefined);
      teacherRepository.findOne = mockFindOne;

      await expect(
        teacherRepository.findOneByEmail(teacherEmail)
      ).resolves.toBe(undefined);
    });
  });

  describe('findByEmails', () => {
    it('should return a list of teachers by their emails', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const teachers: Teacher[] = [
        { email: teacherEmails[0] } as Teacher,
        { email: teacherEmails[1] } as Teacher,
      ];

      mockFindBy.mockResolvedValue(teachers);
      teacherRepository.findBy = mockFindBy;

      const result = await teacherRepository.findByEmails(teacherEmails);

      expect(mockFindBy).toHaveBeenCalledWith({
        email: In(teacherEmails),
      });
      expect(result).toEqual(teachers);
    });

    it('should return an empty array if no teachers found', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];

      mockFindBy.mockResolvedValue([]);
      teacherRepository.findBy = mockFindBy;

      const result = await teacherRepository.findByEmails(teacherEmails);

      expect(mockFindBy).toHaveBeenCalledWith({
        email: In(teacherEmails),
      });
      expect(result).toEqual([]);
    });
  });
});
