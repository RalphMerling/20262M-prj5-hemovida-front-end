
import { Search } from "lucide-react";

// ======================================================
// INÍCIO - MS2 ESTOQUE
// Integração com os componentes compartilhados da Bia
// ======================================================

import { MENU_ESTOQUE } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";

// FIM - MS2 ESTOQUE

// ======================================================
// MS2 ESTOQUE
// Identificação temporária do usuário
// Futuramente será obtida pelo sistema de autenticação
// ======================================================

const usuarioEstoque = {
  nome: "Usuário de teste",
  cargo: "Estoque",
};

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
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-vermelho-1"
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

// ======================================================
// MS2 ESTOQUE
// Dashboard atualizado para utilizar os componentes
// e estilos compartilhados do frontend HemoVida
// ======================================================

export default function EstoquePage() {
  return (
    <div className="flex min-h-screen bg-cinza-azulado">

      {/* SIDEBAR COMPARTILHADO - BIA */}
      {/* MS2 ESTOQUE: configuração de menu específica */}
      <Sidebar
        itens={MENU_ESTOQUE}
        usuario={usuarioEstoque}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="min-w-0 flex-1 px-10 py-12">

        {/* PESQUISA */}
        <div className="mb-10 flex overflow-hidden rounded-md border border-gray-300 bg-card">

          <input
            type="text"
            placeholder="Buscar"
            aria-label="Buscar"
            className="w-full px-4 py-3 text-preto outline-none"
          />

          {/* MS2 ESTOQUE: botão padronizado da Bia */}
          <Button
            type="button"
            variante="suave"
            tamanho="sm"
            aria-label="Pesquisar"
            className="rounded-none border-l border-gray-300 px-5"
          >
            <Search size={22} />
          </Button>
        </div>

        {/* TÍTULO */}
        <h1 className="mb-12 text-2xl font-bold text-azul-1">
          Aqui você acompanha o estoque e as transações do sistema
        </h1>

        {/* INDICADORES SUPERIORES */}
        <section className="mb-16 grid grid-cols-4 gap-6">
          {indicadores.map((indicador) => (
            <div
              key={indicador.titulo}
              className="flex min-h-44 flex-col bg-card p-5"
            >
              {/* ÍCONE */}
              <div className="mb-3 flex h-9 items-center text-vermelho-1">
                {indicador.icone === "gota" ? (
                  <IconeGota tamanho={30} />
                ) : (
                  <span
                    className="text-3xl"
                    aria-hidden="true"
                  >
                    {indicador.icone}
                  </span>
                )}
              </div>

              {/* DESCRIÇÃO */}
              <h2 className="min-h-12 text-sm font-semibold text-preto">
                {indicador.titulo}
              </h2>

              {/* QUANTIDADE */}
              <p className="mt-auto text-4xl font-bold text-vermelho-1">
                {indicador.valor}
              </p>
            </div>
          ))}
        </section>

        {/* ESTOQUE POR TIPO SANGUÍNEO */}
        <section>
          <h2 className="mb-10 text-2xl font-bold text-azul-1">
            Estoque por tipo sanguíneo
          </h2>

          <div className="grid grid-cols-4 gap-10">
            {tiposSanguineos.map((item) => (
              <div
                key={item.tipo}
                className="flex min-h-36 flex-col items-center justify-center bg-card p-4"
              >

                {/* GOTA E TIPO SANGUÍNEO À ESQUERDA */}
                <div className="mb-2 flex w-full items-center justify-start gap-3 pl-5">
                  <IconeGota tamanho={28} />

                  <span className="text-xl font-bold text-preto">
                    {item.tipo}
                  </span>
                </div>

                {/* QUANTIDADE CENTRALIZADA */}
                <p className="mb-3 text-xl font-semibold text-preto">
                  {item.quantidade}
                </p>

                {/* STATUS CENTRALIZADO */}
                <span
                  className={`w-full rounded-full px-3 py-1 text-center text-sm font-semibold text-azul-1 ${
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
