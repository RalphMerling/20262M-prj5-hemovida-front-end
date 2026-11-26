"use client";

import {
  ClipboardList,
  Home,
  Inbox,
  Power,
  Syringe,

  // ==========================================
  // INÍCIO - MS2 ESTOQUE
  // Ícones adicionados para o módulo Estoque
  // ==========================================
  Package,
  ArrowLeftRight,
  FileText,
  // FIM - MS2 ESTOQUE
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ItemMenu } from "@/auth/menus";
import { Logo } from "./Logo";

const icones = {
  // Ícones originais - Bia
  inicio: Home,
  recepcao: Inbox,
  triagem: ClipboardList,
  doacao: Syringe,

  // ==========================================
  // INÍCIO - MS2 ESTOQUE
  // Ícones de navegação do módulo Estoque
  // ==========================================
  estoque: Package,
  transacoes: ArrowLeftRight,
  relatorios: FileText,
  // FIM - MS2 ESTOQUE
};

interface SidebarProps {
  itens: ItemMenu[];
  usuario: { nome: string; cargo: string };
}

export function Sidebar({ itens, usuario }: SidebarProps) {
  const rotaAtual = usePathname(); // endereço da página aberta agora

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between bg-branco px-5 py-10">
      <div>
        <div className="mb-12 flex justify-center">
          <Logo className="text-3xl" />
        </div>

        <nav aria-label="Menu principal" className="flex flex-col gap-2">
          {itens.map(({ rotulo, href, icone }) => {
            const Icone = icones[icone];

            // ==========================================
            // INÍCIO - MS2 ESTOQUE
            //
            // Regra para identificar a página ativa:
            //
            // Início:
            //   Destaca somente a rota exata
            //   (inclui o Início da Demanda: /admin/demanda,
            //   senão ele ficaria marcado em regular,
            //   emergencial e histórico).
            //
            // Estoque:
            //   Destaca Dashboard e Consulta de Bolsas.
            //
            // Transações:
            //   Destaca Transações e Solicitações.
            //
            // Relatórios:
            //   Destaca os relatórios de Estoque
            //   e de Transações.
            //
            // As rotas administrativas da Bia
            // continuam funcionando normalmente.
            // ==========================================

            const ativo =
              href === "/" || href === "/admin" || href === "/admin/demanda"
                ? rotaAtual === href

                : href === "/estoque"
                ? rotaAtual === "/estoque" ||
                  rotaAtual.startsWith("/estoque/consulta")

                : href === "/estoque/transacoes"
                ? rotaAtual.startsWith("/estoque/transacoes") ||
                  rotaAtual.startsWith("/estoque/solicitacoes")

                : rotaAtual === href ||
                  rotaAtual.startsWith(`${href}/`);

            // FIM - MS2 ESTOQUE

            return (
              <Link
                key={href}
                href={href}
                aria-current={ativo ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-4 py-3 text-lg font-semibold text-azul-1 transition ${
                  ativo ? "bg-azul-3" : "hover:bg-azul-3/40"
                }`}
              >
                <Icone size={22} />
                {rotulo}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* Quem está logado: ajuda a conferir que está na conta certa */}
        <div className="border-t border-preto/15 pt-4">
          <p className="font-semibold">{usuario.nome}</p>
          <p className="text-sm text-preto/70">{usuario.cargo}</p>
        </div>

        {/* TODO: trocar por uma ação de logout que apaga o cookie */}
        <Link
          href="/admin/login"
          className="flex items-center gap-3 px-4 font-semibold text-vermelho-2"
        >
          <Power size={20} />
          Sair
        </Link>
      </div>
    </aside>
  );
}