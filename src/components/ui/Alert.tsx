import type { ReactNode } from "react";

const estilos = {
  erro: "border-vermelho-1 bg-vermelho-1/10 text-vermelho-2",
  sucesso: "border-green-600 bg-green-50 text-green-800",
};

export function Alert({ tipo, children }: { tipo: keyof typeof estilos; children: ReactNode }) {
  return (
    <div role="alert" className={`rounded-md border px-4 py-3 text-sm ${estilos[tipo]}`}>
      {children}
    </div>
  );
}