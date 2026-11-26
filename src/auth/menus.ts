
import type { Perfil } from "@/models/perfil";

export interface ItemMenu {
  rotulo: string;
  href: string;

  // MS2 - ESTOQUE: adicionados os ícones do módulo
  icone:
    | "inicio"
    | "recepcao"
    | "triagem"
    | "doacao"
    | "estoque" //MS Estoque
    | "transacoes" //MS Estoque
    | "relatorios"; //MS Estoque
}

// ======================================================
// MS2 DOAÇÃO
// Menus dos módulos administrativos
// ======================================================

const inicio: ItemMenu = { rotulo: "Início", href: "/admin", icone: "inicio" };
const recepcao: ItemMenu = { rotulo: "Recepção", href: "/admin/recepcao", icone: "recepcao" };
const triagem: ItemMenu = { rotulo: "Triagem", href: "/admin/triagem", icone: "triagem" };
const doacao: ItemMenu = { rotulo: "Doação", href: "/admin/doacao", icone: "doacao" };

// ======================================================
// MS3 DEMANDA
// O "Início" da demanda é outro item: o "inicio" acima aponta para /admin.
// Os ícones são os mesmos que já existem no Sidebar.
// ======================================================

const inicioDemanda: ItemMenu = { rotulo: "Início", href: "/admin/demanda", icone: "inicio" };
const regularesDemanda: ItemMenu = { rotulo: "Solicitações Regulares", href: "/admin/demanda/regular", icone: "recepcao" };
const emergencialDemanda: ItemMenu = { rotulo: "Pedido Emergencial", href: "/admin/demanda/emergencial", icone: "triagem" };
const historicoDemanda: ItemMenu = { rotulo: "Histórico", href: "/admin/demanda/historico", icone: "doacao" };

// REGRA DA OMISSÃO: o perfil nunca vê um botão que não pode usar.
// O "Sair" é fixo no Sidebar, por isso não aparece aqui.
export const MENU_POR_PERFIL: Partial<Record<Perfil, ItemMenu[]>> = {
  ADMIN: [inicio, recepcao, triagem, doacao],
  RECEPCAO: [inicio, recepcao],
  ENFERMAGEM: [inicio, triagem, doacao],
  GESTOR_DEMANDA: [inicioDemanda, regularesDemanda, emergencialDemanda, historicoDemanda],
};

// ======================================================
// INÍCIO - MS2 ESTOQUE
// Menu de navegação do microserviço de Estoque
// ======================================================

export const MENU_ESTOQUE: ItemMenu[] = [
  {
    rotulo: "Início",
    href: "/",
    icone: "inicio",
  },
  {
    rotulo: "Estoque",
    href: "/estoque",
    icone: "estoque",
  },
  {
    rotulo: "Transações",
    href: "/estoque/transacoes",
    icone: "transacoes",
  },
  {
    rotulo: "Relatórios",
    href: "/estoque/relatorios",
    icone: "relatorios",
  },
];

// ======================================================
// FIM - MS2 ESTOQUE
// ======================================================