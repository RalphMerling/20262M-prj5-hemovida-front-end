"use client";

import { CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Card } from "@/components/ui/Card";
import type { Genero } from "@/models/doador";
import { imagem } from "@/lib/imagem";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

// Reavisa o React a cada 30 segundos, para a hora do banner não ficar parada.
function assinar(aoMudar: () => void) {
  const intervalo = setInterval(aoMudar, 30_000);
  return () => clearInterval(intervalo);
}

function dataEHoraAgora(): string {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, "0");
  const data = `${dia} ${MESES[agora.getMonth()]}, ${agora.getFullYear()}`;
  const hora = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${data}|${hora}`;
}

interface BannerObrigadoProps {
  nome: string;
  genero: Genero;
}

export function BannerObrigado({ nome, genero }: BannerObrigadoProps) {
  const agora = useSyncExternalStore(assinar, dataEHoraAgora, () => "");
  const [data = "", hora = ""] = agora.split("|");

  const primeiroNome = nome.split(" ")[0];
  const agradecimento = genero === "Feminino" ? "Obrigada" : "Obrigado";

  return (
    <Card className="relative min-h-60 overflow-hidden">
      <div className="relative z-10 sm:max-w-[65%]">
        <div
          className={`mb-6 inline-flex items-center gap-4 rounded-lg bg-preto/5 px-4 py-2 text-sm font-semibold text-vermelho-2 ${
            agora ? "" : "invisible"
          }`}
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={18} aria-hidden />
            {data}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={18} aria-hidden />
            {hora}
          </span>
        </div>

        <h1 className="text-2xl text-preto xl:text-3xl">
          {agradecimento} por salvar vidas, {primeiroNome}!
        </h1>
        <p className="mt-4 text-preto/80">
          Cada gota conta uma história. Acompanhe seu impacto e prepare-se para seu próximo agendamento.
        </p>
      </div>

    <div aria-hidden className="pointer-events-none absolute bottom-0 right-6 hidden h-[78%] w-44 sm:block">
        <Image src={imagem("/img/mao-bolsa-sangue.png")} alt="" fill sizes="176px" className="object-contain object-bottom" />
    </div>
    </Card>
  );
}