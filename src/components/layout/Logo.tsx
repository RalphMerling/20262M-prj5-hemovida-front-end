import Link from "next/link";
import { Droplet } from "lucide-react";

// Logo clicável que leva para a home
export function Logo({ className = "text-3xl" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-1 font-titulo font-semibold text-vermelho-2 ${className}`}
    >
      HemoVida
      <Droplet className="h-[0.9em] w-[0.9em]" />
    </Link>
  );
}