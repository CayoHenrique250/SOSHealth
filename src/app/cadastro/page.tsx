import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import { Stethoscope, UserCircle } from "lucide-react";

export default function CadastroSelection() {
  return (
    <main className="min-h-screen flex flex-col bg-[#f3f5f5]">
      <Header />
      
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <h1 className="text-3xl font-bold text-[#1e3e44] mb-6 leading-tight">
              Para dar início ao seu cadastro, informe se você é...
            </h1>
            
            <div className="flex gap-6">
              <Link href="/cadastro/profissional" className="group flex flex-col items-center flex-1">
                <div className="bg-[#1e3e44] p-8 rounded-2xl shadow-lg group-hover:scale-105 transition-transform w-full flex justify-center">
                  <Stethoscope className="w-20 h-20 text-white" />
                </div>
                <span className="mt-4 font-bold text-[#1e3e44] group-hover:text-[#6ba2a6]">Profissional</span>
              </Link>

              <Link href="/cadastro/paciente" className="group flex flex-col items-center flex-1">
                <div className="bg-[#6ba2a6] p-8 rounded-2xl shadow-lg group-hover:scale-105 transition-transform w-full flex justify-center">
                  <UserCircle className="w-20 h-20 text-white" />
                </div>
                <span className="mt-4 font-bold text-[#1e3e44] group-hover:text-[#1e3e44]/70">Paciente</span>
              </Link>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
             
             <div className="relative w-full max-w-sm aspect-square bg-[#6ba2a6]/20 rounded-full flex items-center justify-center">
                <div className="flex gap-2 items-end">
                    <div className="w-12 h-40 bg-[#1e3e44] rounded-t-full"></div>
                    <div className="w-12 h-52 bg-white rounded-t-full border-t-8 border-[#992E2E]"></div>
                    <div className="w-12 h-44 bg-[#1e3e44] rounded-t-full"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}