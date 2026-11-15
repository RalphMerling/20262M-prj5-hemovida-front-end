"use client";

import { Check } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Card } from "@/components/ui/Card";
import { formatarDataBR } from "@/lib/formatadores";
import { diasParaProximaDoacao, intervaloEmDias } from "@/lib/regras";
import type { Genero } from "@/models/doador";

const assinar = () => () => {};

const RAIO = 52;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO;

function dataLiberada(ultimaDoacao: string, intervalo: number): string {
  const [ano, mes, dia] = ultimaDoacao.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia + intervalo);
  const mm = String(data.getMonth() + 1).padStart(2, "0");
  const dd = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mm}-${dd}`;
}

interface ContagemRegressivaProps {
  genero: Genero; // o intervalo muda: 60 dias para homens e 90 para mulheres
  ultimaDoacao: string;
}

export function ContagemRegressiva({ genero, ultimaDoacao }: ContagemRegressivaProps) {
  const intervalo = intervaloEmDias(genero);

  const dias = useSyncExternalStore(assinar, () => diasParaProximaDoacao(genero, ultimaDoacao), () => null);

  const progresso = dias === null ? 0 : Math.min(1, Math.max(0, (intervalo - dias) / intervalo));
  const jaPodeDoar = dias === 0;

  return (
    <Card className="flex min-h-60 flex-col items-center justify-between text-center">
      <h2 className="text-xl text-azul-1">{jaPodeDoar ? "Você já pode doar!" : "Próxima doação em"}</h2>

      <div className="relative my-4 h-32 w-32">
        <svg viewBox="0 0 120 120" aria-hidden className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={RAIO} fill="none" strokeWidth="10" className="stroke-vermelho-1/20" />
          <circle
            cx="60"
            cy="60"
            r={RAIO}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUNFERENCIA * progresso} ${CIRCUNFERENCIA}`}
            className="stroke-vermelho-2"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {jaPodeDoar ? (
            <Check size={44} strokeWidth={3} className="text-green-600" aria-hidden />
          ) : (
            <>
              <span className="font-titulo text-3xl font-semibold">{dias ?? "--"}</span>
              <span className="text-sm text-preto/60">{dias === 1 ? "Dia" : "Dias"}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-sm">
        A partir de: <span className="font-bold">{formatarDataBR(dataLiberada(ultimaDoacao, intervalo))}</span>
      </p>
    </Card>
  );
}