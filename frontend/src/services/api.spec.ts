import {
  login,
  registerPatient,
  registerProfessional,
  fetchPatientDashboardData,
  fetchProfessionalDashboardData,
  searchDoctors,
  fetchDoctorCalendar,
  createAppointment,
  fetchPatientProfile,
  updatePatientProfile,
  fetchProfessionalProfile,
  updateProfessionalProfile,
  submitReview,
  fetchNotifications,
  markNotificationAsRead,
  saveAvailability,
  fetchAvailabilityByMonth,
} from './api';

describe('API Services', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockResponse = (data: any, ok: boolean = true) => {
    return Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    } as Response);
  };

  describe('auth', () => {
    it('login stores token and returns user', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({
        token: 'fake-token',
        user: { name: 'John', role: 'paciente' },
      }));

      const user = await login({ email: 'test@test.com', password: '123' });
      expect(user.name).toBe('John');
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.any(Object));
    });

    it('login throws error on failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ message: 'Error' }, false));
      await expect(login({ email: 'a@a.com', password: '123' })).rejects.toThrow('Falha no login');
    });

    it('registerPatient registers successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ message: 'Success' }));
      await registerPatient({ name: 'J', email: 'j@j.com', password: '1', phone: '1', address: '1', birthDate: '2000-01-01', cpf: '123' });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/register'), expect.any(Object));
    });

    it('registerProfessional registers successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ message: 'Success' }));
      await registerProfessional({ name: 'D', email: 'd@d.com', password: '1', phone: '1', address: '1', birthDate: '1990-01-01', councilNumber: 'CRM123' });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/register'), expect.any(Object));
    });

    it('register throws error on failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ message: 'Err' }, false));
      await expect(registerPatient({} as any)).rejects.toThrow('Falha ao registrar');
    });
  });

  describe('dashboards', () => {
    it('fetchPatientDashboardData returns data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({
        pendingReviews: [], scheduledAppointments: [], recentHistory: []
      }));
      const data = await fetchPatientDashboardData();
      expect(data.pendingReviews).toEqual([]);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dashboard/patient'), expect.any(Object));
    });

    it('fetchProfessionalDashboardData returns data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({
        tasks: [], upcomingAppointments: [], metrics: [], feedbacks: [], history: []
      }));
      const data = await fetchProfessionalDashboardData();
      expect(data.tasks).toEqual([]);
    });

    it('fetchDashboardData returns fallback on failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({}, false));
      const data = await fetchPatientDashboardData();
      expect(data.pendingReviews).toEqual([]);
    });
  });

  describe('appointments', () => {
    it('searchDoctors fetches doctors', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse([{ id: '1' }]));
      const docs = await searchDoctors({});
      expect(docs).toHaveLength(1);
    });

    it('fetchDoctorCalendar fetches slots', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse([{ day: 1 }]));
      const c = await fetchDoctorCalendar('1', '2026-06');
      expect(c).toHaveLength(1);
    });

    it('createAppointment calls endpoint', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ id: 'apt-1' }));
      await createAppointment({ professionalId: '1', date: '2026-06-15', time: '10:00', mode: 'Presencial' });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/appointments'), expect.any(Object));
    });
    
    it('submitReview posts review', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ id: 'rev-1' }));
      await submitReview({ reviewId: '1', rating: 5, comment: 'Nice' });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/appointments/1/review'), expect.any(Object));
    });
  });

  describe('profiles', () => {
    it('fetchPatientProfile returns profile', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ id: 'pat-1', name: 'John' }));
      const p = await fetchPatientProfile();
      expect(p.name).toBe('John');
    });

    it('updatePatientProfile puts data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ success: true }));
      await updatePatientProfile({ personal: { name: 'A' } } as any);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/profile'), expect.any(Object));
    });

    it('fetchProfessionalProfile returns profile', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ id: 'prof-1' }));
      const p = await fetchProfessionalProfile();
      expect(p.id).toBe('prof-1');
    });

    it('updateProfessionalProfile puts data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ success: true }));
      await updateProfessionalProfile({ personal: { name: 'A' } } as any);
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/users/profile'), expect.any(Object));
    });
  });

  describe('notifications', () => {
    it('fetchNotifications returns array', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse([{ id: 'notif-1' }]));
      const n = await fetchNotifications();
      expect(n).toHaveLength(1);
    });

    it('markNotificationAsRead updates status', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ ok: true }));
      await markNotificationAsRead('notif-1');
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/dashboard/notifications/notif-1/read'), expect.any(Object));
    });
  });

  describe('availability', () => {
    it('fetchAvailabilityByMonth fetches data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse([{ day: 1 }]));
      const a = await fetchAvailabilityByMonth('2026-06');
      expect(a).toHaveLength(1);
    });

    it('saveAvailability posts data', async () => {
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse({ success: true }));
      await saveAvailability({ date: '2026-06-15', slots: ['10:00'] });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/professionals/availability'), expect.any(Object));
    });
  });
});
