"use client";

import { Activity, Calendar, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useState } from "react";
import NotificationBell from "@/src/components/NotificationBell";

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const isDoc = user?.role === "profissional";
  const dashboardLink = user ? (isDoc ? "/profissional/dashboard" : "/paciente/dashboard") : "/";
  const profileLink = user ? (isDoc ? "/profissional/perfil" : "/paciente/perfil") : "/login";

  return (
    <header className="relative z-50 w-full border-b border-gray-200 bg-[#f3f5f5] px-6 py-4 md:px-16">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-[#992E2E]">
          <Activity className="h-8 w-8 stroke-[2.5]" />
          <span className="font-light text-gray-800">
            <strong className="font-bold text-[#992E2E]">SOS</strong>Health
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3 md:gap-5">
            <nav aria-label="Navegação principal" className="hidden items-center gap-6 text-sm font-semibold text-[#1e3e44] md:flex">
              <Link href={dashboardLink} className="flex items-center gap-1 transition hover:text-[#6ba2a6]">
                <LayoutDashboard className="h-4 w-4" /> Início
              </Link>
              {isDoc && (
                <Link href="/profissional/disponibilidade" className="flex items-center gap-1 transition hover:text-[#6ba2a6]">
                  <Calendar className="h-4 w-4" /> Disponibilidade
                </Link>
              )}
            </nav>

            <NotificationBell role={user.role} />

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[#6ba2a6] bg-[#1e3e44] font-bold text-white transition focus:ring-2 focus:ring-[#1e3e44]"
                title={user.name}
                aria-label="Abrir menu de perfil"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                  <p className="px-4 py-2 text-xs text-gray-400 border-b border-gray-50 truncate font-medium">{user.name}</p>
                  <Link
                    href={profileLink}
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    <User className="w-4 h-4 text-[#6ba2a6]" /> Meu Perfil
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      logout();
                    }}
                    className="hidden w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 md:flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-1 text-[#1e3e44] transition hover:text-[#6ba2a6] md:hidden"
              aria-label="Menu Mobile"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm font-medium text-[#1e3e44]">
            <Link href="/cadastro" className="hover:underline">Cadastrar</Link>
            <Link href="/login" className="hover:underline font-bold">Entrar</Link>
          </div>
        )}
      </div>

      {user && mobileMenuOpen && (
        <div className="absolute top-full left-0 z-40 flex w-full flex-col gap-3 border-b border-gray-200 bg-white px-6 py-4 shadow-lg md:hidden">
          <Link href={dashboardLink} onClick={() => setMobileMenuOpen(false)} className="block border-b border-gray-50 py-1 text-base font-semibold text-[#1e3e44]">
            Início
          </Link>
          {isDoc && (
            <Link href="/profissional/disponibilidade" onClick={() => setMobileMenuOpen(false)} className="block border-b border-gray-50 py-1 text-base font-semibold text-[#1e3e44]">
              Disponibilidade
            </Link>
          )}
          <Link href={profileLink} onClick={() => setMobileMenuOpen(false)} className="block border-b border-gray-50 py-1 text-base font-semibold text-[#6ba2a6]">
            Meu Perfil
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="flex w-full items-center gap-2 border-t border-gray-100 pt-3 text-left text-base font-semibold text-red-600"
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden />
            Sair
          </button>
        </div>
      )}
    </header>
  );
}