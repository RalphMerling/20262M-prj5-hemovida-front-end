import type { ReactNode } from "react";

const tons = {
  sangue: "bg-vermelho-1 text-branco",
  sucesso: "border border-green-600 bg-green-50 text-green-800",
  erro: "border border-vermelho-1 bg-vermelho-1/10 text-vermelho-2",
};

interface CaixaDestaqueProps {
  rotulo: string; // o texto pequeno em cima. Ex.: "Tipo sanguíneo"
  children: ReactNode; // a informação grande. Ex.: "A+"
  tom?: keyof typeof tons;
  tamanho?: "grande" | "medio";
}

// Caixa colorida para chamar atenção para UMA informação importante (tipo sanguíneo, aptidão).
export function CaixaDestaque({ rotulo, children, tom = "sangue", tamanho = "grande" }: CaixaDestaqueProps) {
  return (
    <div className={`flex min-w-44 flex-col items-center justify-center gap-1 rounded-xl px-6 py-4 text-center ${tons[tom]}`}>
      <span className="text-sm">{rotulo}</span>
      <span className={`flex items-center gap-2 font-titulo font-semibold ${tamanho === "grande" ? "text-4xl" : "text-xl"}`}>
        {children}
      </span>
    </div>
  );
}