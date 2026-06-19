import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    anamnese: {
      upsert: jest.fn(),
    },
    professional: {
      update: jest.fn(),
    },
    curriculum: {
      upsert: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should hash password and create PACIENTE', async () => {
      const dto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '123456789',
        address: 'Street 123',
        role: 'PACIENTE',
        cpf: '12345678900',
        birthDate: '1990-01-01',
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue({ id: 1, ...dto, password: hashedPassword });

      await service.create(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'john@example.com',
          role: 'PACIENTE',
          password: hashedPassword,
          patient: {
            create: {
              cpf: '12345678900',
              birthDate: expect.any(Date),
            },
          },
        }),
      });
    });

    it('should hash password and create PROFISSIONAL', async () => {
      const dto: CreateUserDto = {
        name: 'Dr. Smith',
        email: 'smith@example.com',
        password: 'password123',
        phone: '123456789',
        address: 'Street 456',
        role: 'PROFISSIONAL',
        councilNumber: 'CRM123',
        birthDate: '1985-01-01',
      };

      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue({ id: 2, ...dto, password: hashedPassword });

      await service.create(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'smith@example.com',
          role: 'PROFISSIONAL',
          password: hashedPassword,
          professional: {
            create: {
              councilNumber: 'CRM123',
              birthDate: expect.any(Date),
            },
          },
        }),
      });
    });

    it('should throw error if CPF is missing for PACIENTE', async () => {
      const dto: Partial<CreateUserDto> = { role: 'PACIENTE', birthDate: '1990-01-01', email: 'test@test.com' };
      await expect(service.create(dto as CreateUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if birthDate is missing for PACIENTE', async () => {
      const dto: Partial<CreateUserDto> = { role: 'PACIENTE', cpf: '123', email: 'test@test.com' };
      await expect(service.create(dto as CreateUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if councilNumber is missing for PROFISSIONAL', async () => {
      const dto: Partial<CreateUserDto> = { role: 'PROFISSIONAL', birthDate: '1985-01-01', email: 'test@test.com' };
      await expect(service.create(dto as CreateUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if birthDate is missing for PROFISSIONAL', async () => {
      const dto: Partial<CreateUserDto> = { role: 'PROFISSIONAL', councilNumber: 'CRM123', email: 'test@test.com' };
      await expect(service.create(dto as CreateUserDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw error if role is invalid', async () => {
      const dto: Partial<CreateUserDto> = { role: 'INVALID' as any, email: 'test@test.com' };
      await expect(service.create(dto as CreateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login correctly and return token', async () => {
      const password = 'password123';
      const mockUser = {
        id: 'user-id',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'PACIENTE',
        name: 'John',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('session-token');

      const result = await service.login({ email: 'john@example.com', password });

      expect(result.token).toBe('session-token');
      expect(result.user.role).toBe('paciente');
    });

    it('should login correctly for PROFISSIONAL and return token', async () => {
      const password = 'password123';
      const mockUser = {
        id: 'user-id',
        email: 'dr@example.com',
        password: 'hashedPassword',
        role: 'PROFISSIONAL',
        name: 'Dr',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('session-token');

      const result = await service.login({ email: 'dr@example.com', password });

      expect(result.token).toBe('session-token');
      expect(result.user.role).toBe('profissional');
    });

    it('should throw error if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'no@example.com', password: '123' })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1', password: 'hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ email: 'yes@example.com', password: '123' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-id', name: 'John' });
      const res = await service.getProfile('user-id');
      expect(res.name).toBe('John');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.getProfile('user-id')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateProfile', () => {
    it('should update personal data', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-id', role: 'PACIENTE' });
      mockPrismaService.user.update.mockResolvedValue({});
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { personal: { name: 'New Name' } });
      
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: expect.objectContaining({ name: 'New Name' }),
      });
    });

    it('should update medical data for PACIENTE', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PACIENTE',
        patient: { id: 'patient-id' }
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { medical: { bloodType: 'O+' } });
      
      expect(mockPrismaService.anamnese.upsert).toHaveBeenCalledWith({
        where: { patientId: 'patient-id' },
        update: { bloodType: 'O+' },
        create: { bloodType: 'O+', patientId: 'patient-id' },
      });
    });

    it('should update specialty and curriculum for PROFISSIONAL', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PROFISSIONAL',
        professional: { id: 'prof-id' }
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { 
        personal: { specialty: 'Cardiologia' },
        curriculum: { bio: 'Bio info' }
      });
      
      expect(mockPrismaService.professional.update).toHaveBeenCalledWith({
        where: { id: 'prof-id' },
        data: { specialty: 'Cardiologia' },
      });
      expect(mockPrismaService.curriculum.upsert).toHaveBeenCalledWith({
        where: { professionalId: 'prof-id' },
        update: { bio: 'Bio info' },
        create: { bio: 'Bio info', professionalId: 'prof-id' },
      });
    });

    it('should throw UnauthorizedException if user not found in middle of update', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(service.updateProfile('user-id', {})).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('updateAnamnese', () => {
    it('should update anamnese for PACIENTE', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PACIENTE',
        patient: { id: 'patient-id' }
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateAnamnese('user-id', { bloodType: 'A+' });

      expect(mockPrismaService.anamnese.upsert).toHaveBeenCalledWith({
        where: { patientId: 'patient-id' },
        update: { bloodType: 'A+' },
        create: { bloodType: 'A+', patientId: 'patient-id' },
      });
    });

    it('should throw BadRequestException if user is not PACIENTE', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PROFISSIONAL',
      });

      await expect(service.updateAnamnese('user-id', {})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user not found at all', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.updateAnamnese('user-id', {})).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user is PACIENTE but has no patient record', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PACIENTE',
        patient: null,
      });
      await expect(service.updateAnamnese('user-id', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateProfile - additional branches', () => {
    it('should not call professional.update if no specialty in personal', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PROFISSIONAL',
        professional: { id: 'prof-id' },
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { personal: { name: 'Dr. X' } });

      expect(mockPrismaService.professional.update).not.toHaveBeenCalled();
    });

    it('should not update curriculum if curriculum not provided', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PROFISSIONAL',
        professional: { id: 'prof-id' },
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { personal: { specialty: 'Cardio' } });

      expect(mockPrismaService.curriculum.upsert).not.toHaveBeenCalled();
    });

    it('should not update medical if patient is null', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PACIENTE',
        patient: null,
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { medical: { bloodType: 'A+' } });

      expect(mockPrismaService.anamnese.upsert).not.toHaveBeenCalled();
    });

    it('should not call professional update when user is PROFISSIONAL but has no professional record', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PROFISSIONAL',
        professional: null,
      });
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { personal: { specialty: 'Cardio' }, curriculum: { bio: 'Bio' } });

      expect(mockPrismaService.professional.update).not.toHaveBeenCalled();
      expect(mockPrismaService.curriculum.upsert).not.toHaveBeenCalled();
    });

    it('should update personal data without calling any role-specific updates', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ 
        id: 'user-id', 
        role: 'PACIENTE',
        patient: null,
      });
      mockPrismaService.user.update.mockResolvedValue({});
      jest.spyOn(service, 'getProfile').mockResolvedValue({ id: 'user-id' } as any);

      await service.updateProfile('user-id', { personal: { name: 'Test Name' } });

      expect(mockPrismaService.user.update).toHaveBeenCalled();
    });
  });
});

