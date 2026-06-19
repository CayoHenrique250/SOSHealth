import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockAppointmentsService = {
  create: jest.fn(),
  submitReview: jest.fn(),
};

const mockUser = { userId: 'user-1', email: 'test@test.com', role: 'paciente' };

describe('AppointmentsController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call appointmentsService.create and return result', async () => {
      const dto = { professionalId: 'prof-1', date: '2026-07-01', time: '10:00', mode: 'Presencial' };
      const created = { id: 'appt-1', ...dto, patientId: 'pat-1', status: 'confirmada' };
      mockAppointmentsService.create.mockResolvedValue(created);

      const req = { user: mockUser };
      const result = await controller.create(req, dto as any);

      expect(mockAppointmentsService.create).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(created);
    });

    it('should propagate errors from service', async () => {
      mockAppointmentsService.create.mockRejectedValue(new Error('Apenas pacientes podem agendar consultas.'));
      const req = { user: mockUser };
      await expect(controller.create(req, {} as any)).rejects.toThrow('Apenas pacientes podem agendar consultas.');
    });
  });

  describe('submitReview', () => {
    it('should call appointmentsService.submitReview and return result', async () => {
      const review = { id: 'rev-1', rating: 5, comment: 'Excellent' };
      mockAppointmentsService.submitReview.mockResolvedValue(review);

      const req = { user: mockUser };
      const result = await controller.submitReview(req, 'appt-1', { rating: 5, comment: 'Excellent' });

      expect(mockAppointmentsService.submitReview).toHaveBeenCalledWith('user-1', 'appt-1', 5, 'Excellent');
      expect(result).toEqual(review);
    });

    it('should call submitReview without comment when omitted', async () => {
      mockAppointmentsService.submitReview.mockResolvedValue({});
      const req = { user: mockUser };

      await controller.submitReview(req, 'appt-2', { rating: 4 });

      expect(mockAppointmentsService.submitReview).toHaveBeenCalledWith('user-1', 'appt-2', 4, undefined);
    });
  });
});
