import { FormularioPedido } from "@/components/demanda/FormularioPedido";

// Pedido emergencial: /admin/demanda/emergencial
export default function PedidoEmergencial() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-azul-1">Nova Solicitação Emergencial</h1>

      <p
        role="note"
        className="rounded-md border-l-4 border-vermelho-1 bg-vermelho-1/10 px-4 py-3 text-sm text-vermelho-2"
      >
        Pedidos emergenciais são priorizados imediatamente pela central de distribuição. Use este fluxo apenas para
        situações de real urgência clínica.
      </p>

      <FormularioPedido tipo="EMERGENCIAL" />
    </div>
  );
}
