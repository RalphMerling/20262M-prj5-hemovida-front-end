"use client";

import { Activity, Check, CircleAlert, Droplet, Scale } from "lucide-react";
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  DIASTOLICA,
  PESO_MINIMO_KG,
  SISTOLICA,
  avisosDeFaixa,
  errosDePreenchimento,
  formatarHemoglobina,
  formatarPressao,
  hemoglobinaMinima,
} from "@/lib/triagem";
import type { Genero, SinaisVitais } from "@/models/triagem";

type Campo = keyof SinaisVitais;

// 13 vira "13,0" e 12.5 vira "12,5".
const umDecimal = (numero: number) => numero.toFixed(1).replace(".", ",");

interface CampoSinalProps {
  icone: ReactNode;
  label: string;
  unidade: string;
  referencia: string;
  placeholder: string;
  inputMode?: "decimal" | "numeric" | "text";
  valor: string;
  aoMudar: (valor: string) => void;
  aoSair: () => void;
  mensagem?: string;
  ok: boolean;
}

function CampoSinal({ icone, label, unidade, referencia, placeholder, inputMode, valor, aoMudar, aoSair, mensagem, ok }: CampoSinalProps) {
  const id = useId();
  const idAjuda = `${id}-ajuda`;

  return (
    <div
      className={`rounded-2xl border p-5 transition ${
        mensagem ? "border-vermelho-1/50" : ok ? "border-green-600/40" : "border-preto/10"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-azul-3/40 text-azul-1">{icone}</span>
        {mensagem ? (
          <CircleAlert size={22} aria-hidden className="text-vermelho-1" />
        ) : ok ? (
          <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-branco">
            <Check size={14} strokeWidth={3} />
          </span>
        ) : null}
      </div>

      <label htmlFor={id} className="mb-2 block font-bold text-azul-1">
        {label}
      </label>

      <div className="flex items-baseline gap-2 border-b-2 border-preto/15 pb-1 transition focus-within:border-azul-2">
        <input
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          onBlur={aoSair}
          aria-invalid={mensagem ? true : undefined}
          aria-describedby={idAjuda}
          className="w-full min-w-0 bg-transparent font-titulo text-3xl outline-none placeholder:text-preto/25"
        />
        <span className="shrink-0 text-sm text-preto/60">{unidade}</span>
      </div>

      <p
        id={idAjuda}
        role={mensagem ? "alert" : undefined}
        className={`mt-3 text-sm ${mensagem ? "text-vermelho-1" : "text-preto/60"}`}
      >
        {mensagem ?? referencia}
      </p>
    </div>
  );
}

interface PassoSinaisVitaisProps {
  sinais: SinaisVitais;
  genero: Genero;
  aoMudar: (sinais: SinaisVitais) => void;
  aoProximo: () => void;
}

// Passo 1 da triagem: o enfermeiro digita peso, pressão e hemoglobina.
// A referência de cada sinal fica junto do próprio campo.
export function PassoSinaisVitais({ sinais, genero, aoMudar, aoProximo }: PassoSinaisVitaisProps) {
  const [tocados, setTocados] = useState<Campo[]>([]); // campos que a pessoa já preencheu e saiu
  const [tentouAvancar, setTentouAvancar] = useState(false);

  const erros = errosDePreenchimento(sinais);
  const avisos = avisosDeFaixa(sinais, genero);

  function mudar(campo: Campo, valor: string) {
    aoMudar({ ...sinais, [campo]: valor });
  }

  function sair(campo: Campo) {
    setTocados((atual) => (atual.includes(campo) ? atual : [...atual, campo]));
  }

  function mensagem(campo: Campo): string | undefined {
    if (tentouAvancar && erros[campo]) return erros[campo];
    return tocados.includes(campo) ? avisos[campo] : undefined;
  }

  const dentroDaReferencia = (campo: Campo) => sinais[campo].trim() !== "" && !erros[campo] && !avisos[campo];

  function avancar() {
    if (Object.keys(erros).length > 0) {
      setTentouAvancar(true);
      return;
    }
    aoProximo();
  }

  return (
    <Card>
      <h2 className="text-2xl text-azul-1">Sinais vitais</h2>
      <p className="mb-6 mt-1 text-preto/60">Preencha as medições do doador. A referência aparece embaixo de cada campo.</p>

      <div className="grid gap-5 md:grid-cols-3">
        <CampoSinal
          icone={<Scale size={20} />}
          label="Peso"
          unidade="kg"
          placeholder="57"
          inputMode="decimal"
          referencia={`Mínimo ${PESO_MINIMO_KG} kg`}
          valor={sinais.peso}
          aoMudar={(valor) => mudar("peso", valor)}
          aoSair={() => sair("peso")}
          mensagem={mensagem("peso")}
          ok={dentroDaReferencia("peso")}
        />
        <CampoSinal
          icone={<Activity size={20} />}
          label="Pressão arterial"
          unidade="mmHg"
          placeholder="120/80"
          inputMode="numeric"
          referencia={`Sistólica ${SISTOLICA.min} a ${SISTOLICA.max} · Diastólica ${DIASTOLICA.min} a ${DIASTOLICA.max}`}
          valor={sinais.pressao}
          aoMudar={(valor) => mudar("pressao", formatarPressao(valor))}
          aoSair={() => sair("pressao")}
          mensagem={mensagem("pressao")}
          ok={dentroDaReferencia("pressao")}
        />
        <CampoSinal
          icone={<Droplet size={20} />}
          label="Hemoglobina"
          unidade="g/dL"
          placeholder="13,5"
          inputMode="numeric"
          referencia={`Mínimo ${umDecimal(hemoglobinaMinima(genero))} g/dL`}
          valor={sinais.hemoglobina}
          aoMudar={(valor) => mudar("hemoglobina", formatarHemoglobina(valor))}
          aoSair={() => sair("hemoglobina")}
          mensagem={mensagem("hemoglobina")}
          ok={dentroDaReferencia("hemoglobina")}
        />
      </div>

      <div className="mt-8 flex justify-end border-t border-preto/10 pt-6">
        <Button onClick={avancar}>Próximo</Button>
      </div>
    </Card>
  );
}