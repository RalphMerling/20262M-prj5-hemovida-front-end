import { Droplet } from "lucide-react";

export interface Fatia {
  nome: string;
  valor: number; // quantidade ou porcentagem: o gráfico calcula a proporção sozinho
  cor: string; // qualquer cor CSS, por exemplo "var(--color-vermelho-1)"
}

// Gráfico de rosca sem biblioteca. Cada fatia recebe um trecho do círculo.
export function Rosquinha({ fatias }: { fatias: Fatia[] }) {
  const total = fatias.reduce((soma, f) => soma + f.valor, 0);

  // Onde cada fatia termina, em %. Ex.: valores 70, 20, 10 viram 70, 90, 100.
  const fins = fatias.map((_, i) => (fatias.slice(0, i + 1).reduce((s, f) => s + f.valor, 0) / total) * 100);

  const trechos = fatias.map((f, i) => `${f.cor} ${i === 0 ? 0 : fins[i - 1]}% ${fins[i]}%`);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        role="img"
        aria-label={fatias.map((f) => `${f.nome} ${Math.round((f.valor / total) * 100)}%`).join(", ")}
        className="relative h-52 w-52 rounded-full"
        style={{ background: `conic-gradient(${trechos.join(", ")})` }}
      >
        {/* O "furo" branco no meio transforma a pizza em rosca */}
        <div className="absolute inset-11 flex items-center justify-center rounded-full bg-card text-vermelho-1">
          <Droplet size={28} />
        </div>
      </div>

      <ul className="w-full space-y-2">
        {fatias.map((f) => (
          <li key={f.nome} className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full" style={{ background: f.cor }} />
              {f.nome}
            </span>
            <span>{Math.round((f.valor / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}