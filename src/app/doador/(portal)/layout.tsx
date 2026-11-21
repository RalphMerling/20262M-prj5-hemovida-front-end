import type { ReactNode } from "react";
import { PortalProvider } from "@/components/doador/PortalProvider";

export const metadata = { title: "Portal do doador" };

export default function PortalDoadorLayout({ children }: { children: ReactNode }) {
  return <PortalProvider>{children}</PortalProvider>;
}