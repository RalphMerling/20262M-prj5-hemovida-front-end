
import Sidebar from "@/components/Sidebar";

// ÍCONE DE GOTA DE SANGUE
function IconeGota({
  tamanho = 30,
}: {
  tamanho?: number;
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B32630"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2C9 6.5 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-4-8.5-7-13Z" />
      <path d="M9 18c.8 1 1.8 1.5 3 1.5" />
    </svg>
  );
}

// ESTOQUE POR TIPO SANGUÍNEO
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

// TOTAL DE BOLSAS
const totalBolsas = tiposSanguineos.reduce(
  (total, item) => total + item.quantidade,
  0
);

// INDICADORES DO DASHBOARD
const indicadores = [
  {
    titulo: "Total de bolsas no estoque",
    valor: totalBolsas,
    icone: "gota",
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

// DASHBOARD DO ESTOQUE
export default function EstoquePage() {
  return (
    <div className="flex min-h-screen bg-[#E1E4E9]">
      {/* MENU COMPARTILHADO */}
      <Sidebar />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">
        {/* PESQUISA */}
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

        {/* INDICADORES SUPERIORES */}
        <section className="mb-16 grid grid-cols-4 gap-6">
          {indicadores.map((indicador) => (
            <div
              key={indicador.titulo}
              className="flex min-h-44 flex-col bg-white p-5"
            >
              <div className="mb-3 flex h-9 items-center text-[#B32630]">
                {indicador.icone === "gota" ? (
                  <IconeGota tamanho={30} />
                ) : (
                  <span className="text-3xl">
                    {indicador.icone}
                  </span>
                )}
              </div>

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
                {/* GOTA E TIPO SANGUÍNEO À ESQUERDA */}
                <div className="mb-2 flex w-full items-center justify-start gap-3 pl-5">
                  <IconeGota tamanho={28} />

                  <span className="text-xl font-bold text-black">
                    {item.tipo}
                  </span>
                </div>

                {/* QUANTIDADE CENTRALIZADA */}
                <p className="mb-3 text-xl font-semibold text-gray-800">
                  {item.quantidade}
                </p>

                {/* STATUS CENTRALIZADO */}
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
