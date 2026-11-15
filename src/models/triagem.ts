import type { Doador } from "@/models/doador";

export type Genero = Doador["doador_genero"];

// O que o enfermeiro digita no passo 1. Fica como texto porque é o que o campo devolve.
export interface SinaisVitais {
  peso: string; // em kg
  pressao: string; // no formato "120/80"
  hemoglobina: string; // em g/dL
}

export interface PerguntaTriagem {
  id: number;
  descricao: string;
}

export type Respostas = Partial<Record<number, boolean>>;

export interface ResultadoTriagem {
  apto: boolean;
  pesoOk: boolean;
  sistolicaOk: boolean;
  diastolicaOk: boolean;
  hemoglobinaOk: boolean;
  respostasSim: PerguntaTriagem[];
}