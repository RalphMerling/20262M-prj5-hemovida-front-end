import type { ReactNode } from "react";
import { Card } from "./Card";

interface EstadoVazioProps {
  icone: ReactNode;
  titulo: string;
  texto: string;
  className?: string;
}

// Aviso para quando ainda não há nada para mostrar (antes de uma busca, lista vazia, etc.).
export function EstadoVazio({ icone, titulo, texto, className = "" }: EstadoVazioProps) {
  return (
    <Card className={className}>
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-azul-3/30 text-azul-2">{icone}</span>
        <h2 className="text-xl text-azul-1">{titulo}</h2>
        <p className="max-w-md text-preto/70">{texto}</p>
      </div>
    </Card>
  );
}