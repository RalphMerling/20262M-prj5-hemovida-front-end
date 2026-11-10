
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// DADOS SIMULADOS DAS BOLSAS
type Bolsa = {
  id: string;
  tipo: string;
  entrada: string;
  validade: string;
  status: "Disponível" | "Em uso" | "Vencida";
  volume: number;
};

const tipos = [
  "O+", "A+", "B+", "O-",
  "AB+", "A-", "B-", "AB-",
];

// Geramos 46 registros para testar a consulta e a paginação.
// Esses registros não representam o banco de dados real.
const bolsas: Bolsa[] = Array.from({ length: 46 }, (_, i) => {
  const numero = i + 1;

  const entrada = new Date(Date.UTC(2026, 9, 1 + i));
  const validade = new Date(entrada);

  validade.setUTCDate(validade.getUTCDate() + 42);

  const hoje = new Date();
  const dataAtual = Date.UTC(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate()
  );

  let status: Bolsa["status"] = "Disponível";

  if (validade.getTime() < dataAtual) {
    status = "Vencida";
  } else if (numero % 6 === 0) {
    status = "Em uso";
  }

  return {
    id: `BOL-${String(numero).padStart(3, "0")}`,
    tipo: tipos[i % tipos.length],
    entrada: entrada.toISOString().slice(0, 10),
    validade: validade.toISOString().slice(0, 10),
    status,
    volume: 450,
  };
});

const ITENS_POR_PAGINA = 8;

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ÍCONE DE PESQUISA
function Lupa({ tamanho = 21 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export default function ConsultaEstoquePage() {
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  // FILTRO DE PESQUISA
  const bolsasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return bolsas.filter((bolsa) => {
      return (
        bolsa.id.toLowerCase().includes(termo) ||
        bolsa.tipo.toLowerCase().includes(termo) ||
        formatarData(bolsa.validade).includes(termo) ||
        bolsa.validade.includes(termo)
      );
    });
  }, [busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(bolsasFiltradas.length / ITENS_POR_PAGINA)
  );

  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;

  const bolsasPagina = bolsasFiltradas.slice(
    inicio,
    inicio + ITENS_POR_PAGINA
  );

  function atualizarBusca(valor: string) {
    setBusca(valor);
    setPaginaAtual(1);
  }

  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">

      {/* MENU LATERAL */}
      <aside className="flex w-80 shrink-0 flex-col bg-[#F0F0F0] px-8 py-10">

        {/* LOGOTIPO */}
        <Link
          href="/"
          className="mb-20 text-3xl font-bold text-[#800000]"
        >
          HemoVida ♡
        </Link>

        {/* NAVEGAÇÃO */}
        <nav className="flex flex-col gap-5">

          <Link
            href="/estoque"
            className="rounded-lg px-5 py-3 text-xl font-semibold text-[#203A60] hover:bg-gray-200"
          >
            ⌂ &nbsp; Início
          </Link>

          <Link
            href="/estoque/consulta"
            className="rounded-lg bg-[#98D8E2] px-5 py-3 text-xl font-semibold text-[#203A60]"
          >
            ◇ &nbsp; Estoque
          </Link>

          <Link
            href="/estoque/transacoes"
            className="rounded-lg px-5 py-3 text-xl font-semibold text-[#203A60] hover:bg-gray-200"
          >
            ⇄ &nbsp; Transações
          </Link>

          <Link
            href="/estoque/relatorios"
            className="rounded-lg px-5 py-3 text-xl font-semibold text-[#203A60] hover:bg-gray-200"
          >
            ▤ &nbsp; Relatórios
          </Link>
        </nav>

        {/* SAIR */}
        <div className="mt-auto pt-16">
          <Link
            href="/"
            className="px-5 py-3 text-xl font-medium text-[#800000]"
          >
            ⏻ &nbsp; Sair
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* BARRA DE PESQUISA */}
        <div className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-white">
          <input
            type="search"
            placeholder="Buscar por tipo sanguíneo, código da bolsa ou data de validade"
            aria-label="Buscar bolsas de sangue"
            value={busca}
            onChange={(e) => atualizarBusca(e.target.value)}
            className="w-full px-4 py-3 text-gray-700 outline-none"
          />

          <button
            type="button"
            aria-label="Pesquisar"
            className="flex items-center justify-center border-l border-gray-300 bg-gray-200 px-5 text-gray-700"
          >
            <Lupa />
          </button>
        </div>

        {/* TÍTULO */}
        <h1 className="mb-10 text-2xl font-bold text-[#203A60]">
          Estoque de bolsas de Sangue
        </h1>

        {/* TABELA DE ESTOQUE */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-center text-sm">

            <thead className="bg-[#D1E1F1] text-[#203A60]">
              <tr>
                <th className="px-3 py-3">ID da Bolsa</th>
                <th className="px-3 py-3">Tipo Sanguíneo</th>
                <th className="px-3 py-3">Data da Entrada</th>
                <th className="px-3 py-3">Data de Validade</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Volume (mL)</th>
                <th className="px-3 py-3">Detalhes do item</th>
              </tr>
            </thead>

            <tbody>
              {bolsasPagina.map((bolsa) => (
                <tr
                  key={bolsa.id}
                  className="h-[66px] border-b border-gray-100 text-black hover:bg-gray-50"
                >
                  <td className="px-3 font-semibold">
                    {bolsa.id}
                  </td>

                  <td className="px-3 font-semibold">
                    {bolsa.tipo}
                  </td>

                  <td className="px-3">
                    {formatarData(bolsa.entrada)}
                  </td>

                  <td className="px-3">
                    {formatarData(bolsa.validade)}
                  </td>

                  <td className="px-3">
                    <span
                      className={`inline-block min-w-28 rounded-full px-3 py-2 font-medium text-[#203A60] ${
                        bolsa.status === "Disponível"
                          ? "bg-[#D0EEE8]"
                          : bolsa.status === "Em uso"
                          ? "bg-[#CCDEF4]"
                          : "bg-[#F9D4D8]"
                      }`}
                    >
                      {bolsa.status}
                    </span>
                  </td>

                  <td className="px-3">
                    {bolsa.volume}
                  </td>

                  <td className="px-3">
                    <Link
                      href={`/estoque/consulta/${bolsa.id}`}
                      aria-label={`Detalhes da bolsa ${bolsa.id}`}
                      title={`Consultar ${bolsa.id}`}
                      className="inline-flex rounded p-2 text-black hover:bg-gray-200"
                    >
                      <Lupa tamanho={23} />
                    </Link>
                  </td>
                </tr>
              ))}

              {bolsasPagina.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-gray-600"
                  >
                    Nenhuma bolsa encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        <div className="mt-12 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setPaginaAtual((p) => Math.max(1, p - 1))
              }
              disabled={paginaAtual === 1}
              className="px-2 text-xl text-black disabled:opacity-30"
              aria-label="Página anterior"
            >
              ‹
            </button>

            {Array.from(
              { length: totalPaginas },
              (_, i) => i + 1
            ).map((pagina) => (
              <button
                key={pagina}
                type="button"
                onClick={() => setPaginaAtual(pagina)}
                className={`rounded px-2 py-1 text-sm font-semibold ${
                  paginaAtual === pagina
                    ? "bg-blue-600 text-white"
                    : "text-black hover:bg-gray-300"
                }`}
              >
                {pagina}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                setPaginaAtual((p) =>
                  Math.min(totalPaginas, p + 1)
                )
              }
              disabled={paginaAtual === totalPaginas}
              className="px-2 text-xl text-black disabled:opacity-30"
              aria-label="Próxima página"
            >
              ›
            </button>
          </div>

          <p className="text-sm font-semibold text-black">
            {bolsasFiltradas.length === 0 ? 0 : inicio + 1}
            {" - "}
            {Math.min(
              inicio + ITENS_POR_PAGINA,
              bolsasFiltradas.length
            )}
            {" de "}
            {bolsasFiltradas.length} itens
          </p>
        </div>

        {/* BOTÃO VOLTAR */}
        <div className="mt-14 flex justify-end">
          <Link
            href="/estoque"
            className="rounded-lg border border-black bg-white px-10 py-3 text-sm font-semibold text-black hover:bg-gray-100"
          >
            Voltar
          </Link>
        </div>
      </main>
    </div>
  );
}
