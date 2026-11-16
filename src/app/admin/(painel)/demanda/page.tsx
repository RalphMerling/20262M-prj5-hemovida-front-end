import Link from "next/link";

// Tela principal da Demanda: o gestor escolhe o que quer fazer.
export default function Demanda() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-azul-1">Pedidos de sangue</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/admin/demanda/emergencial" className="rounded-lg bg-card p-6">
          Fazer pedido emergencial
        </Link>
        <Link href="/admin/demanda/regular" className="rounded-lg bg-card p-6">
          Fazer pedido regular
        </Link>
        <Link href="/admin/demanda/historico" className="rounded-lg bg-card p-6">
          Histórico de pedidos
        </Link>
      </div>
    </div>
  );
}
