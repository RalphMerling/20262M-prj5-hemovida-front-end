"use client";

import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Suspense } from "react";

// ======================================================
// INÍCIO - MS2 ESTOQUE
// Integração com os componentes compartilhados da Bia
// ======================================================

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import { ButtonLink } from "@/components/ui/Button";

// FIM - MS2 ESTOQUE

// TIPOS DE DADOS
type Status = "Disponível" | "Em uso" | "Vencida";

type Movimento = {
  data: string;
  descricao: string;
  transacao: string;
  responsavel: string;
};

type Bolsa = {
  id: string;
  tipo: string;
  volume: number;
  coleta: string;
  entrada: string;
  validade: string;
  status: Status;
  historico: Movimento[];
};

// TIPOS SANGUÍNEOS
const tiposSanguineos = [
  "O+",
  "A+",
  "B+",
  "O-",
  "AB+",
  "A-",
  "B-",
  "AB-",
];

// ======================================================
// MS2 ESTOQUE
// Usuário temporário até a integração da autenticação
// ======================================================

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

// FORMATAR DATA
function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// BUSCAR BOLSA SIMULADA
function buscarBolsa(id: string): Bolsa | null {
  const numero = Number(id.replace("BOL-", ""));

  if (
    !/^BOL-\d{3}$/.test(id) ||
    numero < 1 ||
    numero > 46
  ) {
    return null;
  }

  const entrada = new Date(
    Date.UTC(2026, 9, numero)
  );

  const coleta = new Date(entrada);
  coleta.setUTCDate(coleta.getUTCDate() - 1);

  const validade = new Date(entrada);
  validade.setUTCDate(validade.getUTCDate() + 42);

  const hoje = new Date();

  const hojeUTC = Date.UTC(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );

  let status: Status = "Disponível";

  if (validade.getTime() < hojeUTC) {
    status = "Vencida";
  } else if (numero % 6 === 0) {
    status = "Em uso";
  }

  const dataEntrada = entrada.toISOString().slice(0, 10);
  const dataColeta = coleta.toISOString().slice(0, 10);
  const dataValidade = validade.toISOString().slice(0, 10);

  // HISTÓRICO SIMULADO
  const historico: Movimento[] = [
    {
      data: dataEntrada,
      descricao: "Entrada no estoque",
      transacao: `TR-${String(numero).padStart(3, "0")}`,
      responsavel: "Maria da Silva",
    },
  ];

  if (status === "Disponível") {
    historico.push({
      data: dataEntrada,
      descricao: "Liberação para uso",
      transacao: "—",
      responsavel: "Joaquim Ramos",
    });
  }

  return {
    id,
    tipo: tiposSanguineos[(numero - 1) % 8],
    volume: 450,
    coleta: dataColeta,
    entrada: dataEntrada,
    validade: dataValidade,
    status,
    historico,
  };
}

// CAMPO DE CONSULTA
function CampoConsulta({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div>
      <p className="mb-3 block text-xl font-semibold text-preto">
        {titulo}
      </p>

      <div className="min-h-10 rounded-md border border-gray-300 bg-card px-4 py-2 text-base font-medium text-preto">
        {valor}
      </div>
    </div>
  );
}


// ======================================================
// MS2 ESTOQUE
// Detalhes da bolsa utilizando o novo Design System
// Mantidos os dados, o histórico e a navegação original
// ======================================================

function DetalhesBolsa() {
  const id = useSearchParams().get("id") ?? "";

  const bolsa = buscarBolsa(id);

  if (!bolsa) {
    notFound();
  }

  // CORES DOS STATUS
  const corStatus =
    bolsa.status === "Disponível"
      ? "bg-[#C0DFDC]"
      : bolsa.status === "Em uso"
        ? "bg-[#CCDEF4]"
        : "bg-[#F9D4D8]";

  return (
    <div className="flex min-h-screen bg-cinza-azulado">

      {/* ========================================
          MS2 ESTOQUE
          Novo Sidebar compartilhado da Bia
          ======================================== */}
      <Sidebar
        itens={MENU_ESTOQUE}
        usuario={usuarioEstoque}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex min-w-0 flex-1 flex-col px-12 py-12">

        {/* TÍTULO E SETA VOLTAR */}
        <div className="mb-10 flex items-center gap-5">
          <Link
            href="/estoque/consulta"
            aria-label="Voltar para a lista de estoque"
            className="text-4xl text-preto hover:text-azul-1"
          >
            ←
          </Link>

          <h1 className="text-2xl font-bold text-azul-1">
            Consulta de item de estoque
          </h1>
        </div>

        {/* STATUS DA BOLSA */}
        <div className="mb-12 flex justify-end">
          <span
            className={`rounded-full px-7 py-2 text-sm font-semibold text-azul-1 ${corStatus}`}
          >
            {bolsa.status}
          </span>
        </div>

        {/* DADOS DA BOLSA */}
        <section className="grid grid-cols-3 gap-x-16 gap-y-16 px-2">

          <CampoConsulta
            titulo="ID da bolsa"
            valor={bolsa.id}
          />

          <CampoConsulta
            titulo="Tipo sanguíneo"
            valor={bolsa.tipo}
          />

          <CampoConsulta
            titulo="Volume (mL)"
            valor={String(bolsa.volume)}
          />

          <CampoConsulta
            titulo="Data da coleta"
            valor={formatarData(bolsa.coleta)}
          />

          <CampoConsulta
            titulo="Data de validade"
            valor={formatarData(bolsa.validade)}
          />

          <CampoConsulta
            titulo="Entrada no estoque"
            valor={formatarData(bolsa.entrada)}
          />

        </section>

        {/* HISTÓRICO DE MOVIMENTAÇÕES */}
        <section className="mt-24 px-2">

          <h2 className="mb-8 text-xl font-bold text-preto">
            Histórico de movimentações
          </h2>

          <div className="overflow-x-auto bg-card">
            <table className="w-full border-collapse text-center text-sm">

              {/* CABEÇALHO */}
              <thead className="bg-[#D1E1F1] text-azul-1">
                <tr>
                  <th className="px-4 py-3">
                    Data
                  </th>

                  <th className="px-4 py-3">
                    Movimentação
                  </th>

                  <th className="px-4 py-3">
                    Transação
                  </th>

                  <th className="px-4 py-3">
                    Responsável
                  </th>
                </tr>
              </thead>

              {/* REGISTROS */}
              <tbody>
                {bolsa.historico.map((movimento, index) => (
                  <tr
                    key={index}
                    className="h-16 border-b border-gray-100 text-preto"
                  >
                    <td className="px-4 font-medium">
                      {formatarData(movimento.data)}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.descricao}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.transacao}
                    </td>

                    <td className="px-4 font-medium">
                      {movimento.responsavel}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================
            MS2 ESTOQUE
            Botão Voltar padronizado da Bia
            Destino: Lista de Consulta do Estoque
            ======================================== */}
        <div className="mt-auto flex justify-end pt-20">
          <ButtonLink
            href="/estoque/consulta"
            variante="voltar"
            tamanho="md"
            className="min-w-32"
          >
            Voltar
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}


// O Suspense é obrigatório quando a página lê o "?id=" (useSearchParams).
export default function DetalhesBolsaPage() {
  return (
    <Suspense fallback={null}>
      <DetalhesBolsa />
    </Suspense>
  );
}
