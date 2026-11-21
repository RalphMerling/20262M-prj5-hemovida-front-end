
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

// ======================================================
// INÍCIO - MS2 ESTOQUE
// Integração com os componentes compartilhados da Bia
// ======================================================

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Button,
  ButtonLink,
} from "@/components/ui/Button";

// FIM - MS2 ESTOQUE

// TIPOS DE TRANSAÇÃO DO HISTÓRICO
// Saídas hospitalares são criadas pelo fluxo de Solicitações.
type TipoTransacao =
  | "Entrada por doação"
  | "Saída para Hospital"
  | "Saída por descarte";

// STATUS DA TRANSAÇÃO
type StatusTransacao =
  | "Entregue"
  | "Pendente"
  | "Cancelada";

// ESTRUTURA DE UMA TRANSAÇÃO
type Transacao = {
  id: string;
  data: string;
  tipo: TipoTransacao;
  bolsa: string;
  tipoSanguineo: string;
  status: StatusTransacao;
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

// DADOS SIMULADOS: 42 TRANSAÇÕES
// Mantidos conforme a versão anterior do MS2 Estoque.
const transacoes: Transacao[] = Array.from(
  { length: 42 },
  (_, indice) => {
    const numero = indice + 1;

    const data = new Date(
      Date.UTC(2026, 9, numero)
    );

    let tipo: TipoTransacao;

    if (numero % 3 === 1) {
      tipo = "Saída para Hospital";
    } else if (numero % 3 === 2) {
      tipo = "Entrada por doação";
    } else {
      tipo = "Saída por descarte";
    }

    let status: StatusTransacao = "Entregue";

    if (numero % 9 === 0) {
      status = "Cancelada";
    } else if (numero % 4 === 0) {
      status = "Pendente";
    }

    return {
      id: `TR-${String(numero).padStart(3, "0")}`,
      data: data.toISOString().slice(0, 10),
      tipo,
      bolsa: `BOL-${String(numero).padStart(3, "0")}`,
      tipoSanguineo:
        tiposSanguineos[indice % tiposSanguineos.length],
      status,
    };
  }
);

// CONFIGURAÇÃO DA PAGINAÇÃO
const ITENS_POR_PAGINA = 8;

// ======================================================
// MS2 ESTOQUE
// Usuário provisório até a integração da autenticação
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

// CORES DOS STATUS
function corStatus(status: StatusTransacao): string {
  switch (status) {
    case "Entregue":
      return "bg-[#D0EEE8]";

    case "Pendente":
      return "bg-[#FFF0D4]";

    case "Cancelada":
      return "bg-[#F9D4D8]";
  }
}

// ======================================================
// MS2 ESTOQUE
// Lista de transações adaptada ao Design System da Bia.
// Mantidas pesquisa, tabela, paginação e navegação.
// ======================================================

export default function TransacoesPage() {
  // ESTADOS DA PESQUISA E PAGINAÇÃO
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // FILTRAR TRANSAÇÕES
  const transacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return transacoes;
    }

    return transacoes.filter((transacao) => {
      return (
        transacao.id.toLowerCase().includes(termo) ||
        transacao.tipo.toLowerCase().includes(termo) ||
        transacao.bolsa.toLowerCase().includes(termo) ||
        transacao.tipoSanguineo
          .toLowerCase()
          .includes(termo) ||
        transacao.status.toLowerCase().includes(termo) ||
        formatarData(transacao.data).includes(termo) ||
        transacao.data.includes(termo)
      );
    });
  }, [busca]);

  // PAGINAÇÃO
  const totalPaginas = Math.max(
    1,
    Math.ceil(
      transacoesFiltradas.length / ITENS_POR_PAGINA
    )
  );

  const inicio =
    (paginaAtual - 1) * ITENS_POR_PAGINA;

  const transacoesPagina = transacoesFiltradas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA
  );

  // ATUALIZAR PESQUISA
  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

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
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* BARRA DE PESQUISA */}
        <form
          role="search"
          onSubmit={(evento) => evento.preventDefault()}
          className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-card"
        >
          <input
            type="search"
            placeholder="Buscar transação"
            aria-label="Buscar transação"
            value={busca}
            onChange={(evento) =>
              atualizarBusca(evento.target.value)
            }
            className="w-full px-4 py-3 text-preto outline-none placeholder:text-preto/50"
          />

          {/* MS2 ESTOQUE: BUTTON DA BIA */}
          <Button
            type="submit"
            variante="suave"
            tamanho="sm"
            aria-label="Pesquisar transações"
            className="rounded-none border-l border-gray-300 px-5"
          >
            <Search size={22} aria-hidden="true" />
          </Button>
        </form>

        {/* TÍTULO E AÇÕES */}
        <div className="mb-10 flex items-center justify-between gap-5">

          <h1 className="text-2xl font-bold text-azul-1">
            Transações
          </h1>

          {/* ========================================
              MS2 ESTOQUE
              Botões padronizados com ButtonLink da Bia
              Ordem mantida: Nova transação, Solicitações
              ======================================== */}
          <div className="flex items-center gap-4">

            <ButtonLink
              href="/estoque/transacoes/nova"
              variante="secundario"
              tamanho="sm"
              className="h-11 px-5 text-sm"
            >
              + Nova transação
            </ButtonLink>

            <ButtonLink
              href="/estoque/solicitacoes"
              variante="suave"
              tamanho="sm"
              className="h-11 px-6 text-sm"
            >
              Solicitações
            </ButtonLink>
          </div>
        </div>

        {/* TABELA DE TRANSAÇÕES */}
        <div className="overflow-x-auto bg-card">
          <table className="w-full border-collapse text-center text-sm">

            {/* CABEÇALHO */}
            <thead className="bg-[#D1E1F1] text-azul-1">
              <tr>
                <th className="px-3 py-3">
                  ID da Transação
                </th>

                <th className="px-3 py-3">
                  Data
                </th>

                <th className="px-3 py-3">
                  Tipo de Transação
                </th>

                <th className="px-3 py-3">
                  ID da Bolsa
                </th>

                <th className="px-3 py-3">
                  Tipo Sanguíneo
                </th>

                <th className="px-3 py-3">
                  Status
                </th>

                <th className="px-3 py-3">
                  Detalhes
                </th>
              </tr>
            </thead>

            {/* REGISTROS */}
            <tbody>
              {transacoesPagina.map((transacao) => (
                <tr
                  key={transacao.id}
                  className="h-[66px] border-b border-gray-100 text-preto hover:bg-gray-50"
                >
                  {/* ID */}
                  <td className="px-3 font-semibold">
                    {transacao.id}
                  </td>

                  {/* DATA */}
                  <td className="px-3">
                    {formatarData(transacao.data)}
                  </td>

                  {/* TIPO */}
                  <td className="px-3 font-medium">
                    {transacao.tipo}
                  </td>

                  {/* BOLSA */}
                  <td className="px-3 font-medium">
                    {transacao.bolsa}
                  </td>

                  {/* TIPO SANGUÍNEO */}
                  <td className="px-3 font-semibold">
                    {transacao.tipoSanguineo}
                  </td>

                  {/* STATUS */}
                  <td className="px-3">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-azul-1 ${corStatus(
                        transacao.status
                      )}`}
                    >
                      {transacao.status}
                    </span>
                  </td>

                  {/* DETALHES */}
                  <td className="px-3">
                    <Link
                      href={`/estoque/transacoes/${transacao.id}`}
                      aria-label={`Detalhes da transação ${transacao.id}`}
                      title={`Consultar ${transacao.id}`}
                      className="inline-flex rounded p-2 text-azul-1 hover:bg-azul-3/30"
                    >
                      <Search
                        size={23}
                        aria-hidden="true"
                      />
                    </Link>
                  </td>
                </tr>
              ))}

              {/* SEM RESULTADOS */}
              {transacoesPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">

          {/* CONTROLES DE PAGINAÇÃO */}
          <div className="flex items-center gap-3">

            {/* ANTERIOR */}
            <Button
              type="button"
              variante="suave"
              tamanho="sm"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.max(1, pagina - 1)
                )
              }
              disabled={paginaAtual === 1}
              aria-label="Página anterior"
              className="min-w-8 !px-2 !py-1 text-base"
            >
              ‹
            </Button>

            {/* NÚMEROS DAS PÁGINAS */}
            {Array.from(
              { length: totalPaginas },
              (_, indice) => indice + 1
            ).map((pagina) => (
              <Button
                key={pagina}
                type="button"
                variante={
                  paginaAtual === pagina
                    ? "secundario"
                    : "suave"
                }
                tamanho="sm"
                onClick={() =>
                  setPaginaAtual(pagina)
                }
                aria-label={`Página ${pagina}`}
                aria-current={
                  paginaAtual === pagina
                    ? "page"
                    : undefined
                }
                className="min-w-8 !px-2 !py-1"
              >
                {pagina}
              </Button>
            ))}

            {/* PRÓXIMA */}
            <Button
              type="button"
              variante="suave"
              tamanho="sm"
              onClick={() =>
                setPaginaAtual((pagina) =>
                  Math.min(totalPaginas, pagina + 1)
                )
              }
              disabled={paginaAtual === totalPaginas}
              aria-label="Próxima página"
              className="min-w-8 !px-2 !py-1 text-base"
            >
              ›
            </Button>
          </div>

          {/* CONTADOR */}
          <p className="text-sm font-semibold text-preto">
            {transacoesFiltradas.length === 0
              ? 0
              : inicio + 1}
            {" - "}
            {Math.min(
              inicio + ITENS_POR_PAGINA,
              transacoesFiltradas.length
            )}
            {" de "}
            {transacoesFiltradas.length} transações
          </p>
        </div>

        {/* ========================================
            MS2 ESTOQUE
            Botão Voltar padronizado da Bia
            Destino: Dashboard do Estoque
            ======================================== */}
        <div className="mt-14 flex justify-end">
          <ButtonLink
            href="/estoque"
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
