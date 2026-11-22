
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button, ButtonLink } from "@/components/ui/Button";

// ======================================================
// MS2 - ESTOQUE
// Tipos das transações
// ======================================================

type TipoTransacao =
  | "Entrada por doação"
  | "Saída para Hospital"
  | "Saída por descarte";

type StatusTransacao =
  | "Entregue"
  | "Pendente"
  | "Cancelada";

type Transacao = {
  id: string;
  data: string;
  tipo: TipoTransacao;
  bolsa: string;
  tipoSanguineo: string;
  status: StatusTransacao;
};

type FiltroTipo = "Todas" | TipoTransacao;

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

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

const ITENS_POR_PAGINA = 8;

// ======================================================
// MS2 - ESTOQUE
// Dados simulados das transações
// Mantidos 42 registros para demonstração.
// ======================================================

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

// ======================================================
// MS2 - ESTOQUE
// Formatação de datas
// ======================================================

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function obterDataHoje(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(
    2,
    "0"
  );
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// ======================================================
// MS2 - ESTOQUE
// NOVO: identificar mês atual
// ======================================================

function obterMesAtual(): string {
  return obterDataHoje().slice(0, 7);
}

function formatarMes(mes: string): string {
  const [ano, numeroMes] = mes.split("-").map(Number);

  const nomesMeses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  return `${nomesMeses[numeroMes - 1]} de ${ano}`;
}

function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    return false;
  }

  const [ano, mes, dia] = valor.split("-").map(Number);

  const data = new Date(Date.UTC(ano, mes - 1, dia));

  return (
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia
  );
}

// ======================================================
// MS2 - ESTOQUE
// Cor dos status
// ======================================================

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
// MS2 - ESTOQUE
// Tela de Transações
// ======================================================

export default function TransacoesPage() {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Filtro por data específica.
  const [dataSelecionada, setDataSelecionada] =
    useState("");

  // ====================================================
  // MS2 - ESTOQUE
  // NOVO: filtro por tipo de transação
  // ====================================================

  const [tipoSelecionado, setTipoSelecionado] =
    useState<FiltroTipo>("Todas");

  // ====================================================
  // MS2 - ESTOQUE
  // NOVO: filtro de mês recebido pelo Dashboard
  // ====================================================

  const [mesSelecionado, setMesSelecionado] =
    useState("");

  // ====================================================
  // MS2 - ESTOQUE
  // Ler parâmetros enviados pelo Dashboard
  //
  // ?data=hoje
  //
  // ?tipo=entrada-doacao&periodo=mes-atual
  // ====================================================

  useEffect(() => {
    const parametros = new URLSearchParams(
      window.location.search
    );

    const dataURL = parametros.get("data");
    const tipoURL = parametros.get("tipo");
    const periodoURL = parametros.get("periodo");

    // FILTRO POR DATA
    if (dataURL === "hoje") {
      setDataSelecionada(obterDataHoje());
    } else if (dataURL && dataValida(dataURL)) {
      setDataSelecionada(dataURL);
    } else {
      setDataSelecionada("");
    }

    // FILTRO POR TIPO
    if (tipoURL === "entrada-doacao") {
      setTipoSelecionado("Entrada por doação");
    } else if (tipoURL === "saida-descarte") {
      setTipoSelecionado("Saída por descarte");
    } else if (tipoURL === "saida-hospital") {
      setTipoSelecionado("Saída para Hospital");
    } else {
      setTipoSelecionado("Todas");
    }

    // FILTRO POR MÊS
    if (periodoURL === "mes-atual") {
      setMesSelecionado(obterMesAtual());
    } else {
      setMesSelecionado("");
    }

    setPaginaAtual(1);
  }, []);

  // ====================================================
  // MS2 - ESTOQUE
  // Pesquisa combinada:
  // texto + tipo + data + mês
  // ====================================================

  const transacoesFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return transacoes.filter((transacao) => {
      // FILTRO POR TIPO
      const atendeTipo =
        tipoSelecionado === "Todas" ||
        transacao.tipo === tipoSelecionado;

      if (!atendeTipo) {
        return false;
      }

      // FILTRO POR DATA ESPECÍFICA
      const atendeData =
        !dataSelecionada ||
        transacao.data === dataSelecionada;

      if (!atendeData) {
        return false;
      }

      // NOVO: FILTRO PELO MÊS
      const atendeMes =
        !mesSelecionado ||
        transacao.data.slice(0, 7) === mesSelecionado;

      if (!atendeMes) {
        return false;
      }

      // FILTRO POR TEXTO
      if (!termo) {
        return true;
      }

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
  }, [
    busca,
    dataSelecionada,
    tipoSelecionado,
    mesSelecionado,
  ]);

  // ====================================================
  // MS2 - ESTOQUE
  // Paginação
  // ====================================================

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

  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  function atualizarTipo(valor: FiltroTipo) {
    setTipoSelecionado(valor);
    setPaginaAtual(1);
  }

  function atualizarData(valor: string) {
    setDataSelecionada(valor);

    // Uma data manual substitui o filtro de mês.
    if (valor) {
      setMesSelecionado("");
    }

    setPaginaAtual(1);
  }

  // ====================================================
  // MS2 - ESTOQUE
  // NOVO: limpar os filtros recebidos do Dashboard
  // ====================================================

  function limparFiltros() {
    setBusca("");
    setDataSelecionada("");
    setTipoSelecionado("Todas");
    setMesSelecionado("");
    setPaginaAtual(1);

    // Remove os parâmetros da URL.
    const url = new URL(window.location.href);

    url.searchParams.delete("data");
    url.searchParams.delete("tipo");
    url.searchParams.delete("periodo");

    window.history.replaceState(
      null,
      "",
      url.pathname + url.search + url.hash
    );
  }

  const existemFiltros =
    Boolean(busca.trim()) ||
    Boolean(dataSelecionada) ||
    Boolean(mesSelecionado) ||
    tipoSelecionado !== "Todas";

  return (
    <div className="flex min-h-screen bg-cinza-azulado">
      {/* SIDEBAR COMPARTILHADO */}
      <Sidebar
        itens={MENU_ESTOQUE}
        usuario={usuarioEstoque}
      />

      <main className="min-w-0 flex-1 px-10 py-12">
        {/* PESQUISA */}
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

        {/* TÍTULO E BOTÕES */}
        <div className="mb-10 flex items-center justify-between gap-5">
          <h1 className="text-2xl font-bold text-azul-1">
            Transações
          </h1>

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

        {/* ==========================================
            MS2 - ESTOQUE
            NOVO: FILTROS DA CONSULTA
            ========================================== */}
        <div className="mb-8 flex flex-wrap items-end gap-4">
          {/* TIPO DE TRANSAÇÃO */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="filtro-tipo-transacao"
              className="text-sm font-semibold text-azul-1"
            >
              Tipo de transação
            </label>

            <select
              id="filtro-tipo-transacao"
              value={tipoSelecionado}
              onChange={(evento) =>
                atualizarTipo(
                  evento.target.value as FiltroTipo
                )
              }
              className="h-11 min-w-52 rounded-md border border-gray-300 bg-card px-3 text-sm text-preto"
            >
              <option value="Todas">
                Todas
              </option>

              <option value="Entrada por doação">
                Entrada por doação
              </option>

              <option value="Saída por descarte">
                Saída por descarte
              </option>

              <option value="Saída para Hospital">
                Saída para Hospital
              </option>
            </select>
          </div>

          {/* DATA ESPECÍFICA */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="filtro-data-transacoes"
              className="text-sm font-semibold text-azul-1"
            >
              Data da transação
            </label>

            <input
              id="filtro-data-transacoes"
              type="date"
              value={dataSelecionada}
              onChange={(evento) =>
                atualizarData(evento.target.value)
              }
              className="h-11 rounded-md border border-gray-300 bg-card px-4 text-sm text-preto"
            />
          </div>

          {/* NOVO: MÊS ATUAL */}
          {mesSelecionado && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-azul-1">
                Período selecionado
              </span>

              <div className="flex h-11 items-center rounded-md border border-[#E8D09E] bg-[#FFF0D4] px-4 text-sm font-medium text-azul-1">
                {formatarMes(mesSelecionado)}
              </div>
            </div>
          )}

          {/* LIMPAR FILTROS */}
          {existemFiltros && (
            <Button
              type="button"
              variante="voltar"
              tamanho="sm"
              className="h-11 px-5 text-sm"
              onClick={limparFiltros}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        {/* ==========================================
            MS2 - ESTOQUE
            NOVO: RESUMO DOS RESULTADOS
            ========================================== */}
        {existemFiltros && (
          <p
            className="mb-6 text-sm font-medium text-azul-1"
            role="status"
          >
            {transacoesFiltradas.length} transação(ões)
            encontrada(s)
            {tipoSelecionado !== "Todas"
              ? ` — ${tipoSelecionado}`
              : ""}
            {mesSelecionado
              ? ` — ${formatarMes(mesSelecionado)}`
              : ""}
            {dataSelecionada
              ? ` — ${formatarData(dataSelecionada)}`
              : ""}
          </p>
        )}

        {/* TABELA DE TRANSAÇÕES */}
        <div className="overflow-x-auto bg-card">
          <table className="w-full border-collapse text-center text-sm">
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

            <tbody>
              {transacoesPagina.map((transacao) => (
                <tr
                  key={transacao.id}
                  className="h-[66px] border-b border-gray-100 text-preto hover:bg-gray-50"
                >
                  <td className="px-3 font-semibold">
                    {transacao.id}
                  </td>

                  <td className="px-3">
                    {formatarData(transacao.data)}
                  </td>

                  <td className="px-3 font-medium">
                    {transacao.tipo}
                  </td>

                  <td className="px-3 font-medium">
                    {transacao.bolsa}
                  </td>

                  <td className="px-3 font-semibold">
                    {transacao.tipoSanguineo}
                  </td>

                  <td className="px-3">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-azul-1 ${corStatus(
                        transacao.status
                      )}`}
                    >
                      {transacao.status}
                    </span>
                  </td>

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

              {transacoesPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma transação encontrada para
                    os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">
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
                onClick={() => setPaginaAtual(pagina)}
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

        {/* BOTÃO VOLTAR */}
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
