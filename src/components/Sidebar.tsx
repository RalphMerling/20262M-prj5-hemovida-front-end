
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NomeIcone =
  | "inicio"
  | "estoque"
  | "transacoes"
  | "relatorios"
  | "sair";

function Icone({ nome }: { nome: NomeIcone }) {
  const estilo = {
    width: 27,
    height: 27,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (nome) {
    case "inicio":
      return (
        <svg viewBox="0 0 24 24" {...estilo}>
          <path d="M3 10L12 3L21 10V21H14V14H10V21H3V10Z" />
        </svg>
      );

    case "estoque":
      return (
        <svg viewBox="0 0 24 24" {...estilo}>
          <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" />
          <path d="M3 7L12 12L21 7" />
          <path d="M12 12V22" />
        </svg>
      );

    case "transacoes":
      return (
        <svg viewBox="0 0 24 24" {...estilo}>
          <path d="M3 7H21L16 2" />
          <path d="M21 7L16 12" />
          <path d="M21 17H3L8 12" />
          <path d="M3 17L8 22" />
        </svg>
      );

    case "relatorios":
      return (
        <svg viewBox="0 0 24 24" {...estilo}>
          <path d="M6 2H14L19 7V22H6Z" />
          <path d="M14 2V7H19" />
          <path d="M9 12H16" />
          <path d="M9 16H16" />
        </svg>
      );

    case "sair":
      return (
        <svg viewBox="0 0 24 24" {...estilo}>
          <path d="M12 2V12" />
          <path d="M7 4.5A9 9 0 1 0 17 4.5" />
        </svg>
      );
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  const inicioAtivo = pathname === "/estoque";

  const estoqueAtivo =
    pathname.startsWith("/estoque/consulta");

  const transacoesAtivo =
    pathname.startsWith("/estoque/transacoes") ||
    pathname.startsWith("/estoque/solicitacoes");

  const relatoriosAtivo =
    pathname.startsWith("/estoque/relatorios");

  const relatorioTransacoesAtivo =
    pathname.startsWith(
      "/estoque/relatorios/transacoes"
    );

  const relatorioEstoqueAtivo =
    relatoriosAtivo && !relatorioTransacoesAtivo;

  function classeMenu(ativo: boolean) {
    return (
      "flex items-center gap-4 rounded-lg px-5 py-3 " +
      "text-xl font-semibold text-[#203A60] " +
      (ativo
        ? "bg-[#98D8E2]"
        : "hover:bg-gray-200")
    );
  }

  function classeSubmenu(ativo: boolean) {
    return (
      "rounded-lg px-3 py-2 text-lg font-semibold " +
      "text-[#203A60] " +
      (ativo
        ? "bg-[#98D8E2]"
        : "hover:bg-gray-200")
    );
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col bg-[#F0F0F0] px-8 py-10">
      {/* LOGOTIPO */}
      <Link
        href="/"
        className="mb-20 text-3xl font-bold text-[#800000]"
      >
        HemoVida ♡
      </Link>

      {/* MENU PRINCIPAL */}
      <nav
        aria-label="Menu do estoque"
        className="flex flex-col gap-5"
      >
        {/* INÍCIO */}
        <Link
          href="/estoque"
          aria-current={
            inicioAtivo ? "page" : undefined
          }
          className={classeMenu(inicioAtivo)}
        >
          <Icone nome="inicio" />
          <span>Início</span>
        </Link>

        {/* ESTOQUE */}
        <Link
          href="/estoque/consulta"
          aria-current={
            estoqueAtivo ? "page" : undefined
          }
          className={classeMenu(estoqueAtivo)}
        >
          <Icone nome="estoque" />
          <span>Estoque</span>
        </Link>

        {/* TRANSAÇÕES - SUBITEM DE ESTOQUE */}
        <Link
          href="/estoque/transacoes"
          aria-current={
            transacoesAtivo ? "page" : undefined
          }
          className={
            "ml-5 " + classeMenu(transacoesAtivo)
          }
        >
          <Icone nome="transacoes" />
          <span>Transações</span>
        </Link>

        {/* RELATÓRIOS */}
        <Link
          href="/estoque/relatorios"
          className={classeMenu(false)}
        >
          <Icone nome="relatorios" />
          <span>Relatórios</span>
        </Link>

        {/* SUBMENU DE RELATÓRIOS */}
        {relatoriosAtivo && (
          <div className="ml-12 flex flex-col items-start gap-2">
            <Link
              href="/estoque/relatorios"
              aria-current={
                relatorioEstoqueAtivo
                  ? "page"
                  : undefined
              }
              className={classeSubmenu(
                relatorioEstoqueAtivo
              )}
            >
              Estoque
            </Link>

            <Link
              href="/estoque/relatorios/transacoes"
              aria-current={
                relatorioTransacoesAtivo
                  ? "page"
                  : undefined
              }
              className={classeSubmenu(
                relatorioTransacoesAtivo
              )}
            >
              Transações
            </Link>
          </div>
        )}
      </nav>

      {/* SAIR */}
      <div className="mt-auto pt-16">
        <Link
          href="/"
          className="flex items-center gap-4 px-5 py-3 text-xl font-medium text-[#800000] hover:opacity-70"
        >
          <Icone nome="sair" />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
}
