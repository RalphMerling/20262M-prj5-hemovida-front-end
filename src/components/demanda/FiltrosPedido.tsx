"use client";

interface Filtro<T extends string> {
  id: T;
  rotulo: string;
}

interface FiltrosPedidoProps<T extends string> {
  filtros: Filtro<T>[];
  ativo: T;
  aoMudar: (id: T) => void;
}

// Botões em formato de pílula (Todos / Regulares / ...). Só um fica ativo por vez.
// O Tabs do ui é de abas de texto sublinhado, por isso este é separado.
export function FiltrosPedido<T extends string>({ filtros, ativo, aoMudar }: FiltrosPedidoProps<T>) {
  return (
    <div role="group" aria-label="Filtrar pedidos" className="flex flex-wrap gap-2">
      {filtros.map((filtro) => {
        const selecionado = filtro.id === ativo;
        return (
          <button
            key={filtro.id}
            type="button"
            aria-pressed={selecionado}
            onClick={() => aoMudar(filtro.id)}
            className={`cursor-pointer rounded-lg border px-4 py-1.5 text-sm font-semibold transition ${
              selecionado
                ? "border-azul-2 bg-azul-2 text-branco"
                : "border-preto/20 bg-cinza-azulado text-preto hover:bg-azul-3/40"
            }`}
          >
            {filtro.rotulo}
          </button>
        );
      })}
    </div>
  );
}
