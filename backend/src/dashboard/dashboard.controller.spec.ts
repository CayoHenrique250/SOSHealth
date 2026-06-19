import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const mockDashboardService = {
  getPatientDashboard: jest.fn(),
  getProfessionalDashboard: jest.fn(),
  getNotifications: jest.fn(),
  markNotificationRead: jest.fn(),
};

const mockUser = { userId: 'user-1', email: 'test@test.com', role: 'paciente' };

describe('DashboardController', () => {
  let controller: DashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPatientDashboard', () => {
    it('should return patient dashboard data', async () => {
      const dashData = { pendingReviews: [], scheduledAppointments: [], recentHistory: [] };
      mockDashboardService.getPatientDashboard.mockResolvedValue(dashData);

      const result = await controller.getPatientDashboard({ user: mockUser });

      expect(mockDashboardService.getPatientDashboard).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(dashData);
    });
  });

  describe('getProfessionalDashboard', () => {
    it('should return professional dashboard data', async () => {
      const dashData = { tasks: [], metrics: [], feedbacks: [], history: [] };
      mockDashboardService.getProfessionalDashboard.mockResolvedValue(dashData);

      const result = await controller.getProfessionalDashboard({ user: mockUser });

      expect(mockDashboardService.getProfessionalDashboard).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(dashData);
    });
  });

  describe('getNotifications', () => {
    it('should return notifications list', async () => {
      const notifications = [{ id: 'n1', title: 'Test', description: 'Desc', createdAt: new Date() }];
      mockDashboardService.getNotifications.mockResolvedValue(notifications);

      const result = await controller.getNotifications({ user: mockUser });

      expect(mockDashboardService.getNotifications).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(notifications);
    });
  });

  describe('markRead', () => {
    it('should mark notification as read', async () => {
      mockDashboardService.markNotificationRead.mockResolvedValue({ count: 1 });

      const result = await controller.markRead('notif-1', { user: mockUser });

      expect(mockDashboardService.markNotificationRead).toHaveBeenCalledWith('notif-1', 'user-1');
      expect(result).toEqual({ count: 1 });
    });
  });
});
