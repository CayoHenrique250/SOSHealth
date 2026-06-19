import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionalsController } from './professionals.controller';
import { ProfessionalsService } from './professionals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockProfessionalsService = {
  findAll: jest.fn(),
  findAvailability: jest.fn(),
  findProfessionalByUserId: jest.fn(),
  findSlotsForDate: jest.fn(),
  upsertAvailabilityByUserId: jest.fn(),
};

const mockUser = { userId: 'user-1', email: 'prof@test.com', role: 'profissional' };

describe('ProfessionalsController', () => {
  let controller: ProfessionalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionalsController],
      providers: [
        { provide: ProfessionalsService, useValue: mockProfessionalsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProfessionalsController>(ProfessionalsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return list of professionals without filters', async () => {
      mockProfessionalsService.findAll.mockResolvedValue([{ id: 'p1', name: 'Dr. Test' }]);

      const result = await controller.findAll();

      expect(mockProfessionalsService.findAll).toHaveBeenCalledWith({ specialty: undefined, location: undefined });
      expect(result).toHaveLength(1);
    });

    it('should pass filters to service', async () => {
      mockProfessionalsService.findAll.mockResolvedValue([]);

      await controller.findAll('Cardiologia', 'São Paulo');

      expect(mockProfessionalsService.findAll).toHaveBeenCalledWith({ specialty: 'Cardiologia', location: 'São Paulo' });
    });
  });

  describe('getOwnCalendar', () => {
    it('should return empty array when professional not found for user', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue(null);

      const result = await controller.getOwnCalendar({ user: mockUser }, '2026-06');

      expect(result).toEqual([]);
    });

    it('should return availability for authenticated professional', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue({ id: 'prof-1' });
      mockProfessionalsService.findAvailability.mockResolvedValue([{ day: 15, status: 'available', slots: ['10:00'] }]);

      const result = await controller.getOwnCalendar({ user: mockUser }, '2026-06');

      expect(mockProfessionalsService.findAvailability).toHaveBeenCalledWith('prof-1', '2026-06');
      expect(result).toHaveLength(1);
    });

    it('should use current month key when no monthKey provided', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue({ id: 'prof-1' });
      mockProfessionalsService.findAvailability.mockResolvedValue([]);

      await controller.getOwnCalendar({ user: mockUser }, undefined);

      const now = new Date();
      const expectedKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(mockProfessionalsService.findAvailability).toHaveBeenCalledWith('prof-1', expectedKey);
    });
  });

  describe('getCalendar', () => {
    it('should return availability for given professional id and month', async () => {
      mockProfessionalsService.findAvailability.mockResolvedValue([{ day: 10, status: 'available', slots: ['09:00'] }]);

      const result = await controller.getCalendar('prof-2', '2026-07');

      expect(mockProfessionalsService.findAvailability).toHaveBeenCalledWith('prof-2', '2026-07');
      expect(result).toHaveLength(1);
    });

    it('should use current month key when no monthKey provided', async () => {
      mockProfessionalsService.findAvailability.mockResolvedValue([]);

      await controller.getCalendar('prof-3', undefined);

      const now = new Date();
      const expectedKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(mockProfessionalsService.findAvailability).toHaveBeenCalledWith('prof-3', expectedKey);
    });
  });

  describe('upsertAvailability', () => {
    it('should upsert availability using monthKey + day + time format', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue({ id: 'prof-1' });
      mockProfessionalsService.findSlotsForDate.mockResolvedValue([]);
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { monthKey: '2026-07', day: 15, time: '09:00', price: 180, mode: 'Presencial' };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-15',
        ['09:00 - R$ 180 (Presencial)'],
      );
    });

    it('should merge existing slots with new slot', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue({ id: 'prof-1' });
      mockProfessionalsService.findSlotsForDate.mockResolvedValue(['08:00 - R$ 150 (Presencial)']);
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { monthKey: '2026-07', day: 15, time: '09:00', price: 180, mode: 'Presencial' };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-15',
        ['08:00 - R$ 150 (Presencial)', '09:00 - R$ 180 (Presencial)'],
      );
    });

    it('should use legacy date + slots format when monthKey/day/time missing', async () => {
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { date: '2026-07-20', slots: ['10:00', '11:00'] };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-20',
        ['10:00', '11:00'],
      );
    });

    it('should handle legacy format with empty slots', async () => {
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { date: '2026-07-20' };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-20',
        [],
      );
    });

    it('should not add duplicate slot when same slot already exists', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue({ id: 'prof-1' });
      mockProfessionalsService.findSlotsForDate.mockResolvedValue(['09:00 - R$ 180 (Presencial)']);
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { monthKey: '2026-07', day: 15, time: '09:00', price: 180, mode: 'Presencial' };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-15',
        ['09:00 - R$ 180 (Presencial)'],
      );
    });

    it('should handle upsert when professional not found (use empty existing slots)', async () => {
      mockProfessionalsService.findProfessionalByUserId.mockResolvedValue(null);
      mockProfessionalsService.upsertAvailabilityByUserId.mockResolvedValue({});

      const body = { monthKey: '2026-07', day: 10, time: '08:00', price: 200, mode: 'Teleatendimento' };
      await controller.upsertAvailability({ user: mockUser }, body);

      expect(mockProfessionalsService.upsertAvailabilityByUserId).toHaveBeenCalledWith(
        'user-1',
        '2026-07-10',
        ['08:00 - R$ 200 (Teleatendimento)'],
      );
    });
  });
});
