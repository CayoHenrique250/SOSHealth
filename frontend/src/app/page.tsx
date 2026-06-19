import Image from "next/image";
import Header from "@/src/components/Header";
import SearchForm from "@/src/components/SearchForm";
import DoctorCarousel from "@/src/components/DoctorCarousel";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section
        className="w-full overflow-x-clip py-12 md:py-20"
        aria-label="Hero do SOSHealth"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-stretch gap-8 px-6 md:flex-row md:items-center md:gap-10 md:pl-16 md:pr-0">
          <div className="max-w-md shrink-0">
            <h1 className="text-4xl md:text-6xl font-bold text-[#1e3e44] leading-tight mb-4">
              Sua saúde,
              <br />
              nossa prioridade
            </h1>
          </div>

          <div
            className="relative ml-auto h-64 w-full max-w-lg min-w-0 self-end overflow-hidden rounded-l-[3.5rem] bg-[#72AAB0] shadow-lg md:h-70 md:max-w-none md:flex-1 md:self-stretch md:rounded-l-[5.5rem] md:shadow-xl lg:h-116 lg:rounded-l-[7.5rem] mr-[min(0px,calc((80rem-100vw)/2))]"
          >
            <Image
              src="/images/profissionais.png"
              alt="Ilustração de equipe de profissionais de saúde com jalecos e estetoscópios"
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-[#1e3e44] text-white py-16 px-6 md:px-16 w-full" aria-label="Sobre a plataforma">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold mb-6">O que é o SOSHealth?</h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed text-justify">
              O SOSHealth é uma plataforma digital desenvolvida com o objetivo
              de facilitar o acesso da população aos serviços de saúde,
              conectando pacientes a profissionais de diversas especialidades de
              forma rápida, prática e centralizada. A proposta do sistema é
              eliminar barreiras comuns, como filas, burocracia e dificuldades
              de agendamento, promovendo uma experiência eficiente e acessível.
            </p>
          </div>

          <div className="relative w-full max-w-md h-64 md:h-80 rounded-[100px] overflow-hidden border-4 border-white/10 shadow-xl">
            <Image
              src="/images/medico-com-esteto.jpg"
              alt="Médico com jaleco branco, braços cruzados e estetoscópio em fundo claro"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        </div>
      </section>

      <DoctorCarousel />

      <SearchForm />

      <Footer />
    </main>
  );
}
