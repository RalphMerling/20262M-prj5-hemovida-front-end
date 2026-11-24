"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatarCpf, formatarDataBR } from "@/lib/formatadores";
import { calcularIdade } from "@/lib/regras";
import type { Doador } from "@/models/doador";

// Não tem nada para "assinar": a idade só muda de um dia para o outro.
const assinar = () => () => {};

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <p>
      <span className="font-bold">{rotulo}:</span> {children}
    </p>
  );
}

interface CabecalhoPacienteProps {
  doador: Pick<Doador, "doador_nome" | "doador_cpf" | "doador_data_nascimento" | "doador_tipo_sanguineo" | "doador_fator_rh">;
  destaque?: ReactNode;
  mostrarTipoSanguineo?: boolean;
  className?: string;
}

// Cartão do topo da Triagem e da Doação: quem é o doador que está sendo atendido.
export function CabecalhoPaciente({ doador, destaque, mostrarTipoSanguineo = false, className = "" }: CabecalhoPacienteProps) {
  // A idade depende da data de hoje: useSyncExternalStore lê isso no navegador (no servidor fica vazio).
  const idade = useSyncExternalStore(assinar, () => calcularIdade(doador.doador_data_nascimento), () => null);

  // O tipo sanguíneo pode ainda não ter sido informado (a recepção preenche depois).
  const sangueInformado = doador.doador_tipo_sanguineo !== null && doador.doador_fator_rh !== null;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-6">
        <div className="space-y-2">
          <Linha rotulo="Doador">{doador.doador_nome}</Linha>
          <Linha rotulo="CPF">{formatarCpf(doador.doador_cpf)}</Linha>
          <Linha rotulo="Data de nascimento">
            {formatarDataBR(doador.doador_data_nascimento)}
            {idade !== null && ` (${idade} anos)`}
          </Linha>
          {mostrarTipoSanguineo && (
            <Linha rotulo="Tipo sanguíneo">
              {sangueInformado ? (
                <Badge variante="sangue">{`${doador.doador_tipo_sanguineo}${doador.doador_fator_rh}`}</Badge>
              ) : (
                "Não informado"
              )}
            </Linha>
          )}
        </div>
        {destaque}
      </div>
    </Card>
  );
}