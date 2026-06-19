import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function isPast(dateStr: string, timeStr: string) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const localDate = `${year}-${month}-${day}`;
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const localTime = `${hours}:${minutes}`;

  if (dateStr < localDate) return true;
  if (dateStr === localDate && timeStr < localTime) return true;
  return false;
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getPatientDashboard(userId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      include: {
        appointments: {
          include: {
            professional: {
              include: { user: { select: { name: true } } },
            },
            review: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!patient) {
      return {
        pendingReviews: [],
        scheduledAppointments: [],
        recentHistory: [],
      };
    }

    const scheduled = patient.appointments
      .filter((a) => (a.status === 'confirmada' || a.status === 'pagamento_pendente') && !isPast(a.date, a.time))
      .map((a) => ({
        id: a.id,
        doctorName: a.professional.user.name,
        specialty: a.professional.specialty || 'Geral',
        date: a.date,
        time: a.time,
        attendanceMode: a.mode,
        status: a.status,
      }));

    const history = patient.appointments
      .filter((a) => a.status === 'realizada' || (a.status === 'confirmada' && isPast(a.date, a.time)))
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        doctorName: a.professional.user.name,
        specialty: a.professional.specialty || 'Geral',
        date: a.date,
        attendanceMode: a.mode,
        status: 'realizada',
      }));

    const pendingReviews = patient.appointments
      .filter((a) => (a.status === 'realizada' || (a.status === 'confirmada' && isPast(a.date, a.time))) && !a.review)
      .map((a) => ({
        id: a.id,
        doctorId: a.professionalId,
        doctorName: a.professional.user.name,
        specialty: a.professional.specialty || 'Geral',
        doctorImage: null,
        date: a.date,
        time: a.time,
      }));

    return { pendingReviews, scheduledAppointments: scheduled, recentHistory: history };
  }

  async getProfessionalDashboard(userId: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { userId },
      include: {
        appointments: {
          include: {
            patient: {
              include: { user: { select: { name: true } } },
            },
            review: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!professional) {
      return {
        tasks: [],
        metrics: [
          { label: 'Consultas no mês', value: '0' },
          { label: 'Taxa de comparecimento', value: '—' },
          { label: 'Avaliação média', value: '—' },
        ],
        feedbacks: [],
        history: [],
      };
    }

    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const tasks = professional.appointments
      .filter((a) => a.date === today && (a.status === 'confirmada' || a.status === 'pagamento_pendente') && !isPast(a.date, a.time))
      .map((a) => ({
        id: a.id,
        time: a.time,
        patientName: a.patient.user.name,
        type: a.mode,
      }));

    const upcomingAppointments = professional.appointments
      .filter((a) => (a.status === 'confirmada' || a.status === 'pagamento_pendente') && !isPast(a.date, a.time))
      .map((a) => ({
        id: a.id,
        patientName: a.patient.user.name,
        date: a.date,
        time: a.time,
        type: a.mode,
      }));

    const thisMonth = today.slice(0, 7);
    const monthlyAppointments = professional.appointments.filter((a) => a.date.startsWith(thisMonth));
    const done = monthlyAppointments.filter((a) => a.status === 'realizada' || (a.status === 'confirmada' && isPast(a.date, a.time)));
    const attendanceRate = monthlyAppointments.length > 0
      ? `${Math.round((done.length / monthlyAppointments.length) * 100)}%`
      : '—';

    const ratingsWithReview = professional.appointments.filter((a) => a.review);
    const avgRating = ratingsWithReview.length > 0
      ? (ratingsWithReview.reduce((sum, a) => sum + (a.review?.rating ?? 0), 0) / ratingsWithReview.length).toFixed(1)
      : '—';

    const metrics = [
      { label: 'Consultas no mês', value: String(monthlyAppointments.length) },
      { label: 'Taxa de comparecimento', value: attendanceRate },
      { label: 'Avaliação média', value: avgRating },
    ];

    const feedbacks = professional.appointments
      .filter((a) => a.review)
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        patientName: a.patient.user.name,
        rating: a.review!.rating,
        comment: a.review!.comment || '',
        createdAt: new Date(a.review!.createdAt).toLocaleDateString('pt-BR'),
      }));

    const history = professional.appointments
      .filter((a) => a.status === 'realizada' || (a.status === 'confirmada' && isPast(a.date, a.time)))
      .slice(0, 10)
      .map((a) => ({
        id: a.id,
        patientName: a.patient.user.name,
        date: a.date,
        specialty: professional.specialty || 'Geral',
      }));

    return { tasks, upcomingAppointments, metrics, feedbacks, history };
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markNotificationRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }
}
