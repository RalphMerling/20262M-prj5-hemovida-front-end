"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EstadoVazio } from "@/components/ui/EstadoVazio";
import { Modal } from "@/components/ui/Modal";
import { ListaAvisos } from "@/components/doador/ListaAvisos";
import { formatarDataBR } from "@/lib/formatadores";
import type { Aviso } from "@/models/portal";

// Mostra só o aviso mais recente. O resto fica numa janelinha, atrás do botão.
export function AvisosRecentes({ avisos }: { avisos: Aviso[] }) {
  const [listaAberta, setListaAberta] = useState(false);
  const maisRecente = avisos[0]; // a lista já vem do mais novo para o mais antigo
  const naoLidos = avisos.filter((aviso) => !aviso.lida).length;

  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg text-preto">Avisos recentes</h2>
        {naoLidos > 0 && (
          <span className="rounded-full bg-vermelho-1/10 px-2 py-0.5 text-xs font-semibold text-vermelho-1">
            {naoLidos} {naoLidos === 1 ? "novo" : "novos"}
          </span>
        )}
      </div>

      {maisRecente ? (
        <>
          <div className="flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold">{maisRecente.titulo}</p>
              <time dateTime={maisRecente.dataEnvio} className="shrink-0 text-xs text-preto/50">
                {formatarDataBR(maisRecente.dataEnvio)}
              </time>
            </div>
            <p className="mt-1 line-clamp-3 text-sm text-preto/70">{maisRecente.mensagem}</p>
          </div>

          <Button variante="cancelar" tamanho="sm" className="mt-3 w-full" onClick={() => setListaAberta(true)}>
            Ver todos os avisos
          </Button>

          <Modal aberto={listaAberta} aoFechar={() => setListaAberta(false)} titulo="Avisos">
            <div className="max-h-[60vh] overflow-y-auto">
              <ListaAvisos avisos={avisos} />
            </div>
          </Modal>
        </>
      ) : (
        <EstadoVazio
          icone={<Bell size={32} />}
          titulo="Nenhum aviso por enquanto"
          texto="Resultados de exames e novidades do hemocentro vão aparecer aqui."
        />
      )}
    </Card>
  );
}