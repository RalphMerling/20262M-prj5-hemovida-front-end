import type { ReactNode } from "react";
import { Card } from "./Card";

// Cartão de indicador: ícone + rótulo + número grande.
export function CartaoNumero({ rotulo, valor, icone }: { rotulo: string; valor: number; icone: ReactNode }) {
  return (
    <Card>
      <div className="flex items-center gap-3 font-semibold">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-azul-3 text-azul-1">{icone}</span>
        {rotulo}
      </div>
      <p className="mt-3 font-titulo text-5xl font-semibold text-azul-2">{valor}</p>
    </Card>
  );
}