import { formatarDataBR } from "@/lib/formatadores";
import type { Aviso } from "@/models/portal";

export function ListaAvisos({ avisos }: { avisos: Aviso[] }) {
  if (avisos.length === 0) {
    return <p className="p-4 text-sm text-preto/60">Você não tem avisos por enquanto.</p>;
  }

  return (
    <ul className="divide-y divide-preto/10">
      {avisos.map((aviso) => (
        <li key={aviso.id} className="flex gap-3 p-4">
          <span
            aria-hidden
            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${aviso.lida ? "bg-transparent" : "bg-vermelho-1"}`}
          />
          <div className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className={`text-sm ${aviso.lida ? "font-medium" : "font-semibold"}`}>
                {aviso.titulo}
                {!aviso.lida && <span className="sr-only"> (novo)</span>}
              </p>
              <time dateTime={aviso.dataEnvio} className="shrink-0 text-xs text-preto/50">
                {formatarDataBR(aviso.dataEnvio)}
              </time>
            </div>
            <p className="mt-1 text-sm text-preto/70">{aviso.mensagem}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}