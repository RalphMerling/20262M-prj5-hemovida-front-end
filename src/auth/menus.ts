import type { Perfil } from "@/models/perfil";

export interface ItemMenu {
  rotulo: string;
  href: string;
  icone: "inicio" | "recepcao" | "triagem" | "doacao";
}

const inicio: ItemMenu = { rotulo: "Início", href: "/admin", icone: "inicio" };
const recepcao: ItemMenu = { rotulo: "Recepção", href: "/admin/recepcao", icone: "recepcao" };
const triagem: ItemMenu = { rotulo: "Triagem", href: "/admin/triagem", icone: "triagem" };
const doacao: ItemMenu = { rotulo: "Doação", href: "/admin/doacao", icone: "doacao" };

// REGRA DA OMISSÃO: o perfil nunca vê um botão que não pode usar.
// O "Sair" é fixo no Sidebar, por isso não aparece aqui.
export const MENU_POR_PERFIL: Partial<Record<Perfil, ItemMenu[]>> = {
  ADMIN: [inicio, recepcao, triagem, doacao],
  RECEPCAO: [inicio, recepcao],
  ENFERMAGEM: [inicio, triagem, doacao],
};