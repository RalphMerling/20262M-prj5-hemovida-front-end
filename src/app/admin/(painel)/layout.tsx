import { MENU_POR_PERFIL } from "@/auth/menus";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Perfil } from "@/models/perfil";

// Moldura de TODAS as telas internas: menu lateral + área cinza com o conteúdo.
// A pasta (painel) entre parênteses não entra na URL. Ela só serve para o menu
// não aparecer em /admin/login.
export default function PainelLayout({ children }: { children: React.ReactNode }) {
  // TODO: ler perfil e nome do token (passo do login). Por enquanto é de mentira.
  const perfil: Perfil = "ADMIN";
  const usuario = { nome: "Usuário de teste", cargo: "Administração" };

  const itens = MENU_POR_PERFIL[perfil] ?? [];

  return (
    <div className="flex min-h-screen">
      <Sidebar itens={itens} usuario={usuario} />
      <main className="min-w-0 flex-1 bg-cinza-azulado px-8 py-8">{children}</main>
    </div>
  );
}