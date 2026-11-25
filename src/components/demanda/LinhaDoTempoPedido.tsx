import { etapas } from "./pedidoHelpers";
import type { StatusPedido } from "@/models/pedido";

// As 5 etapas do pedido. As anteriores à atual ficam verdes, a atual azul e as próximas cinza.
export function LinhaDoTempoPedido({ status }: { status: StatusPedido }) {
  const atual = etapas.findIndex((etapa) => etapa.status === status);

  return (
    <ol aria-label="Andamento do pedido" className="grid grid-cols-5">
      {etapas.map((etapa, indice) => {
        // Entregue é a última etapa: quando chega nela, ela também está concluída.
        const concluida = indice < atual || (indice === atual && status === "ENTREGUE");
        const emAndamento = indice === atual && !concluida;

        const cor = concluida
          ? "bg-green-200 text-green-900"
          : emAndamento
            ? "bg-azul-3 text-azul-1"
            : "border border-preto/20 bg-cinza-azulado text-preto/60";

        return (
          <li
            key={etapa.status}
            aria-current={emAndamento ? "step" : undefined}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {/* Traço que liga esta bolinha à próxima */}
            {indice < etapas.length - 1 && (
              <span aria-hidden="true" className="absolute left-1/2 top-3 h-px w-full bg-preto/30" />
            )}
            <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${cor}`}>
              {indice + 1}
            </span>
            <span className="text-xs text-preto/70">{etapa.rotulo}</span>
            <span className="sr-only">{concluida ? "concluída" : emAndamento ? "em andamento" : "pendente"}</span>
          </li>
        );
      })}
    </ol>
  );
}
