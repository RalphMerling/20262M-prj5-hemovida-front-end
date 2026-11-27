"use client";

import { useState } from "react";
import { FiltrosPedido } from "@/components/demanda/FiltrosPedido";
import { TabelaPedidos } from "@/components/demanda/TabelaPedidos";
import { usePedidos } from "@/components/demanda/usePedidos";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";

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

  // A API não filtra: a tela busca todos os pedidos e filtra/ordena aqui.
  const { pedidos: todos, carregando, erro } = usePedidos();

  const porTipo = todos.filter((p) => {
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
        {erro && <Alert tipo="erro">{erro}</Alert>}
        {/* Com muitos pedidos, a lista rola dentro do cartão. */}
        {carregando ? (
          <p className="text-sm text-preto/70">Carregando pedidos...</p>
        ) : (
          !erro && (
            <div className="max-h-[60vh] overflow-y-auto">
              <TabelaPedidos pedidos={pedidos} comDetalhes />
            </div>
          )
        )}
      </Card>
    </div>
  );
}
