"use client";

interface Aba<T extends string> {
  id: T;
  rotulo: string;
}

interface TabsProps<T extends string> {
  abas: Aba<T>[];
  ativa: T;
  aoMudar: (id: T) => void;
}

// Abas de texto (Aguardando triagem / Coletas concluídas). A página guarda qual está ativa.
export function Tabs<T extends string>({ abas, ativa, aoMudar }: TabsProps<T>) {
  return (
    <div role="tablist" className="flex gap-6">
      {abas.map((aba) => {
        const ativo = aba.id === ativa;
        return (
          <button
            key={aba.id}
            role="tab"
            aria-selected={ativo}
            onClick={() => aoMudar(aba.id)}
            className={`cursor-pointer border-b-2 pb-1 font-titulo text-lg font-semibold transition ${
              ativo ? "border-azul-3 text-azul-2" : "border-transparent text-preto/50 hover:text-azul-1"
            }`}
          >
            {aba.rotulo}
          </button>
        );
      })}
    </div>
  );
}