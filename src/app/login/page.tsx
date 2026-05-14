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

        <div className="flex h-96 w-96 flex-shrink-0 scale-90 items-center justify-center rounded-full bg-[#6ba2a6] p-10 shadow-inner md:-mr-16 md:scale-100">
          <div className="flex items-end gap-3">
            <div className="mx-1 h-48 w-16 rounded-full bg-[#1e3e44] opacity-90" />
            <div className="mx-1 h-64 w-16 rounded-full border-t-8 border-[#992E2E] bg-white shadow-lg" />
            <div className="mx-1 h-72 w-16 rounded-full bg-white shadow-lg" />
            <div className="mx-1 h-64 w-16 rounded-full border-t-8 border-[#992E2E] bg-white shadow-lg" />
            <div className="mx-1 h-52 w-16 rounded-full bg-[#1e3e44] opacity-90" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
