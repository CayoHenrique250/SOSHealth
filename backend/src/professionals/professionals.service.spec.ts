import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsService } from './professionals.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProfessionalsService', () => {
  let service: ProfessionalsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    professional: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    availability: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProfessionalsService>(ProfessionalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all professionals without filters', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          specialty: 'Cardiologia',
          councilNumber: 'CRM123',
          user: { name: 'Dr. John', address: 'São Paulo' },
          curriculum: { summary: 'Bio', education: 'USP', experience: '10 years' },
          appointments: [
            { review: { id: 'r1', rating: 5, comment: 'Great', createdAt: new Date('2026-06-18') }, patient: { user: { name: 'Alice' } } }
          ],
        },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dr. John');
      expect(result[0].rating).toBe(5);
      expect(result[0].reviewCount).toBe(1);
    });

    it('should filter professionals by specialty', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          specialty: 'Cardiologia',
          user: { name: 'Dr. John', address: 'São Paulo' },
        },
        {
          id: 'prof-2',
          specialty: 'Dermatologia',
          user: { name: 'Dr. Jane', address: 'Rio' },
        },
      ]);

      const result = await service.findAll({ specialty: 'Cardiologia' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dr. John');
    });

    it('should filter professionals by location', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          specialty: 'Cardiologia',
          user: { name: 'Dr. John', address: 'São Paulo' },
        },
        {
          id: 'prof-2',
          specialty: 'Dermatologia',
          user: { name: 'Dr. Jane', address: 'Rio' },
        },
      ]);

      const result = await service.findAll({ location: 'rio' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dr. Jane');
    });

    it('should handle zero reviews', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          user: { name: 'Dr. John' },
          appointments: [],
        },
      ]);

      const result = await service.findAll();
      expect(result[0].rating).toBe(0);
      expect(result[0].reviewCount).toBe(0);
      expect(result[0].specialty).toBe('Geral');
    });
  });

  describe('findAvailability', () => {
    it('should format availability correctly', async () => {
      mockPrismaService.availability.findMany.mockResolvedValue([
        { date: '2026-06-15', slots: '10:00,11:00' }
      ]);

      const res = await service.findAvailability('prof-id', '2026-06');
      expect(res).toEqual([{ day: 15, status: 'available', slots: ['10:00', '11:00'] }]);
    });
  });

  describe('upsertAvailability', () => {
    it('should upsert availability', async () => {
      mockPrismaService.availability.upsert.mockResolvedValue({});
      await service.upsertAvailability('prof-id', '2026-06-15', ['10:00', '11:00']);

      expect(mockPrismaService.availability.upsert).toHaveBeenCalledWith({
        where: { professionalId_date: { professionalId: 'prof-id', date: '2026-06-15' } },
        update: { slots: '10:00,11:00' },
        create: { professionalId: 'prof-id', date: '2026-06-15', slots: '10:00,11:00' },
      });
    });
  });

  describe('upsertAvailabilityByUserId', () => {
    it('should call upsertAvailability after finding professional', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue({ id: 'prof-id' });
      jest.spyOn(service, 'upsertAvailability').mockResolvedValue({} as any);

      await service.upsertAvailabilityByUserId('user-id', '2026-06-15', ['10:00']);

      expect(mockPrismaService.professional.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-id' } });
      expect(service.upsertAvailability).toHaveBeenCalledWith('prof-id', '2026-06-15', ['10:00']);
    });

    it('should throw Error if professional not found', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue(null);
      await expect(service.upsertAvailabilityByUserId('user-id', 'date', [])).rejects.toThrow('Profissional não encontrado');
    });
  });

  describe('findProfessionalByUserId', () => {
    it('should return professional', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue({ id: 'prof-1' });
      const res = await service.findProfessionalByUserId('user-id');
      expect(res.id).toBe('prof-1');
    });

    it('should return null when professional not found', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue(null);
      const res = await service.findProfessionalByUserId('user-id');
      expect(res).toBeNull();
    });
  });

  describe('findSlotsForDate', () => {
    it('should return slots array if record exists', async () => {
      mockPrismaService.availability.findUnique.mockResolvedValue({ slots: '08:00,09:00' });
      const res = await service.findSlotsForDate('prof-id', '2026-06-15');
      expect(res).toEqual(['08:00', '09:00']);
    });

    it('should return empty array if record does not exist', async () => {
      mockPrismaService.availability.findUnique.mockResolvedValue(null);
      const res = await service.findSlotsForDate('prof-id', '2026-06-15');
      expect(res).toEqual([]);
    });

    it('should filter empty strings from slots', async () => {
      mockPrismaService.availability.findUnique.mockResolvedValue({ slots: '08:00,,09:00,' });
      const res = await service.findSlotsForDate('prof-id', '2026-06-15');
      expect(res).toEqual(['08:00', '09:00']);
    });
  });

  describe('findAll - additional edge cases', () => {
    it('should return empty array when no professionals exist', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should default specialty to "Geral" when null', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          specialty: null,
          councilNumber: 'CRM123',
          user: { name: 'Dr. John', address: 'São Paulo', avatar: null, email: 'dr@test.com', id: 'u1' },
          curriculum: null,
          appointments: [],
        },
      ]);
      const result = await service.findAll();
      expect(result[0].specialty).toBe('Geral');
    });

    it('should map education as empty array when curriculum is null', async () => {
      mockPrismaService.professional.findMany.mockResolvedValue([
        {
          id: 'prof-1',
          specialty: 'Cardiologia',
          councilNumber: 'CRM999',
          user: { name: 'Dr. Smith', address: 'SP', avatar: null, email: 's@test.com', id: 'u2' },
          curriculum: null,
          appointments: [],
        },
      ]);
      const result = await service.findAll();
      expect(result[0].education).toEqual([]);
      expect(result[0].bio).toBe('');
    });
  });

  describe('findAvailability - additional edge cases', () => {
    it('should filter empty slots strings', async () => {
      mockPrismaService.availability.findMany.mockResolvedValue([
        { date: '2026-06-10', slots: '08:00,,09:00' }
      ]);
      const res = await service.findAvailability('prof-id', '2026-06');
      expect(res[0].slots).toEqual(['08:00', '09:00']);
    });
  });
});
