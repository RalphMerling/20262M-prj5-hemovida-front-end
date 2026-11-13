// Funções que só mudam a APARÊNCIA de um dado. O dado guardado continua sem máscara.

export function formatarCpf(cpf: string): string {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}

export function formatarTelefone(telefone: string): string {
  if (telefone.length === 11) return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return telefone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
}

// "2026-02-13" vira "13/02/2026"
export function formatarDataBR(data: string): string {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}