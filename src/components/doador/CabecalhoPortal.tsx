"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, LogOut, User } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { ListaAvisos } from "@/components/doador/ListaAvisos";
import type { Aviso } from "@/models/portal";

export function CabecalhoPortal({ avisos }: { avisos: Aviso[] }) {
  const [avisosAbertos, setAvisosAbertos] = useState(false);
  const areaDoSino = useRef<HTMLDivElement>(null);
  const naoLidos = avisos.filter((aviso) => !aviso.lida).length;

  useEffect(() => {
    if (!avisosAbertos) return;

    const aoClicarFora = (evento: MouseEvent) => {
      if (areaDoSino.current && !areaDoSino.current.contains(evento.target as Node)) {
        setAvisosAbertos(false);
      }
    };
    const aoApertarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") setAvisosAbertos(false);
    };

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoApertarTecla);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, [avisosAbertos]);

  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
      <Logo />

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Meu perfil"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-preto text-branco"
        >
          <User size={18} />
        </button>

        <div ref={areaDoSino} className="relative">
          <button
            type="button"
            aria-label={`Avisos, ${naoLidos} não lidos`}
            aria-haspopup="true"
            aria-expanded={avisosAbertos}
            onClick={() => setAvisosAbertos((aberto) => !aberto)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-preto text-branco"
          >
            <Bell size={18} />
            {naoLidos > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-vermelho-1 px-1 text-[11px] font-semibold">
                {naoLidos}
              </span>
            )}
          </button>

          {avisosAbertos && (
            <div className="absolute right-0 top-12 z-30 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-preto/10 bg-card shadow-lg">
              <h2 className="border-b border-preto/10 px-4 py-3 text-base">Avisos</h2>
              <div className="max-h-96 overflow-y-auto">
                <ListaAvisos avisos={avisos} />
              </div>
            </div>
          )}
        </div>

        <Link href="/doador/login" className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-vermelho-1">
          Sair
          <LogOut size={16} aria-hidden />
        </Link>
      </div>
    </header>
  );
}