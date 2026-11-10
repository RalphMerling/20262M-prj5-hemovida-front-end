
import Link from "next/link";

const tiposSanguineos = [
  { tipo: "A+", quantidade: 50, status: "Adequado" },
  { tipo: "A-", quantidade: 21, status: "Adequado" },
  { tipo: "B+", quantidade: 41, status: "Adequado" },
  { tipo: "B-", quantidade: 16, status: "Estoque Baixo" },
  { tipo: "O+", quantidade: 68, status: "Adequado" },
  { tipo: "O-", quantidade: 25, status: "Adequado" },
  { tipo: "AB+", quantidade: 17, status: "Adequado" },
  { tipo: "AB-", quantidade: 10, status: "Estoque Baixo" },
];

// Total calculado automaticamente
const totalBolsas = tiposSanguineos.reduce(
  (total, item) => total + item.quantidade,
  0
);

const indicadores = [
  {
    titulo: "Total de bolsas no estoque",
    valor: totalBolsas,
    icone: "♧",
  },
  {
    titulo: "Transações hoje",
    valor: 17,
    icone: "⇄",
  },
  {
    titulo: "Doadores no mês",
    valor: 86,
    icone: "♙",
  },
  {
    titulo: "Bolsas em alerta (vencimento)",
    valor: 12,
    icone: "◷",
  },
];

export default function EstoquePage() {
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
            className="rounded-lg bg-[#98D8E2] px-5 py-3 text-xl font-semibold text-[#203A60]"
          >
            ⌂ &nbsp; Início
          </Link>

          <Link
            href="/estoque/consulta"
            className="rounded-lg px-5 py-3 text-xl font-semibold text-[#203A60] hover:bg-gray-200"
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
            type="text"
            placeholder="Buscar"
            aria-label="Buscar"
            className="w-full px-4 py-3 text-gray-700 outline-none"
          />

          <button
            type="button"
            aria-label="Pesquisar"
            className="border-l border-gray-300 bg-gray-200 px-5 text-xl text-gray-700"
          >
            ⌕
          </button>
        </div>

        {/* TÍTULO */}
        <h1 className="mb-12 text-2xl font-bold text-[#203A60]">
          Aqui você acompanha o estoque e as transações do sistema
        </h1>

        {/* INDICADORES */}
        <section className="mb-16 grid grid-cols-4 gap-6">
          {indicadores.map((indicador) => (
            <div
              key={indicador.titulo}
              className="flex min-h-44 flex-col bg-white p-5"
            >
              <span className="mb-3 text-3xl text-[#B32630]">
                {indicador.icone}
              </span>

              <h2 className="min-h-12 text-sm font-semibold text-gray-800">
                {indicador.titulo}
              </h2>

              <p className="mt-auto text-4xl font-bold text-[#B32630]">
                {indicador.valor}
              </p>
            </div>
          ))}
        </section>

        {/* ESTOQUE POR TIPO SANGUÍNEO */}
        <section>
          <h2 className="mb-10 text-2xl font-bold text-[#203A60]">
            Estoque por tipo sanguíneo
          </h2>

          <div className="grid grid-cols-4 gap-10">
            {tiposSanguineos.map((item) => (
              <div
                key={item.tipo}
                className="flex min-h-36 flex-col items-center justify-center bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-2xl text-[#B32630]">
                    ♧
                  </span>

                  <span className="text-xl font-bold text-black">
                    {item.tipo}
                  </span>
                </div>

                <p className="mb-3 text-xl font-semibold text-gray-800">
                  {item.quantidade}
                </p>

                <span
                  className={`w-full rounded-full px-3 py-1 text-center text-sm font-semibold text-[#203A60] ${
                    item.status === "Adequado"
                      ? "bg-[#D0EEE8]"
                      : "bg-[#FFF0D4]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
