import Link from "next/link";
import { GotaCarregando } from "@/components/ui/GotaCarregando";

// Página 404: aparece quando o endereço não existe.
export default function PaginaNaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-branco px-8 text-center">
      <GotaCarregando animar={false} texto="" />
      <p className="font-titulo text-6xl text-vermelho-1">404</p>
      <div>
        <h1 className="font-titulo text-2xl text-preto">Página não encontrada</h1>
        <p className="mt-2 max-w-md text-preto/70">O endereço que você tentou abrir não existe ou mudou de lugar.</p>
      </div>
      <Link
        href="/"
        className="rounded-full bg-vermelho-1 px-8 py-3 font-semibold text-branco transition hover:bg-vermelho-2"
      >
        Voltar para o início
      </Link>
    </main>
  );
}