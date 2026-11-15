import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CartaoEstatisticaProps {
  icone: LucideIcon;
  rotulo: string;
  valor: string | number;
}

export function CartaoEstatistica({ icone: Icone, rotulo, valor }: CartaoEstatisticaProps) {
  return (
    <Card className="flex flex-1 flex-col justify-center gap-2">
      <div className="flex items-center gap-2">
        <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-vermelho-1/10 text-vermelho-1">
          <Icone size={16} />
        </span>
        <p className="text-sm font-semibold text-preto">{rotulo}</p>
      </div>
      <p className="text-center font-titulo text-3xl text-vermelho-1">{valor}</p>
    </Card>
  );
}