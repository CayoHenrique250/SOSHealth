import Header from "@/src/components/Header";
import SearchForm from "@/src/components/SearchForm";
import DoctorCarousel from "@/src/components/DoctorCarousel";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="px-6 md:px-16 py-12 md:py-20 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8" aria-label="Hero do SOSHealth">
        <div className="max-w-md">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1e3e44] leading-tight mb-4">
            Sua saúde,
            <br />
            nossa prioridade
          </h1>
        </div>

        <div className="bg-[#6ba2a6] rounded-t-full px-8 pt-8 pb-0 w-full max-w-lg flex justify-center items-end overflow-hidden shadow-inner h-64">
          <div className="flex gap-2 items-end">
            <div className="w-12 h-40 bg-[#1e3e44] rounded-t-lg opacity-90 mx-1"></div>
            <div className="w-12 h-48 bg-white rounded-t-lg shadow mx-1"></div>
            <div className="w-12 h-52 bg-white rounded-t-lg shadow mx-1 border-t-4 border-[#992E2E]"></div>
            <div className="w-12 h-48 bg-white rounded-t-lg shadow mx-1"></div>
            <div className="w-12 h-44 bg-[#1e3e44] rounded-t-lg opacity-90 mx-1"></div>
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

          <div className="w-full max-w-md h-64 md:h-80 rounded-[100px] overflow-hidden border-4 border-white/10 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600"
              alt="Médico com estetoscópio"
              className="w-full h-full object-cover"
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
