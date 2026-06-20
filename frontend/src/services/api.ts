export type UserRole = "paciente" | "profissional";
export type AttendanceMode = "Teleatendimento" | "Presencial";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://soshealth-backend.onrender.com";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DoctorPublicReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  attendanceMode: AttendanceMode;
  proximityKm: number;
  bio: string;
  education: string[];
  detailedCurriculum: string;
  reviews: DoctorPublicReview[];
}

export interface DayAvailability {
  day: number;
  status: "available" | "full";
  slots: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  href?: string;
}

export interface PendingReview {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  doctorImage: string;
  date: string;
  time: string;
}

export interface ConsultationHistoryItem {
  id: string;
  doctorName: string;
  date: string;
  specialty: string;
  attendanceMode: AttendanceMode;
  status: "realizada" | "cancelada";
}

export interface ScheduledAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  attendanceMode: AttendanceMode;
  status: "confirmada" | "pendente_pagamento";
}

export interface PatientDashboardData {
  pendingReviews: PendingReview[];
  recentHistory: ConsultationHistoryItem[];
  scheduledAppointments: ScheduledAppointment[];
}

export interface ProfessionalTask {
  id: string;
  time: string;
  patientName: string;
  type: string;
}

export interface ProfessionalMetric {
  label: string;
  value: string;
}

export interface ProfessionalFeedback {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProfessionalHistoryItem {
  id: string;
  patientName: string;
  date: string;
  specialty: string;
}

export interface ProfessionalUpcomingAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
}

export interface ProfessionalDashboardData {
  tasks: ProfessionalTask[];
  upcomingAppointments?: ProfessionalUpcomingAppointment[];
  metrics: ProfessionalMetric[];
  feedbacks: ProfessionalFeedback[];
  history: ProfessionalHistoryItem[];
}

export interface SearchFilters {
  specialty?: string;
  location?: string;
  priceRange?: "all" | "low" | "mid" | "high";
  minRating?: number;
  proximity?: "all" | "5" | "10" | "20";
}

export interface PatientMedicalProfile {
  queixaPrincipal: string;
  hda: string;
  hppHf: string;
  habitos: string;
  medicamentos: string;
  alergias: string;
  cirurgiasPrevias: string;
  vacinacao: string;
  observacoes: string;
  weightKg: number;
  heightM: number;
}

export interface PatientProfileData {
  personal: {
    name: string;
    cpf: string;
    birthDate: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
  };
  medical: PatientMedicalProfile;
}

export interface ProfessionalProfileData {
  personal: {
    name: string;
    specialty?: string;
    councilNumber: string;
    birthDate: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
  };
  curriculum: {
    summary: string;
    education: string;
    experience: string;
    certifications: string;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface SubmitReviewPayload {
  reviewId: string;
  rating: number;
  comment: string;
}

interface RegisterPatientPayload {
  name: string;
  cpf: string;
  birthDate: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface RegisterProfessionalPayload {
  name: string;
  councilNumber: string;
  birthDate: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

interface AvailabilityPayload {
  monthKey: string;
  day: number;
  time: string;
  price: number;
  mode: AttendanceMode;
}

const getAuthHeaders = () => {
  if (typeof window === "undefined") return { "Content-Type": "application/json" };
  const token = localStorage.getItem("@SOSHealth:token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const wait = async (ms = 700) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const specialties = [
  "Psicologia",
  "Cardiologia",
  "Pediatria",
  "Ortopedia",
  "Clínica Geral",
];
const locations = [
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
  "Belo Horizonte - MG",
  "Curitiba - PR",
];

const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dra. Flávia Montes",
    specialty: "Psicologia",
    location: "São Paulo - SP",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500",
    rating: 4.8,
    reviewCount: 182,
    price: 180,
    attendanceMode: "Teleatendimento",
    proximityKm: 4,
    bio: "Psicóloga clínica com foco em ansiedade e saúde emocional.",
    education: [
      "USP - Psicologia",
      "Especialização em Terapia Cognitivo-Comportamental",
    ],
    detailedCurriculum:
      "Atuação clínica há mais de 10 anos em TCC e manejo de crises de ansiedade. Experiência em grupos de habilidades sociais e orientação a famílias. Publicações em revistas nacionais de psicologia da saúde.",
    reviews: [
      {
        id: "d1r1",
        author: "Patrícia M.",
        rating: 5,
        comment: "Muito acolhedora e profissional.",
        date: "02/2026",
      },
      {
        id: "d1r2",
        author: "Ricardo T.",
        rating: 5,
        comment: "Me ajudou a entender minha ansiedade com clareza.",
        date: "01/2026",
      },
      {
        id: "d1r3",
        author: "Luana F.",
        rating: 4,
        comment: "Consultas pontuais e ambiente tranquilo.",
        date: "12/2025",
      },
    ],
  },
  {
    id: "d2",
    name: "Dr. Carlos Silva",
    specialty: "Cardiologia",
    location: "Rio de Janeiro - RJ",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500",
    rating: 4.7,
    reviewCount: 129,
    price: 240,
    attendanceMode: "Presencial",
    proximityKm: 8,
    bio: "Cardiologista com atendimento adulto e prevenção cardiovascular.",
    education: ["UFRJ - Medicina", "Residência em Cardiologia - INC"],
    detailedCurriculum:
      "Cardiologista com ênfase em prevenção primária e secundária, hipertensão, dislipidemias e insuficiência cardíaca. Participação em congressos da SBC e telecardiologia desde 2019.",
    reviews: [
      {
        id: "d2r1",
        author: "Ana Souza",
        rating: 5,
        comment: "Explicação detalhada dos exames.",
        date: "03/2026",
      },
      {
        id: "d2r2",
        author: "Marcos Lima",
        rating: 4,
        comment: "Consulta objetiva e sem pressa.",
        date: "02/2026",
      },
    ],
  },
  {
    id: "d3",
    name: "Dra. Marta Lima",
    specialty: "Pediatria",
    location: "Curitiba - PR",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500",
    rating: 4.9,
    reviewCount: 210,
    price: 190,
    attendanceMode: "Teleatendimento",
    proximityKm: 12,
    bio: "Pediatra com experiência em puericultura e acompanhamento de desenvolvimento.",
    education: ["UFPR - Medicina", "Residência em Pediatria - HC/UFPR"],
    detailedCurriculum:
      "Pediatra com foco em puericultura, aleitamento materno, vacinação e desenvolvimento neuropsicomotor. Atendimento humanizado a crianças de 0 a 14 anos e orientação aos responsáveis.",
    reviews: [
      {
        id: "d3r1",
        author: "Fernanda K.",
        rating: 5,
        comment: "Minha filha adorou a consulta.",
        date: "04/2026",
      },
      {
        id: "d3r2",
        author: "Paulo R.",
        rating: 5,
        comment: "Orientações claras sobre vacinas.",
        date: "03/2026",
      },
      {
        id: "d3r3",
        author: "Juliana P.",
        rating: 4,
        comment: "Teleconsulta muito prática.",
        date: "02/2026",
      },
    ],
  },
  {
    id: "d4",
    name: "Dr. Pedro Alves",
    specialty: "Ortopedia",
    location: "São Paulo - SP",
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500",
    rating: 4.4,
    reviewCount: 91,
    price: 220,
    attendanceMode: "Presencial",
    proximityKm: 3,
    bio: "Ortopedista com foco em dores articulares e medicina esportiva.",
    education: ["UNIFESP - Medicina", "Residência em Ortopedia - IOT/HC"],
    detailedCurriculum:
      "Experiência em trauma esportivo, joelho e ombro. Indicação conservadora quando possível e encaminhamento cirúrgico quando necessário. Equipe multidisciplinar com fisioterapia.",
    reviews: [
      {
        id: "d4r1",
        author: "Carlos E.",
        rating: 4,
        comment: "Bom para dor no joelho após corrida.",
        date: "01/2026",
      },
    ],
  },
];

function generateMockCalendarForMonth(
  doctorId: string,
  year: number,
  monthIndex: number,
): DayAvailability[] {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const slotsPool = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];
  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const seed = (doctorId.charCodeAt(1) || 0) + day * 7 + monthIndex * 13;
    const available = seed % 5 !== 0 && seed % 7 !== 0;
    const slots = available
      ? slotsPool
          .filter((_, idx) => (seed + idx) % 3 !== 0)
          .slice(0, Math.min(4, 2 + (seed % 3)))
      : [];
    return {
      day,
      status: available && slots.length > 0 ? "available" : "full",
      slots,
    };
  });
}

let pendingReviews: PendingReview[] = [];

const patientHistory: ConsultationHistoryItem[] = [
  {
    id: "h1",
    doctorName: "Dr. Carlos Silva",
    date: "03/05/2026",
    specialty: "Cardiologia",
    attendanceMode: "Presencial",
    status: "realizada",
  },
  {
    id: "h2",
    doctorName: "Dra. Marta Lima",
    date: "26/04/2026",
    specialty: "Pediatria",
    attendanceMode: "Teleatendimento",
    status: "realizada",
  },
];

const patientProfile: PatientProfileData = {
  personal: {
    name: "Maribel Beltrano",
    cpf: "12345678901",
    birthDate: "1995-04-12",
    email: "paciente@gmail.com",
    phone: "(11) 99999-0000",
    address: "Rua das Flores, 123",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
  },
  medical: {
    queixaPrincipal:
      "Cefaleia tensional há cerca de 3 semanas, predominantemente em região occipital, com intensidade moderada (5–7/10), piorando ao final do dia e melhorando com repouso em alguns episódios.",
    hda: "Início gradual após período de estresse laboral e sono irregular. Episódios quase diários, duração de 2 a 4 horas. Náuseas leves ocasionais, sem fotofobia intensa ou déficit neurológico relatado. Não há trauma craniano recente.",
    hppHf:
      "HAS materna (controlada). Nega DM ou dislipidemia diagnosticados. Nega cirurgias de grande porte. Alergia leve a dipirona (urticária).",
    habitos:
      "Sono 5–6h/noite em média. Café 3x/dia. Sedentarismo leve no trabalho; caminhada leve 2–3x/semana. Tabagismo negado. Etilismo social ocasional.",
    medicamentos:
      "Uso eventual de dipirona (com cautela devido à alergia); ocasionalmente ibuprofeno 400 mg.",
    alergias: "Dipirona — reação cutânea leve (urticária) em uso prévio.",
    cirurgiasPrevias:
      "Apendicectomia laparoscópica aos 18 anos, sem intercorrências.",
    vacinacao:
      "Esquema vacinal do adulto em dia conforme cartão (influenza anual).",
    observacoes:
      "Busca orientação para manejo não medicamentoso (sono, ergonomia) e avaliação se necessidade de investigação complementar.",
    weightKg: 68,
    heightM: 1.65,
  },
};

const professionalProfile: ProfessionalProfileData = {
  personal: {
    name: "Dr. Carlos Silva",
    councilNumber: "CRM 45678-SP",
    birthDate: "1986-09-08",
    email: "user@gmail.com",
    phone: "(11) 97777-6666",
    address: "Av. Paulista, 1000 - Sala 402",
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
  },
  curriculum: {
    summary:
      "Médico cardiologista com 12 anos de experiência em ambulatório, internação e telemedicina. Foco em prevenção cardiovascular, hipertensão, dislipidemias e insuficiência cardíaca.",
    education:
      "Graduação em Medicina — UFRJ (2008–2013).\nResidência Médica em Clínica Médica — Hospital Municipal (2014–2015).\nResidência em Cardiologia — INC (2016–2018).",
    experience:
      "2018–atual: cardiologista em serviço de referência; plantões de emergência cardiológica; mentoria de residentes.\n2016–2018: plantão em UTI cardiológica durante residência.\nParticipação em grupos de estudo de imagem cardíaca e telecardiologia.",
    certifications:
      "Título de Especialista em Cardiologia (SBC).\nACLS (Suporte Avançado de Vida em Cardiologia).\nCursos de ecocardiografia transtorácica.",
  },
};

const professionalFeedbacks: ProfessionalFeedback[] = [
  {
    id: "f1",
    patientName: "Ana Souza",
    rating: 5,
    comment: "Atendimento excelente, muito atencioso.",
    createdAt: "Hoje",
  },
  {
    id: "f2",
    patientName: "Marcos Lima",
    rating: 4,
    comment: "Consulta objetiva e clara.",
    createdAt: "Ontem",
  },
];

const professionalHistory: ProfessionalHistoryItem[] = [
  {
    id: "ph1",
    patientName: "Maribel Beltrano",
    date: "08/05/2026",
    specialty: "Cardiologia",
  },
  {
    id: "ph2",
    patientName: "João Viana",
    date: "06/05/2026",
    specialty: "Cardiologia",
  },
];

const availabilityByMonth: Record<string, DayAvailability[]> = {
  "2026-05": [
    { day: 2, status: "available", slots: ["08:00", "09:00"] },
    { day: 12, status: "available", slots: ["14:00"] },
    { day: 20, status: "available", slots: ["16:00"] },
  ],
  "2026-06": [{ day: 6, status: "available", slots: ["09:30"] }],
};

export const fetchSpecialties = async (): Promise<string[]> => {
  await wait(300);
  return specialties;
};

export const fetchLocations = async (): Promise<string[]> => {
  await wait(300);
  return locations;
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  const response = await fetch(`${API_URL}/professionals`);
  if (!response.ok) return doctors; // fallback to static demos
  return response.json();
};

export const searchDoctors = async (
  filters: SearchFilters,
): Promise<Doctor[]> => {
  const params = new URLSearchParams();
  if (filters.specialty) params.set('specialty', filters.specialty);
  if (filters.location) params.set('location', filters.location);
  const response = await fetch(`${API_URL}/professionals?${params.toString()}`);
  const all: Doctor[] = response.ok ? await response.json() : doctors;
  return all.filter((doctor) => {
    const byRating = !filters.minRating || doctor.rating >= filters.minRating;
    const byPrice =
      !filters.priceRange ||
      filters.priceRange === "all" ||
      (filters.priceRange === "low" && doctor.price <= 180) ||
      (filters.priceRange === "mid" && doctor.price > 180 && doctor.price <= 230) ||
      (filters.priceRange === "high" && doctor.price > 230);
    return byRating && byPrice;
  });
};

export const fetchDoctorCalendar = async (
  doctorId: string,
  monthKey?: string,
): Promise<DayAvailability[]> => {
  const now = new Date();
  const key =
    monthKey ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const response = await fetch(`${API_URL}/professionals/${doctorId}/calendar?month=${key}`);
  if (!response.ok) {
    // Fallback: generate mock calendar so hardcoded doctors still show availability
    const [y, mo] = key.split("-").map(Number);
    return generateMockCalendarForMonth(doctorId, y || now.getFullYear(), (mo || now.getMonth() + 1) - 1);
  }
  return response.json();
};

export const fetchNotifications = async (
  _role: UserRole,
): Promise<NotificationItem[]> => {
  const response = await fetch(`${API_URL}/dashboard/notifications`, { headers: getAuthHeaders() });
  if (!response.ok) return [];
  const data: Array<{ id: string; title: string; description: string; createdAt: string; href?: string | null }> = await response.json();
  return data.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    timestamp: new Date(n.createdAt).toLocaleDateString('pt-BR'),
    href: n.href || undefined,
  }));
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await fetch(`${API_URL}/dashboard/notifications/${id}/read`, { method: "POST", headers: getAuthHeaders() });
};

const scheduledAppointments: ScheduledAppointment[] = [
  {
    id: "s1",
    doctorName: "Dr. Carlos Silva",
    specialty: "Cardiologia",
    date: "16/05/2026",
    time: "10:00",
    attendanceMode: "Presencial",
    status: "confirmada",
  },
  {
    id: "s2",
    doctorName: "Dra. Flávia Montes",
    specialty: "Psicologia",
    date: "22/05/2026",
    time: "15:30",
    attendanceMode: "Teleatendimento",
    status: "pendente_pagamento",
  },
];

export const fetchPatientDashboardData =
  async (): Promise<PatientDashboardData> => {
    const response = await fetch(`${API_URL}/dashboard/patient`, { headers: getAuthHeaders() });
    if (!response.ok) return { pendingReviews: [], scheduledAppointments: [], recentHistory: [] };
    return response.json();
  };

export const submitReview = async (payload: { reviewId: string; rating: number; comment: string }): Promise<void> => {
  const response = await fetch(`${API_URL}/appointments/${payload.reviewId}/review`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating: payload.rating, comment: payload.comment }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Erro ao enviar avaliação.');
  }
};

export const submitPendingReview = async (
  payload: SubmitReviewPayload,
): Promise<void> => {
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("A nota deve estar entre 1 e 5 estrelas.");
  }
  const response = await fetch(`${API_URL}/appointments/${payload.reviewId}/review`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating: payload.rating, comment: payload.comment }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao enviar avaliação.");
  }

  pendingReviews = pendingReviews.filter((item) => item.id !== payload.reviewId);
};

export const fetchProfessionalDashboardData =
  async (): Promise<ProfessionalDashboardData> => {
    const response = await fetch(`${API_URL}/dashboard/professional`, { headers: getAuthHeaders() });
    if (!response.ok) return { tasks: [], upcomingAppointments: [], metrics: [], feedbacks: [], history: [] };
    return response.json();
  };

export const fetchPatientProfile = async (): Promise<any> => {
  const response = await fetch(`${API_URL}/users/profile`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Erro ao buscar perfil.");
  const data = await response.json();
  return data;
};

export const updatePatientProfile = async (payload: {
  personal?: Partial<PatientProfileData["personal"]>;
  medical?: Partial<PatientProfileData["medical"]>;
}): Promise<PatientProfileData> => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao atualizar perfil.");
  return fetchPatientProfile();
};

export const fetchProfessionalProfile =
  async (): Promise<ProfessionalProfileData> => {
    const response = await fetch(`${API_URL}/users/profile/professional`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error("Erro ao buscar perfil.");
    const data = await response.json();
    return data;
  };

export const updateProfessionalProfile = async (payload: {
  personal?: Partial<ProfessionalProfileData["personal"]>;
  curriculum?: Partial<ProfessionalProfileData["curriculum"]>;
}): Promise<ProfessionalProfileData> => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Erro ao atualizar perfil.");
  return fetchProfessionalProfile();
};

export const fetchAnamneseDefaults =
  async (): Promise<PatientMedicalProfile> => {
    const profile = await fetchPatientProfile();
    return profile.medical;
  };

export const updateAnamneseAndProfile = async (
  data: Pick<
    PatientMedicalProfile,
    "queixaPrincipal" | "hda" | "hppHf" | "habitos"
  >,
): Promise<void> => {
  const response = await fetch(`${API_URL}/users/anamnese`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar anamnese.");
};

export const createAppointment = async (payload?: { professionalId: string; date: string; time: string; mode: string }): Promise<void> => {
  if (payload) {
    const response = await fetch(`${API_URL}/appointments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar agendamento.");
    }
  } else {
    await wait(500);
  }
};

export const registerPatient = async (
  payload: RegisterPatientPayload,
): Promise<void> => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      role: "PACIENTE",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message
      ? Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message
      : "Falha ao registrar";
    throw new Error(errorMessage);
  }
};

export const registerProfessional = async (
  payload: RegisterProfessionalPayload,
): Promise<void> => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      role: "PROFISSIONAL",
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message
      ? Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message
      : "Falha ao registrar";
    throw new Error(errorMessage);
  }
};

export const login = async (
  data: LoginData,
): Promise<{ token: string; user: AuthUser }> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message
      ? Array.isArray(errorData.message)
        ? errorData.message.join(", ")
        : errorData.message
      : "Falha no login";
    throw new Error(errorMessage);
  }

  return response.json();
};

export const mockLogin = async (
  data: LoginData,
): Promise<{ token: string; user: AuthUser }> => {
  await wait();
  const lowerMail = data.email.toLowerCase();

  if (data.password !== "senha123") {
    throw new Error("E-mail ou senha incorretos");
  }

  if (lowerMail === "paciente@gmail.com") {
    return {
      token: "fake-jwt-token",
      user: {
        name: "Maribel Beltrano",
        email: lowerMail,
        role: "paciente",
        avatar: patientProfile.personal.avatar,
      },
    };
  }

  if (lowerMail === "user@gmail.com") {
    return {
      token: "fake-jwt-token",
      user: {
        name: "Dr. Carlos Silva",
        email: lowerMail,
        role: "profissional",
        avatar: professionalProfile.personal.avatar,
      },
    };
  }

  throw new Error("E-mail ou senha incorretos");
};

export const fetchAvailabilityByMonth = async (
  monthKey: string,
  professionalId?: string,
): Promise<DayAvailability[]> => {
  if (professionalId) {
    
    const response = await fetch(
      `${API_URL}/professionals/${professionalId}/calendar?month=${monthKey}`,
      { headers: { 'Content-Type': 'application/json' } },
    );
    if (!response.ok) return [];
    return response.json();
  }
  
  const response = await fetch(
    `${API_URL}/professionals/me/calendar?month=${monthKey}`,
    { headers: getAuthHeaders() },
  ).catch(() => null);
  if (response && response.ok) return response.json();
  return availabilityByMonth[monthKey] ?? [];
};

export const saveAvailability = async (payload: AvailabilityPayload): Promise<void> => {

  const monthKey = payload.monthKey ?? payload.date.slice(0, 7);
  const response = await fetch(`${API_URL}/professionals/availability`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...payload, monthKey }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Erro ao salvar disponibilidade.");
  }

  const [yStr, mStr] = monthKey.split("-");
  const y = Number(yStr);
  const m0 = Number(mStr) - 1;
  const slotDate = new Date(y, m0, payload.day);
  slotDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (slotDate < today) {
    throw new Error("Não é possível cadastrar disponibilidade em dia anterior a hoje.");
  }

  if (!availabilityByMonth[monthKey]) {
    availabilityByMonth[monthKey] = [];
  }

  const monthData = availabilityByMonth[monthKey];
  const dayIndex = monthData.findIndex((item) => item.day === payload.day);
  const itemToSave: DayAvailability = {
    day: payload.day,
    status: "available",
    slots: [
      ...(dayIndex >= 0 ? monthData[dayIndex].slots : []),
      `${payload.time ?? ''} - R$ ${payload.price ?? ''} (${payload.mode ?? ''})`,
    ],
  };

  if (dayIndex >= 0) {
    monthData[dayIndex] = itemToSave;
  } else {
    monthData.push(itemToSave);
  }
};
