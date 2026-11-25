import { FormularioPedido } from "@/components/demanda/FormularioPedido";

// Pedido regular: /admin/demanda/regular
export default function PedidoRegular() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-azul-1">Nova Solicitação Regular</h1>
      <FormularioPedido tipo="REGULAR" />
    </div>
  );
}
