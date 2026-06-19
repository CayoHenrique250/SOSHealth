import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function CadastroSelection() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="flex-1 flex flex-col items-center justify-center overflow-x-clip px-6 py-12">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#1e3e44] mb-6 leading-tight">
              Para dar início ao seu cadastro, informe se você é...
            </h1>

            <div className="flex gap-6">
              <Link
                href="/cadastro/profissional"
                className="group flex flex-col items-center flex-1"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#2D545E] p-3 shadow-lg transition-transform group-hover:scale-105 sm:h-64">
                  <Image
                    src="/images/profissional.png"
                    alt="Ilustração de médico com jaleco segurando um raio-X"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 768px) 42vw, 240px"
                  />
                </div>
                <span className="mt-4 font-bold text-[#1e3e44] group-hover:text-[#6ba2a6]">
                  Profissional
                </span>
              </Link>

              <Link
                href="/cadastro/paciente"
                className="group flex flex-col items-center flex-1"
              >
                <div className="relative h-56 w-full overflow-hidden rounded-2xl bg-[#6ba2a6] p-3 shadow-lg transition-transform group-hover:scale-105 sm:h-64">
                  <Image
                    src="/images/paciente.png"
                    alt="Ilustração de paciente com membro superior imobilizado"
                    fill
                    className="object-contain object-bottom"
                    sizes="(max-width: 768px) 42vw, 240px"
                  />
                </div>
                <span className="mt-4 font-bold text-[#1e3e44] group-hover:text-[#1e3e44]/70">
                  Paciente
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden min-w-0 md:flex w-full justify-end md:mr-[min(-1.5rem,calc((64rem-100vw)/2))]">
            <div className="relative aspect-4/3 w-full max-w-lg translate-x-4 overflow-hidden rounded-2xl sm:translate-x-6 md:max-w-xl md:translate-x-8 lg:max-w-2xl lg:translate-x-12">
              <Image
                src="/images/médicos-e-pacientes.png"
                alt="Médico e paciente em consulta: acolhimento e explicação de exame"
                fill
                className="object-contain object-right"
                sizes="(max-width: 1024px) 50vw, 480px"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
