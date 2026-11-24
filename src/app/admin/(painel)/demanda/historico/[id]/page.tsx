// Detalhes de UM pedido. O [id] da pasta vira o número que vem no endereço:
// /admin/demanda/historico/3  ->  id = "3"
export default async function DetalhePedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-azul-1">Pedido #{id}</h1>
      {/* TODO: buscar o pedido nos dados de mentira e mostrar os detalhes */}
    </div>
  );
}
