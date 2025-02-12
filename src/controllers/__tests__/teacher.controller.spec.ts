/* eslint-disable @typescript-eslint/unbound-method */
import { TeacherController } from '@/controllers/teacher.controller';
import { TeacherService } from '@/services/teacher.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TeacherController', () => {
  let teacherController: TeacherController;
  let teacherService: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: {
            registerStudents: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            getNotificationReceivableStudents: jest.fn(),
          },
        },
      ],
    }).compile();

    teacherController = module.get<TeacherController>(TeacherController);
    teacherService = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(teacherController).toBeDefined();
  });

  it('should call TeacherService.registerStudents with the correct data', async () => {
    const mockDto = {
      teacher: 'teacherken@gmail.com',
      students: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    };
    jest.spyOn(teacherService, 'registerStudents').mockResolvedValue();

    await teacherController.registerStudents(mockDto);

    expect(teacherService.registerStudents).toHaveBeenCalledWith(mockDto);
  });

  it('should call TeacherService.getCommonStudents with the correct data', async () => {
    const mockDto = {
      teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
    };
    const mockResponse = {
      students: [
        'commonstudent1@gmail.com',
        'commonstudent2@gmail.com',
        'student_only_under_teacher_ken@gmail.com',
      ],
    };
    jest
      .spyOn(teacherService, 'getCommonStudents')
      .mockResolvedValue(mockResponse);

    const result = await teacherController.getCommonStudents(mockDto);

    expect(teacherService.getCommonStudents).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockResponse);
  });

  it('should call TeacherService.suspendStudent with the correct data', async () => {
    const mockDto = { student: 'studentmary@gmail.com' };
    jest.spyOn(teacherService, 'suspendStudent').mockResolvedValue();

    await teacherController.suspendStudent(mockDto);

    expect(teacherService.suspendStudent).toHaveBeenCalledWith(mockDto);
  });

  it('should call TeacherService.getNotificationReceivableStudents with the correct data', async () => {
    const mockDto = {
      teacher: 'teacherken@gmail.com',
      notification:
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
    };
    const mockResponse = {
      recipients: [
        'studentbob@gmail.com',
        'studentagnes@gmail.com',
        'studentmiche@gmail.com',
      ],
    };
    jest
      .spyOn(teacherService, 'getNotificationReceivableStudents')
      .mockResolvedValue(mockResponse);

    const result =
      await teacherController.getNotificationReceivableStudents(mockDto);

    expect(
      teacherService.getNotificationReceivableStudents
    ).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockResponse);
  });
});
