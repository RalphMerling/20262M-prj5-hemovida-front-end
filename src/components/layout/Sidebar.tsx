"use client";

import { ClipboardList, Home, Inbox, Power, Syringe } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ItemMenu } from "@/auth/menus";
import { Logo } from "./Logo";

const icones = {
  inicio: Home,
  recepcao: Inbox,
  triagem: ClipboardList,
  doacao: Syringe,
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
            // "/admin" só fica ativo na rota exata. As outras também ficam ativas em subpáginas.
            const ativo = href === "/admin" ? rotaAtual === href : rotaAtual.startsWith(href);

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
        <Link href="/admin/login" className="flex items-center gap-3 px-4 font-semibold text-vermelho-2">
          <Power size={20} />
          Sair
        </Link>
      </div>
    </aside>
  );
}