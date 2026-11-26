"use client";

import { useEffect, useState } from "react";
import type { Pedido } from "@/models/pedido";
import { mensagemDoErro } from "@/services/api";
import { listarPedidos } from "@/services/pedidosService";

// Busca a lista de pedidos quando a tela abre. A tela usa assim:
//   const { pedidos, carregando, erro } = usePedidos();
export function usePedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false; // se a tela fechar antes da resposta, ignora o resultado
    listarPedidos()
      .then((lista) => {
        if (!cancelado) setPedidos(lista);
      })
      .catch((e: unknown) => {
        if (!cancelado) setErro(mensagemDoErro(e));
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  return { pedidos, carregando, erro };
}
