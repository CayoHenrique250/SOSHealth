import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    patient: { findUnique: jest.fn() },
    professional: { findUnique: jest.fn() },
    notification: { findMany: jest.fn(), updateMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const getFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getPastDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  describe('getPatientDashboard', () => {
    it('should return empty data if patient not found', async () => {
      mockPrismaService.patient.findUnique.mockResolvedValue(null);
      const res = await service.getPatientDashboard('user-1');
      expect(res).toEqual({ pendingReviews: [], scheduledAppointments: [], recentHistory: [] });
    });

    it('should return categorized appointments for patient', async () => {
      const future = getFutureDate();
      const past = getPastDate();
      
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-1', 
            status: 'confirmada',
            date: future,
            time: '10:00',
            mode: 'Presencial',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. John' }, specialty: 'Cardiologia' }
          },
          {
            id: 'apt-2',
            status: 'confirmada',
            date: past,
            time: '10:00',
            mode: 'Teleatendimento',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. John' }, specialty: 'Cardiologia' },
            review: null,
          },
          {
            id: 'apt-3',
            status: 'realizada',
            date: past,
            time: '09:00',
            mode: 'Presencial',
            professionalId: 'prof-2',
            professional: { user: { name: 'Dr. Jane' }, specialty: 'Geral' },
            review: { id: 'rev-1', rating: 5 },
          }
        ]
      });

      const res = await service.getPatientDashboard('user-1');
      expect(res.scheduledAppointments).toHaveLength(1);
      expect(res.scheduledAppointments[0].id).toBe('apt-1');
      
      expect(res.recentHistory).toHaveLength(2); 
      expect(res.pendingReviews).toHaveLength(1);
      expect(res.pendingReviews[0].id).toBe('apt-2');
    });

    it('should include pagamento_pendente future appointments as scheduled', async () => {
      const future = getFutureDate();
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-pend',
            status: 'pagamento_pendente',
            date: future,
            time: '14:00',
            mode: 'Teleatendimento',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. K' }, specialty: 'Psicologia' },
            review: null,
          },
        ],
      });
      const res = await service.getPatientDashboard('user-1');
      expect(res.scheduledAppointments).toHaveLength(1);
      expect(res.scheduledAppointments[0].attendanceMode).toBe('Teleatendimento');
    });
  });


  describe('getProfessionalDashboard', () => {
    it('should return empty data if professional not found', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue(null);
      const res = await service.getProfessionalDashboard('user-1');
      expect(res.tasks).toEqual([]);
      expect(res.metrics[0].value).toBe('0');
    });

    it('should return categorized appointments for professional', async () => {
      const today = getTodayDate();
      const past = getPastDate();
      const future = getFutureDate();

      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        specialty: 'Cardio',
        appointments: [
          {
            id: 'apt-1', 
            status: 'confirmada',
            date: today,
            time: '23:59',
            mode: 'Presencial',
            patient: { user: { name: 'Alice' } },
            review: null,
          },
          {
            id: 'apt-2', 
            status: 'confirmada',
            date: past,
            time: '10:00',
            mode: 'Teleatendimento',
            patient: { user: { name: 'Bob' } },
            review: { rating: 5, comment: 'Good', createdAt: new Date() },
          },
          {
            id: 'apt-3', 
            status: 'confirmada',
            date: future,
            time: '14:00',
            mode: 'Presencial',
            patient: { user: { name: 'Charlie' } },
            review: null,
          }
        ]
      });

      const res = await service.getProfessionalDashboard('user-1');
      expect(res.tasks).toHaveLength(1);
      expect(res.tasks[0].id).toBe('apt-1');
      
      expect(res.upcomingAppointments).toHaveLength(2); 
      
      expect(res.history).toHaveLength(1);
      expect(res.history[0].id).toBe('apt-2');

      expect(res.feedbacks).toHaveLength(1);
      expect(res.feedbacks[0].rating).toBe(5);
      
      expect(res.metrics[0].label).toBe('Consultas no mês');
    });
    
    it('should handle zero monthly appointments for metrics', async () => {
      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        appointments: []
      });
      const res = await service.getProfessionalDashboard('user-1');
      expect(res.metrics[1].value).toBe('—');
      expect(res.metrics[2].value).toBe('—');
    });
  });

  describe('getNotifications', () => {
    it('should return notifications', async () => {
      mockPrismaService.notification.findMany.mockResolvedValue([{ id: 'notif-1' }]);
      const res = await service.getNotifications('user-1');
      expect(res).toEqual([{ id: 'notif-1' }]);
    });
  });

  describe('markNotificationRead', () => {
    it('should update notification', async () => {
      mockPrismaService.notification.updateMany.mockResolvedValue({ count: 1 });
      const res = await service.markNotificationRead('notif-1', 'user-1');
      expect(res).toEqual({ count: 1 });
    });
  });

  describe('isPast (edge cases via getPatientDashboard)', () => {
    it('should treat a date in the past as past', async () => {
      const past = getPastDate(); 
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-past-time',
            status: 'confirmada',
            date: past,
            time: '10:00',
            mode: 'Presencial',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. X' }, specialty: 'Geral' },
            review: null,
          },
        ],
      });
      const res = await service.getPatientDashboard('user-1');

      expect(res.recentHistory.length).toBeGreaterThanOrEqual(1);
    });

    it('should treat future time today as NOT past', async () => {
      const today = getTodayDate();
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-future-today',
            status: 'confirmada',
            date: today,
            time: '23:59',
            mode: 'Teleatendimento',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. Y' }, specialty: 'Cardiologia' },
            review: null,
          },
        ],
      });
      const res = await service.getPatientDashboard('user-1');

      expect(res.scheduledAppointments.length).toBe(1);
    });

    it('should include realizada appointment in recentHistory even if no review', async () => {
      const past = getPastDate();
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-realizada',
            status: 'realizada',
            date: past,
            time: '10:00',
            mode: 'Presencial',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. Z' }, specialty: null },
            review: null,
          },
        ],
      });
      const res = await service.getPatientDashboard('user-1');
      expect(res.recentHistory).toHaveLength(1);
      expect(res.recentHistory[0].specialty).toBe('Geral');
      expect(res.pendingReviews).toHaveLength(1);
    });

    it('should not include realizada appointment with review in pendingReviews', async () => {
      const past = getPastDate();
      mockPrismaService.patient.findUnique.mockResolvedValue({
        id: 'pat-1',
        appointments: [
          {
            id: 'apt-reviewed',
            status: 'realizada',
            date: past,
            time: '10:00',
            mode: 'Presencial',
            professionalId: 'prof-1',
            professional: { user: { name: 'Dr. W' }, specialty: 'Pediatria' },
            review: { id: 'rev-1', rating: 4, comment: 'Good' },
          },
        ],
      });
      const res = await service.getPatientDashboard('user-1');
      expect(res.pendingReviews).toHaveLength(0);
    });
  });

  describe('getProfessionalDashboard - additional branches', () => {
    it('should include pagamento_pendente appointments in tasks when today', async () => {
      const today = getTodayDate();
      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        specialty: null,
        appointments: [
          {
            id: 'apt-pagamento',
            status: 'pagamento_pendente',
            date: today,
            time: '23:59',
            mode: 'Teleatendimento',
            patient: { user: { name: 'David' } },
            review: null,
          },
        ],
      });
      const res = await service.getProfessionalDashboard('user-1');
      expect(res.tasks).toHaveLength(1);
      expect(res.tasks[0].patientName).toBe('David');
    });

    it('should compute avgRating correctly when there are reviews', async () => {
      const past = getPastDate();
      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        specialty: 'Geral',
        appointments: [
          {
            id: 'apt-1',
            status: 'realizada',
            date: past,
            time: '10:00',
            mode: 'Presencial',
            patient: { user: { name: 'A' } },
            review: { rating: 4, comment: 'OK', createdAt: new Date() },
          },
          {
            id: 'apt-2',
            status: 'realizada',
            date: past,
            time: '11:00',
            mode: 'Presencial',
            patient: { user: { name: 'B' } },
            review: { rating: 2, comment: 'Bad', createdAt: new Date() },
          },
        ],
      });
      const res = await service.getProfessionalDashboard('user-1');
      expect(res.metrics[2].value).toBe('3.0');
    });

    it('should compute attendance rate correctly', async () => {
      const today = getTodayDate();
      const past = getPastDate();

      const thisMonthPast = past.startsWith(today.slice(0, 7)) ? past : today;

      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        specialty: 'Geral',
        appointments: [
          {
            id: 'apt-done',
            status: 'realizada',
            date: thisMonthPast,
            time: '09:00',
            mode: 'Presencial',
            patient: { user: { name: 'A' } },
            review: null,
          },
          {
            id: 'apt-future',
            status: 'confirmada',
            date: today,
            time: '23:59',
            mode: 'Presencial',
            patient: { user: { name: 'B' } },
            review: null,
          },
        ],
      });
      const res = await service.getProfessionalDashboard('user-1');
  
      expect(res.metrics[0].value).not.toBe('0');
    });

    it('should limit history to 10 items', async () => {
      const past = getPastDate();
      const appointments = Array.from({ length: 15 }, (_, i) => ({
        id: `apt-${i}`,
        status: 'realizada',
        date: past,
        time: '09:00',
        mode: 'Presencial',
        patient: { user: { name: `Patient ${i}` } },
        review: null,
      }));
      mockPrismaService.professional.findUnique.mockResolvedValue({
        id: 'prof-1',
        specialty: 'Geral',
        appointments,
      });
      const res = await service.getProfessionalDashboard('user-1');
      expect(res.history).toHaveLength(10);
    });
  });
});
