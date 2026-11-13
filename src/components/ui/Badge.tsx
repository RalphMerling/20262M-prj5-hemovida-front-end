import type { ReactNode } from "react";

const estilos = {
  sangue: "bg-vermelho-1 text-branco font-bold",
  sucesso: "border border-green-600 bg-green-50 text-green-800",
  erro: "border border-vermelho-1 bg-vermelho-1/10 text-vermelho-2",
  info: "border border-azul-2 bg-azul-3/30 text-azul-1",
};

// Etiqueta pequena: tipo sanguíneo (A+) ou status (Concluído, Cancelado).
export function Badge({ variante = "info", children }: { variante?: keyof typeof estilos; children: ReactNode }) {
  return <span className={`inline-block rounded px-2 py-0.5 text-sm ${estilos[variante]}`}>{children}</span>;
}