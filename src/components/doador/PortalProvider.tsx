"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { CabecalhoPortal } from "@/components/doador/CabecalhoPortal";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { GotaCarregando } from "@/components/ui/GotaCarregando";
import { mensagemDoErro } from "@/services/api";
import { carregarPortal } from "@/services/portalService";
import type { DadosDoPortal } from "@/services/portalService";

type Estado =
  | { situacao: "carregando" }
  | { situacao: "erro"; mensagem: string }
  | { situacao: "pronto"; dados: DadosDoPortal };

const PortalContext = createContext<DadosDoPortal | null>(null);

// As telas do portal usam isso para pegar doador, histórico e avisos.
export function usePortal(): DadosDoPortal {
  const dados = useContext(PortalContext);
  if (!dados) throw new Error("usePortal precisa ficar dentro do PortalProvider");
  return dados;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<Estado>({ situacao: "carregando" });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    carregarPortal()
      .then((dados) => {
        if (!cancelado) setEstado({ situacao: "pronto", dados });
      })
      .catch((erro) => {
        if (!cancelado) setEstado({ situacao: "erro", mensagem: mensagemDoErro(erro) });
      });

    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function tentarDeNovo() {
    setEstado({ situacao: "carregando" });
    setTentativa((n) => n + 1);
  }

  if (estado.situacao === "carregando") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinza-azulado">
        <GotaCarregando texto="Carregando seu portal..." />
      </div>
    );
  }

  if (estado.situacao === "erro") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cinza-azulado px-8">
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          <Alert tipo="erro">{estado.mensagem}</Alert>
          <Button onClick={tentarDeNovo}>Tentar de novo</Button>
        </div>
      </div>
    );
  }

  return (
    <PortalContext.Provider value={estado.dados}>
      <div className="min-h-screen bg-cinza-azulado">
        <CabecalhoPortal avisos={estado.dados.avisos} />
        <main className="mx-auto max-w-7xl px-8 pb-12">{children}</main>
      </div>
    </PortalContext.Provider>
  );
}