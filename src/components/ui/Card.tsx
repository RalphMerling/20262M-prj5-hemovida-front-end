import type { ReactNode } from "react";

// Bento Box
export function Card({
  titulo,
  children,
  className = "",
}: {
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl bg-card p-6 ${className}`}>
      {titulo && <h2 className="mb-4 text-xl text-azul-1">{titulo}</h2>}
      {children}
    </section>
  );
}