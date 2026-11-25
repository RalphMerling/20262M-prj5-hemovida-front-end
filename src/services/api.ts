// Ajudante que todos os services usam para falar com a API (sempre pelo gateway).

// true = dados de mentira. Só vira false quando a variável está escrita exatamente como "false".
export const USAR_MOCK = process.env.NEXT_PUBLIC_USAR_MOCK !== "false";

const URL_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:7501";

// Um erro vindo da API, com o código HTTP (400, 401, 403, 404, 409...) e uma mensagem pronta para mostrar.
export class ErroDeApi extends Error {
  status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = "ErroDeApi";
    this.status = status;
  }
}

function mensagemPorStatus(status: number, detalhe: string): string {
  switch (status) {
    case 400:
      return detalhe || "Alguns dados estão inválidos. Confira e tente de novo.";
    case 401:
      return "Sua sessão expirou. Entre novamente.";
    case 403:
      return "Você não tem permissão para fazer isso.";
    case 404:
      return detalhe || "Não encontrado.";
    case 409:
      return "Já existe um cadastro com esse CPF.";
    case 429:
      return "Muitas tentativas em pouco tempo. Aguarde um minutinho e tente de novo.";
    case 502:
    case 503:
      return "Serviço indisponível no momento. Tente novamente em instantes.";
    default:
      return "Algo deu errado no servidor. Tente de novo em instantes.";
  }
}

// Transforma qualquer erro em uma frase para mostrar na tela.
export function mensagemDoErro(erro: unknown): string {
  return erro instanceof ErroDeApi ? erro.message : "Algo deu errado. Tente de novo.";
}

// Espera um pouquinho. Usada no modo mock para simular a demora de uma chamada de verdade.
export function esperar(milissegundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, milissegundos));
}

function pegarToken(): string | null {
  // TODO (branch do login): ler o token do login de verdade.
  // Por enquanto, um token de teste que fica só no .env.local.
  return process.env.NEXT_PUBLIC_TOKEN_DE_TESTE ?? null;
}

interface OpcoesDaRequisicao {
  metodo?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  corpo?: unknown;
  // true = rota pública (como o cadastro e o login): não manda o token.
  semToken?: boolean;
}

// Faz uma chamada para a API e devolve o JSON. Em caso de erro, lança um ErroDeApi.
export async function requisicao<T>(caminho: string, opcoes: OpcoesDaRequisicao = {}): Promise<T> {
  const token = opcoes.semToken ? null : pegarToken();

  let resposta: Response;
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: opcoes.metodo ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: opcoes.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
      cache: "no-store",
    });
  } catch {
    // Servidor desligado, sem internet ou bloqueio de CORS.
    throw new ErroDeApi(0, "Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.");
  }

  if (!resposta.ok) {
    let detalhe = "";
    try {
      // Os serviços (NestJS) devolvem { message: "texto" } ou { message: ["texto 1", "texto 2"] }.
      // O gateway devolve { erro: "texto" }.
      const json: { message?: string | string[]; erro?: string } = await resposta.json();
      detalhe = Array.isArray(json.message) ? json.message.join(" ") : (json.message ?? json.erro ?? "");
    } catch {
      // Se a resposta não for JSON, usamos só a mensagem padrão.
    }
    throw new ErroDeApi(resposta.status, mensagemPorStatus(resposta.status, detalhe));
  }

  return (await resposta.json()) as T;
}