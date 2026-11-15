import { Droplet } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Para quem nunca doou: não existe "próxima doação", então o convite é para já.
export function CartaoPrimeiraDoacao() {
  return (
    <Card className="flex flex-col items-center justify-center gap-3 text-center">
      <h2 className="text-lg text-preto">Sua primeira doação</h2>
      <span
        aria-hidden
        className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-vermelho-1/15 text-vermelho-1"
      >
        <Droplet size={44} />
      </span>
      <p className="font-semibold text-preto">Você já pode doar!</p>
      <p className="text-sm text-preto/60">Leve um documento com foto a um hemocentro.</p>
    </Card>
  );
}