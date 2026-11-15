import type { TipoDeDoacao } from "@/models/doacao";

export type StatusExame = "Em análise" | "Disponível";

export type ResultadoExame = "Pendente" | "Apto" | "Inapto";

// Uma doação na linha do tempo do portal do doador.
export interface DoacaoDoHistorico {
  id: number;
  tipo: TipoDeDoacao;
  data: string;
  statusExame: StatusExame; // 
  resultadoExame: ResultadoExame;
}

// Uma linha da tabela notificacao.
export interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  lida: boolean;
}