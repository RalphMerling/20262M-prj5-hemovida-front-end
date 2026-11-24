import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface CartaoIndicadorProps {
  rotulo: string;
  valor: string; // já formatado: "112", "3,17%", "3,7"
  // Quando existe, mostra uma setinha: "alta" (verde) ou "baixa" (vermelha).
  tendencia?: "alta" | "baixa";
}

// Cartão de indicador do gestor: rótulo pequeno + número grande, com seta opcional.
// O CartaoNumero do ui tem ícone e só aceita número, por isso este é separado.
export function CartaoIndicador({ rotulo, valor, tendencia }: CartaoIndicadorProps) {
  const cor = tendencia === "alta" ? "text-green-700" : tendencia === "baixa" ? "text-vermelho-2" : "text-preto";
  const Seta = tendencia === "alta" ? ArrowUp : ArrowDown;

  return (
    <Card className="flex flex-col justify-between gap-4">
      <p className="text-sm text-preto/70">{rotulo}</p>
      <p className={`flex items-center justify-center gap-1 font-titulo text-4xl font-semibold ${cor}`}>
        {tendencia && (
          <>
            <Seta size={26} aria-hidden="true" />
            <span className="sr-only">{tendencia === "alta" ? "Alta de" : "Queda de"}</span>
          </>
        )}
        {valor}
      </p>
    </Card>
  );
}
