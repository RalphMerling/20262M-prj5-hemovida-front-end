"use client";

import { PerfilDoador } from "@/components/doador/PerfilDoador";
import { usePortal } from "@/components/doador/PortalProvider";

export default function PerfilPage() {
  const { doador, historico } = usePortal();

  return <PerfilDoador doador={doador} ultimaDoacao={historico[0]?.data ?? null} />;
}