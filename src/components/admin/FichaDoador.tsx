import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatarCpf, formatarDataBR, formatarTelefone } from "@/lib/formatadores";
import type { Doador } from "@/models/doador";

interface FichaDoadorProps {
  doador: Doador;
  ultimaDoacao: string | null; // AAAA-MM-DD, ou null se nunca doou
  acoes: ReactNode;
  className?: string;
}

// Cartão com todos os dados do doador (a "ficha" que a recepção confere).
export function FichaDoador({ doador, ultimaDoacao, acoes, className = "" }: FichaDoadorProps) {
  const campos: { rotulo: string; valor: ReactNode }[] = [
    { rotulo: "Nome completo", valor: doador.doador_nome },
    {
      rotulo: "Status",
      valor: <Badge variante={doador.doador_status === 1 ? "sucesso" : "erro"}>{doador.doador_status === 1 ? "Ativo" : "Inativo"}</Badge>,
    },
    {
      rotulo: "Tipo sanguíneo",
      valor: <Badge variante="sangue">{`${doador.doador_tipo_sanguineo}${doador.doador_fator_rh}`}</Badge>,
    },
    { rotulo: "CPF", valor: formatarCpf(doador.doador_cpf) },
    { rotulo: "Última doação", valor: ultimaDoacao ? formatarDataBR(ultimaDoacao) : "Nenhuma" },
    { rotulo: "Gênero", valor: doador.doador_genero },
    { rotulo: "Data de nascimento", valor: formatarDataBR(doador.doador_data_nascimento) },
    { rotulo: "E-mail", valor: doador.doador_email },
    { rotulo: "Endereço", valor: doador.doador_endereco },
    { rotulo: "Telefone", valor: formatarTelefone(doador.doador_telefone) },
  ];

  return (
    <Card className={className}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-5">
        {campos.map((campo) => (
          <div key={campo.rotulo} className="min-w-0 text-center">
            <dt className="rounded bg-azul-3/30 px-2 py-2 text-sm font-bold text-azul-1">{campo.rotulo}</dt>
            <dd className="break-words px-1 pt-3 text-sm">{campo.valor}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex justify-end gap-2">{acoes}</div>
    </Card>
  );
}