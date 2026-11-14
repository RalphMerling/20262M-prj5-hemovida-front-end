import type { Genero } from "@/models/doador";

// Regra RN01 do MS1: só doa quem tem de 18 a 69 anos.
// O backend valida de novo. Aqui é só para avisar antes de enviar.
export const IDADE_MINIMA = 18;
export const IDADE_MAXIMA = 69;

// Recebe "AAAA-MM-DD" e devolve a idade em anos.
export function calcularIdade(nascimento: string, hoje: Date = new Date()): number {
  const [ano, mes, dia] = nascimento.split("-").map(Number);
  let idade = hoje.getFullYear() - ano;
  const aindaNaoFezAniversario =
    hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia);
  if (aindaNaoFezAniversario) idade -= 1;
  return idade;
}

export function idadePermitida(nascimento: string): boolean {
  const idade = calcularIdade(nascimento);
  return idade >= IDADE_MINIMA && idade <= IDADE_MAXIMA;
}

// RN03: intervalo legal entre doações. Homens 60 dias, mulheres 90 (outros: 90, o prazo mais seguro).
export function intervaloEmDias(genero: Genero): number {
  return genero === "Masculino" ? 60 : 90;
}

// Quantos dias faltam para o doador poder doar de novo (0 = já pode).
export function diasParaProximaDoacao(genero: Genero, ultimaDoacao: string, hoje: Date = new Date()): number {
  const [ano, mes, dia] = ultimaDoacao.split("-").map(Number);
  const ultima = new Date(ano, mes - 1, dia);
  const diasPassados = Math.floor((hoje.getTime() - ultima.getTime()) / 86_400_000);
  return Math.max(0, intervaloEmDias(genero) - diasPassados);
}