import type { ReactNode } from "react";
import { CabecalhoPortal } from "@/components/doador/CabecalhoPortal";
import { avisosMock } from "@/data/mock";

export default function PortalDoadorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cinza-azulado">
      <CabecalhoPortal avisos={avisosMock} />
      <main className="mx-auto max-w-7xl px-8 pb-12">{children}</main>
    </div>
  );
}