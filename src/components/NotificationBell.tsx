"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchNotifications, type NotificationItem, type UserRole } from "@/src/services/api";
import { toast } from "react-toastify";

interface NotificationBellProps {
  role: UserRole;
}

export default function NotificationBell({ role }: NotificationBellProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications(role)
      .then(setNotifications)
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Falha ao carregar notificações.");
      });
  }, [role]);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", listener);
    return () => window.removeEventListener("click", listener);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full p-2 text-[#1e3e44] transition hover:bg-white/60"
        aria-label="Abrir notificações"
      >
        <Bell className="h-5 w-5" />
        {notifications.length > 0 ? (
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-600" aria-hidden="true" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <p className="mb-2 text-sm font-semibold text-slate-800">Notificações</p>
          {notifications.length > 0 ? (
            <ul className="space-y-2">
              {notifications.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full cursor-pointer rounded-lg border border-slate-100 p-2 text-left transition hover:border-[#1e3e44]/30 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e3e44]"
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                        setOpen(false);
                      }
                    }}
                  >
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-600">{item.description}</p>
                    <p className="mt-1 text-[11px] text-slate-400">{item.timestamp}</p>
                    {item.href ? <p className="mt-1 text-[11px] font-semibold text-[#1e3e44]">Toque para abrir</p> : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Sem notificações no momento.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
