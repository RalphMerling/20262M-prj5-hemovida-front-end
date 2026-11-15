"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { EditarDoadorModal } from "@/components/doador/EditarDoadorModal";
import type { DadosEditaveis } from "@/components/doador/EditarDoadorModal";
import { FichaDoador } from "@/components/doador/FichaDoador";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import type { Doador } from "@/models/doador";

interface PerfilDoadorProps {
  doador: Doador;
  ultimaDoacao: string | null;
}

// Tela "Meu perfil": o doador vê seus dados e pode editar.
export function PerfilDoador({ doador: doadorInicial, ultimaDoacao }: PerfilDoadorProps) {
  const [doador, setDoador] = useState(doadorInicial);
  const [editando, setEditando] = useState(false);
  const [salvou, setSalvou] = useState(false);

  function salvarEdicao(dados: DadosEditaveis) {
    // TODO: doadoresService.atualizar(id, dados) quando a API estiver conectada.
    setDoador((atual) => ({ ...atual, ...dados }));
    setEditando(false);
    setSalvou(true);
  }

  return (
    <div className="space-y-4">
      <Link href="/doador" className="inline-flex items-center gap-1.5 text-sm font-semibold text-vermelho-1">
        <ArrowLeft size={16} aria-hidden />
        Voltar ao portal
      </Link>

      <h1 className="text-3xl text-preto">Meu perfil</h1>

      {salvou && <Alert tipo="sucesso">Seus dados foram atualizados.</Alert>}

      <FichaDoador
        doador={doador}
        ultimaDoacao={ultimaDoacao}
        acoes={
          <Button variante="voltar" tamanho="sm" onClick={() => setEditando(true)}>
            Editar dados
          </Button>
        }
      />

      {editando && <EditarDoadorModal doador={doador} aoSalvar={salvarEdicao} aoFechar={() => setEditando(false)} />}
    </div>
  );
}