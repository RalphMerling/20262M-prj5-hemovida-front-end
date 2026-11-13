import { Check } from "lucide-react";

interface StepperProps {
  passos: string[]; // os nomes, na ordem. Ex.: ["Sinais vitais", "Questionário", "Resultado"]
  atual: number; // qual passo está em andamento (começa em 1)
}

// Barra de passos da triagem. É só visual: não dá para clicar e pular um passo.
export function Stepper({ passos, atual }: StepperProps) {
  return (
    <ol className="flex items-start">
      {passos.map((nome, i) => {
        const numero = i + 1;
        const feito = numero < atual;
        const emAndamento = numero === atual;
        const ultimo = i === passos.length - 1;

        return (
          <li key={nome} aria-current={emAndamento ? "step" : undefined} className="flex flex-1 items-start last:flex-none">
            <div className="flex items-start gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  emAndamento ? "bg-azul-2 text-branco" : feito ? "bg-azul-3 text-azul-1" : "bg-preto/10 text-preto/50"
                }`}
              >
                {feito ? <Check size={16} /> : numero}
              </span>
              <div>
                <p className={`font-semibold ${emAndamento || feito ? "text-azul-1" : "text-preto/50"}`}>{nome}</p>
                <p className="text-sm text-preto/60">{feito ? "Finalizado" : emAndamento ? "Em andamento" : "Aguardando"}</p>
              </div>
            </div>

            {/* A linha entre um passo e o próximo. Fica azul quando o passo já foi feito. */}
            {!ultimo && <span aria-hidden className={`mx-4 mt-4 h-px flex-1 ${feito ? "bg-azul-2" : "bg-preto/15"}`} />}
          </li>
        );
      })}
    </ol>
  );
}