import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    patient: { findUnique: jest.fn() },
    appointment: { findFirst: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    availability: { findUnique: jest.fn(), update: jest.fn() },
    professional: { findUnique: jest.fn() },
    notification: { create: jest.fn() },
    review: { create: jest.fn() },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      professionalId: 'prof-1',
      date: '2026-06-15',
      time: '10:00',
      mode: 'Presencial' as any,
    };

    it('should create appointment and update availability', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'pat-1', user: { name: 'John' } });
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);
      mockPrismaService.availability.findUnique.mockResolvedValue({ id: 'avail-1', slots: '10:00,11:00' });
      mockPrismaService.professional.findUnique.mockResolvedValue({ user: { id: 'user-prof-1' } });
      
      const mockAppointment = { id: 'apt-1' };
      mockPrismaService.$transaction.mockResolvedValue([mockAppointment]);

      const result = await service.create('user-1', createDto);
      expect(result).toEqual(mockAppointment);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should throw BadRequest if user is not a patient', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);
      await expect(service.create('user-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequest if patient has pending review', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'pat-1', user: { name: 'John' } });
      mockPrismaService.appointment.findFirst.mockResolvedValue({ id: 'apt-old' });
      await expect(service.create('user-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFound if availability is missing', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'pat-1', user: { name: 'John' } });
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);
      mockPrismaService.availability.findUnique.mockResolvedValue(null);
      await expect(service.create('user-1', createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequest if slot is not available', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'pat-1', user: { name: 'John' } });
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);
      mockPrismaService.availability.findUnique.mockResolvedValue({ id: 'avail-1', slots: '11:00,12:00' });
      await expect(service.create('user-1', createDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle missing professional during notification creation', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue({ id: 'pat-1', user: { name: 'John' } });
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);
      mockPrismaService.availability.findUnique.mockResolvedValue({ id: 'avail-1', slots: '10:00' });
      mockPrismaService.professional.findUnique.mockResolvedValue(null);
      mockPrismaService.$transaction.mockResolvedValue([{ id: 'apt-1' }]);

      const result = await service.create('user-1', createDto);
      expect(result.id).toBe('apt-1');
    });
  });

  describe('submitReview', () => {
    it('should submit review and update status if not realizada', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: 'confirmada',
        patient: { userId: 'user-1' },
        review: null,
      });
      mockPrismaService.review.create.mockResolvedValue({ id: 'rev-1' });

      const result = await service.submitReview('user-1', 'apt-1', 5, 'Good');
      expect(result.id).toBe('rev-1');
      expect(mockPrismaService.appointment.update).toHaveBeenCalledWith({
        where: { id: 'apt-1' },
        data: { status: 'realizada' },
      });
    });

    it('should throw NotFound if appointment missing', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(null);
      await expect(service.submitReview('user-1', 'apt-1', 5)).rejects.toThrow(NotFoundException);
    });

    it('should throw Forbidden if user is not the owner', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue({
        patient: { userId: 'user-2' },
      });
      await expect(service.submitReview('user-1', 'apt-1', 5)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequest if review already exists', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue({
        patient: { userId: 'user-1' },
        review: { id: 'rev-old' },
      });
      await expect(service.submitReview('user-1', 'apt-1', 5)).rejects.toThrow(BadRequestException);
    });

    it('should NOT call appointment.update when status is already realizada', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: 'realizada', // already realizada — no update needed
        patient: { userId: 'user-1' },
        review: null,
      });
      mockPrismaService.review.create.mockResolvedValue({ id: 'rev-2' });

      const result = await service.submitReview('user-1', 'apt-1', 4, 'Good job');
      expect(result.id).toBe('rev-2');
      expect(mockPrismaService.appointment.update).not.toHaveBeenCalled();
    });

    it('should submit review without comment', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue({
        id: 'apt-1',
        status: 'confirmada',
        patient: { userId: 'user-1' },
        review: null,
      });
      mockPrismaService.review.create.mockResolvedValue({ id: 'rev-3' });

      const result = await service.submitReview('user-1', 'apt-1', 3);
      expect(result.id).toBe('rev-3');
    });
  });
});

