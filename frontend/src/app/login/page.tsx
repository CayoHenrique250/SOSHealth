import Image from "next/image";
import Header from "@/src/components/Header";
import LoginForm from "@/src/components/LoginForm";
import Footer from "@/src/components/Footer";

export default function Login() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />

      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-12 px-6 py-12 md:flex-row md:px-16 md:py-20">
        <div className="flex max-w-md flex-col items-center gap-6 md:items-start">
          <h1 className="mb-4 text-center text-3xl font-bold leading-tight text-[#1e3e44] md:text-left md:text-5xl">
            Entre e marque
            <br />
            agora sua consulta!
          </h1>

          <LoginForm />
        </div>

        <div className="relative h-96 w-96 shrink-0 scale-90 overflow-hidden rounded-full  shadow-inner md:-mr-16 md:scale-100 md:shadow-lg">
          <Image
            src="/images/médicos-e-pacientes.png"
            alt="Médico e paciente em consulta: acolhimento e explicação de exame"
            fill
            className="object-contain"
            sizes="384px"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
