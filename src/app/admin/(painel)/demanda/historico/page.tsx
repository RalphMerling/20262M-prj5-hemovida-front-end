"use client";

import { useState } from "react";
import { FiltrosPedido } from "@/components/demanda/FiltrosPedido";
import { TabelaPedidos } from "@/components/demanda/TabelaPedidos";
import { Card } from "@/components/ui/Card";
import { pedidosMock } from "@/data/mock";

type Filtro = "todos" | "regulares" | "emergenciais" | "antigos";

const filtros: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "regulares", rotulo: "Regulares" },
  { id: "emergenciais", rotulo: "Emergenciais" },
  { id: "antigos", rotulo: "Mais antigos" },
];

// Histórico de pedidos: /admin/demanda/historico
// Por padrão mostra os mais recentes primeiro. "Mais antigos" inverte a ordem.
export default function HistoricoPedidos() {
  const [filtro, setFiltro] = useState<Filtro>("todos");

  // TODO: trocar o mock pela API: pedidosService.listar(). O filtro pode virar parâmetro da busca.
  const porTipo = pedidosMock.filter((p) => {
    if (filtro === "regulares") return p.tipo === "REGULAR";
    if (filtro === "emergenciais") return p.tipo === "EMERGENCIAL";
    return true;
  });

  const pedidos = [...porTipo].sort((a, b) =>
    filtro === "antigos" ? a.criadoEm.localeCompare(b.criadoEm) : b.criadoEm.localeCompare(a.criadoEm),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl text-azul-1">Histórico</h1>

      <Card className="flex flex-col gap-4">
        <FiltrosPedido filtros={filtros} ativo={filtro} aoMudar={setFiltro} />
        {/* Com muitos pedidos, a lista rola dentro do cartão. */}
        <div className="max-h-[60vh] overflow-y-auto">
          <TabelaPedidos pedidos={pedidos} comDetalhes />
        </div>
      </Card>
    </div>
  );
}
