export type UserRole = "paciente" | "profissional";
export type AttendanceMode = "Teleatendimento" | "Presencial";

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

export interface ProfessionalDashboardData {
  tasks: ProfessionalTask[];
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

const wait = async (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

const specialties = ["Psicologia", "Cardiologia", "Pediatria", "Ortopedia", "Clínica Geral"];
const locations = ["São Paulo - SP", "Rio de Janeiro - RJ", "Belo Horizonte - MG", "Curitiba - PR"];

const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dra. Flávia Montes",
    specialty: "Psicologia",
    location: "São Paulo - SP",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=500",
    rating: 4.8,
    reviewCount: 182,
    price: 180,
    attendanceMode: "Teleatendimento",
    proximityKm: 4,
    bio: "Psicóloga clínica com foco em ansiedade e saúde emocional.",
    education: ["USP - Psicologia", "Especialização em Terapia Cognitivo-Comportamental"],
    detailedCurriculum:
      "Atuação clínica há mais de 10 anos em TCC e manejo de crises de ansiedade. Experiência em grupos de habilidades sociais e orientação a famílias. Publicações em revistas nacionais de psicologia da saúde.",
    reviews: [
      { id: "d1r1", author: "Patrícia M.", rating: 5, comment: "Muito acolhedora e profissional.", date: "02/2026" },
      { id: "d1r2", author: "Ricardo T.", rating: 5, comment: "Me ajudou a entender minha ansiedade com clareza.", date: "01/2026" },
      { id: "d1r3", author: "Luana F.", rating: 4, comment: "Consultas pontuais e ambiente tranquilo.", date: "12/2025" },
    ],
  },
  {
    id: "d2",
    name: "Dr. Carlos Silva",
    specialty: "Cardiologia",
    location: "Rio de Janeiro - RJ",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=500",
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
      { id: "d2r1", author: "Ana Souza", rating: 5, comment: "Explicação detalhada dos exames.", date: "03/2026" },
      { id: "d2r2", author: "Marcos Lima", rating: 4, comment: "Consulta objetiva e sem pressa.", date: "02/2026" },
    ],
  },
  {
    id: "d3",
    name: "Dra. Marta Lima",
    specialty: "Pediatria",
    location: "Curitiba - PR",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=500",
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
      { id: "d3r1", author: "Fernanda K.", rating: 5, comment: "Minha filha adorou a consulta.", date: "04/2026" },
      { id: "d3r2", author: "Paulo R.", rating: 5, comment: "Orientações claras sobre vacinas.", date: "03/2026" },
      { id: "d3r3", author: "Juliana P.", rating: 4, comment: "Teleconsulta muito prática.", date: "02/2026" },
    ],
  },
  {
    id: "d4",
    name: "Dr. Pedro Alves",
    specialty: "Ortopedia",
    location: "São Paulo - SP",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=500",
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
      { id: "d4r1", author: "Carlos E.", rating: 4, comment: "Bom para dor no joelho após corrida.", date: "01/2026" },
    ],
  },
];

function generateMockCalendarForMonth(doctorId: string, year: number, monthIndex: number): DayAvailability[] {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const slotsPool = ["08:00", "09:00", "10:00", "14:00", "15:00", "16:00"];
  return Array.from({ length: lastDay }, (_, i) => {
    const day = i + 1;
    const seed = (doctorId.charCodeAt(1) || 0) + day * 7 + monthIndex * 13;
    const available = seed % 5 !== 0 && seed % 7 !== 0;
    const slots = available
      ? slotsPool.filter((_, idx) => (seed + idx) % 3 !== 0).slice(0, Math.min(4, 2 + (seed % 3)))
      : [];
    return { day, status: available && slots.length > 0 ? "available" : "full", slots };
  });
}

let pendingReviews: PendingReview[] = [
  {
    id: "r1",
    doctorId: "d1",
    doctorName: "Dra. Flávia Montes",
    specialty: "Psicologia",
    doctorImage: doctors[0].image,
    date: "10/05/2026",
    time: "15:45",
  },
];

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
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400",
  },
  medical: {
    queixaPrincipal:
      "Cefaleia tensional há cerca de 3 semanas, predominantemente em região occipital, com intensidade moderada (5–7/10), piorando ao final do dia e melhorando com repouso em alguns episódios.",
    hda:
      "Início gradual após período de estresse laboral e sono irregular. Episódios quase diários, duração de 2 a 4 horas. Náuseas leves ocasionais, sem fotofobia intensa ou déficit neurológico relatado. Não há trauma craniano recente.",
    hppHf:
      "HAS materna (controlada). Nega DM ou dislipidemia diagnosticados. Nega cirurgias de grande porte. Alergia leve a dipirona (urticária).",
    habitos:
      "Sono 5–6h/noite em média. Café 3x/dia. Sedentarismo leve no trabalho; caminhada leve 2–3x/semana. Tabagismo negado. Etilismo social ocasional.",
    medicamentos: "Uso eventual de dipirona (com cautela devido à alergia); ocasionalmente ibuprofeno 400 mg.",
    alergias: "Dipirona — reação cutânea leve (urticária) em uso prévio.",
    cirurgiasPrevias: "Apendicectomia laparoscópica aos 18 anos, sem intercorrências.",
    vacinacao: "Esquema vacinal do adulto em dia conforme cartão (influenza anual).",
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
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
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
  { id: "f1", patientName: "Ana Souza", rating: 5, comment: "Atendimento excelente, muito atencioso.", createdAt: "Hoje" },
  { id: "f2", patientName: "Marcos Lima", rating: 4, comment: "Consulta objetiva e clara.", createdAt: "Ontem" },
];

const professionalHistory: ProfessionalHistoryItem[] = [
  { id: "ph1", patientName: "Maribel Beltrano", date: "08/05/2026", specialty: "Cardiologia" },
  { id: "ph2", patientName: "João Viana", date: "06/05/2026", specialty: "Cardiologia" },
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
  await wait();
  return doctors;
};

export const searchDoctors = async (filters: SearchFilters): Promise<Doctor[]> => {
  await wait();
  return doctors.filter((doctor) => {
    const bySpecialty = !filters.specialty || doctor.specialty === filters.specialty;
    const byLocation = !filters.location || doctor.location === filters.location;
    const byRating = !filters.minRating || doctor.rating >= filters.minRating;
    const byPrice =
      !filters.priceRange ||
      filters.priceRange === "all" ||
      (filters.priceRange === "low" && doctor.price <= 180) ||
      (filters.priceRange === "mid" && doctor.price > 180 && doctor.price <= 230) ||
      (filters.priceRange === "high" && doctor.price > 230);
    const byProximity =
      !filters.proximity ||
      filters.proximity === "all" ||
      doctor.proximityKm <= Number(filters.proximity);

    return bySpecialty && byLocation && byPrice && byRating && byProximity;
  });
};

export const fetchDoctorCalendar = async (doctorId: string, monthKey?: string): Promise<DayAvailability[]> => {
  await wait(280);
  const now = new Date();
  const key =
    monthKey ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [y, mo] = key.split("-").map(Number);
  if (!y || !mo) {
    return generateMockCalendarForMonth(doctorId, now.getFullYear(), now.getMonth());
  }
  return generateMockCalendarForMonth(doctorId, y, mo - 1);
};

export const fetchNotifications = async (role: UserRole): Promise<NotificationItem[]> => {
  await wait(350);

  if (role === "paciente") {
    return [
      {
        id: "n-p1",
        title: "Consulta amanhã às 10:00",
        description: "Lembrete: Dr. Carlos Silva",
        timestamp: "Há 2h",
        href: "/paciente/dashboard#consultas-agendadas",
      },
      {
        id: "n-p2",
        title: "Avaliação pendente",
        description: "Avalie sua última consulta para liberar novos agendamentos.",
        timestamp: "Hoje",
        href: "/paciente/dashboard?acao=avaliar#avaliacoes-pendentes",
      },
    ];
  }

  return [
    {
      id: "n-d1",
      title: "Novo agendamento",
      description: "Paciente Ana Souza agendou para sexta-feira às 14:00.",
      timestamp: "Há 1h",
      href: "/profissional/dashboard#tarefas-dia",
    },
    {
      id: "n-d2",
      title: "Nova avaliação recebida",
      description: "Nota 5: \"Ótimo atendimento\"",
      timestamp: "Hoje",
      href: "/profissional/dashboard#feedbacks",
    },
  ];
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

export const fetchPatientDashboardData = async (): Promise<PatientDashboardData> => {
  await wait();
  return {
    pendingReviews,
    recentHistory: patientHistory,
    scheduledAppointments,
  };
};

export const submitPendingReview = async (payload: SubmitReviewPayload): Promise<void> => {
  await wait();
  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("A nota deve estar entre 1 e 5 estrelas.");
  }
  pendingReviews = pendingReviews.filter((item) => item.id !== payload.reviewId);
};

export const fetchProfessionalDashboardData = async (): Promise<ProfessionalDashboardData> => {
  await wait();
  return {
    tasks: [
      { id: "t1", time: "09:00", patientName: "Ana Souza", type: "Teleconsulta" },
      { id: "t2", time: "14:00", patientName: "Maribel Beltrano", type: "Presencial" },
      { id: "t3", time: "16:30", patientName: "José Luiz", type: "Retorno" },
    ],
    metrics: [
      { label: "Consultas no mês", value: "42" },
      { label: "Taxa de comparecimento", value: "91%" },
      { label: "Avaliação média", value: "4.8" },
    ],
    feedbacks: professionalFeedbacks,
    history: professionalHistory,
  };
};

export const fetchPatientProfile = async (): Promise<PatientProfileData> => {
  await wait(450);
  return patientProfile;
};

export const updatePatientProfile = async (payload: {
  personal?: Partial<PatientProfileData["personal"]>;
  medical?: Partial<PatientProfileData["medical"]>;
}): Promise<PatientProfileData> => {
  await wait(450);
  if (payload.personal) {
    patientProfile.personal = { ...patientProfile.personal, ...payload.personal };
  }
  if (payload.medical) {
    patientProfile.medical = { ...patientProfile.medical, ...payload.medical };
  }
  return patientProfile;
};

export const fetchProfessionalProfile = async (): Promise<ProfessionalProfileData> => {
  await wait(450);
  return professionalProfile;
};

export const updateProfessionalProfile = async (payload: {
  personal?: Partial<ProfessionalProfileData["personal"]>;
  curriculum?: Partial<ProfessionalProfileData["curriculum"]>;
}): Promise<ProfessionalProfileData> => {
  await wait(450);
  if (payload.personal) {
    professionalProfile.personal = { ...professionalProfile.personal, ...payload.personal };
  }
  if (payload.curriculum) {
    professionalProfile.curriculum = { ...professionalProfile.curriculum, ...payload.curriculum };
  }
  return professionalProfile;
};

export const fetchAnamneseDefaults = async (): Promise<PatientMedicalProfile> => {
  await wait(400);
  return patientProfile.medical;
};

export const updateAnamneseAndProfile = async (
  data: Pick<PatientMedicalProfile, "queixaPrincipal" | "hda" | "hppHf" | "habitos">,
): Promise<void> => {
  await wait(500);
  patientProfile.medical = { ...patientProfile.medical, ...data };
};

export const createAppointment = async (): Promise<void> => {
  await wait(500);
  if (pendingReviews.length > 0) {
    throw new Error("Você possui avaliação pendente e não pode agendar novas consultas.");
  }
};

export const registerPatient = async (_payload: RegisterPatientPayload): Promise<void> => {
  void _payload;
  await wait(700);
};

export const registerProfessional = async (_payload: RegisterProfessionalPayload): Promise<void> => {
  void _payload;
  await wait(700);
};

export const mockLogin = async (data: LoginData): Promise<{ token: string; user: AuthUser }> => {
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

export const fetchAvailabilityByMonth = async (monthKey: string): Promise<DayAvailability[]> => {
  await wait(350);
  return availabilityByMonth[monthKey] ?? [];
};

export const saveAvailability = async (payload: AvailabilityPayload): Promise<void> => {
  await wait(500);
  const [yStr, mStr] = payload.monthKey.split("-");
  const y = Number(yStr);
  const m0 = Number(mStr) - 1;
  const slotDate = new Date(y, m0, payload.day);
  slotDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (slotDate < today) {
    throw new Error("Não é possível cadastrar disponibilidade em dia anterior a hoje.");
  }

  if (!availabilityByMonth[payload.monthKey]) {
    availabilityByMonth[payload.monthKey] = [];
  }

  const monthData = availabilityByMonth[payload.monthKey];
  const dayIndex = monthData.findIndex((item) => item.day === payload.day);
  const itemToSave: DayAvailability = {
    day: payload.day,
    status: "available",
    slots: [...(dayIndex >= 0 ? monthData[dayIndex].slots : []), `${payload.time} - R$ ${payload.price} (${payload.mode})`],
  };

  if (dayIndex >= 0) {
    monthData[dayIndex] = itemToSave;
  } else {
    monthData.push(itemToSave);
  }
};