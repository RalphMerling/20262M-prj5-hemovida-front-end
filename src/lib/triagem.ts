import type { Genero, PerguntaTriagem, Respostas, ResultadoTriagem, SinaisVitais } from "@/models/triagem";

// Faixas de referência
export const PESO_MINIMO_KG = 50;
export const SISTOLICA = { min: 90, max: 180 };
export const DIASTOLICA = { min: 60, max: 100 };

// Mulheres 12,5 e homens 13,0. Para "Outros" usamos o menor valor
export function hemoglobinaMinima(genero: Genero): number {
  return genero === "Masculino" ? 13 : 12.5;
}

export function formatarDecimal(numero: number): string {
  return String(numero).replace(".", ",");
}

export function lerNumero(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (limpo === "") return null;
  const numero = Number(limpo);
  return Number.isFinite(numero) && numero > 0 ? numero : null;
}

// "120/80" vira { sistolica: 120, diastolica: 80 }. Formato errado vira null.
export function lerPressao(texto: string): { sistolica: number; diastolica: number } | null {
  const achou = /^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/.exec(texto);
  if (!achou) return null;
  return { sistolica: Number(achou[1]), diastolica: Number(achou[2]) };
}

const dentro = (valor: number, faixa: { min: number; max: number }) => valor >= faixa.min && valor <= faixa.max;

export interface MensagensSinais {
  peso?: string;
  pressao?: string;
  hemoglobina?: string;
}
export function errosDePreenchimento(sinais: SinaisVitais): MensagensSinais {
  const erros: MensagensSinais = {};
  if (lerNumero(sinais.peso) === null) erros.peso = "Informe o peso em kg.";
  if (lerPressao(sinais.pressao) === null) erros.pressao = "Use o formato 120/80.";
  if (lerNumero(sinais.hemoglobina) === null) erros.hemoglobina = "Informe a hemoglobina em g/dL.";
  return erros;
}

export function avisosDeFaixa(sinais: SinaisVitais, genero: Genero): MensagensSinais {
  const avisos: MensagensSinais = {};

  const peso = lerNumero(sinais.peso);
  if (peso !== null && peso < PESO_MINIMO_KG) {
    avisos.peso = `Abaixo do mínimo de ${PESO_MINIMO_KG} kg.`;
  }

  const pressao = lerPressao(sinais.pressao);
  if (pressao && !dentro(pressao.sistolica, SISTOLICA)) {
    avisos.pressao = `Sistólica fora da faixa (${SISTOLICA.min} a ${SISTOLICA.max} mmHg).`;
  } else if (pressao && !dentro(pressao.diastolica, DIASTOLICA)) {
    avisos.pressao = `Diastólica fora da faixa (${DIASTOLICA.min} a ${DIASTOLICA.max} mmHg).`;
  }

  const hemoglobina = lerNumero(sinais.hemoglobina);
  const minimo = hemoglobinaMinima(genero);
  if (hemoglobina !== null && hemoglobina < minimo) {
    avisos.hemoglobina = `Abaixo do mínimo de ${formatarDecimal(minimo)} g/dL.`;
  }

  return avisos;
}

// Só é apto se os 3 sinais estiverem na faixa E nenhuma resposta for "Sim".
export function avaliarTriagem(
  sinais: SinaisVitais,
  genero: Genero,
  perguntas: PerguntaTriagem[],
  respostas: Respostas,
): ResultadoTriagem {
  const peso = lerNumero(sinais.peso);
  const pressao = lerPressao(sinais.pressao);
  const hemoglobina = lerNumero(sinais.hemoglobina);

  const pesoOk = peso !== null && peso >= PESO_MINIMO_KG;
  const sistolicaOk = pressao !== null && dentro(pressao.sistolica, SISTOLICA);
  const diastolicaOk = pressao !== null && dentro(pressao.diastolica, DIASTOLICA);
  const hemoglobinaOk = hemoglobina !== null && hemoglobina >= hemoglobinaMinima(genero);
  const respostasSim = perguntas.filter((pergunta) => respostas[pergunta.id] === true);

  return {
    apto: pesoOk && sistolicaOk && diastolicaOk && hemoglobinaOk && respostasSim.length === 0,
    pesoOk,
    sistolicaOk,
    diastolicaOk,
    hemoglobinaOk,
    respostasSim,
  };
}

// O enfermeiro digita só os números e a barra entra sozinha: 12080 vira "120/80".
// Sistólica começando com 1 ou 2 tem 3 dígitos (100 a 299), as outras têm 2 (90 a 99).
export function formatarPressao(texto: string): string {
  const digitos = texto.replace(/\D/g, "");
  const tamanhoSistolica = digitos.startsWith("1") || digitos.startsWith("2") ? 3 : 2;
  const sistolica = digitos.slice(0, tamanhoSistolica);
  const diastolica = digitos.slice(tamanhoSistolica, tamanhoSistolica + 3);
  return diastolica ? `${sistolica}/${diastolica}` : sistolica;
}

// O enfermeiro digita só os números e a vírgula entra sozinha: 135 vira "13,5".
// Começando com 1, a parte inteira tem 2 dígitos (10 a 19). Senão tem 1 (ex.: 9,8).
export function formatarHemoglobina(texto: string): string {
  const digitos = texto.replace(/\D/g, "");
  const tamanhoInteiro = digitos.startsWith("1") ? 2 : 1;
  const inteiro = digitos.slice(0, tamanhoInteiro);
  const decimal = digitos.slice(tamanhoInteiro, tamanhoInteiro + 2);
  return decimal ? `${inteiro},${decimal}` : inteiro;
}

