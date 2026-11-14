// Consulta o ViaCEP e devolve o endereço
export async function buscarEnderecoPorCep(cep: string): Promise<string> {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("O CEP deve ter exatamente 8 números.");
  }

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (!resposta.ok) {
    throw new Error("Não foi possível consultar o CEP.");
  }

  const dados = await resposta.json();
  if (dados.erro) {
    throw new Error("CEP não encontrado.");
  }

  // O banco guarda o endereço (doador_endereco).
  return [dados.logradouro, dados.bairro, `${dados.localidade} - ${dados.uf}`]
    .filter(Boolean)
    .join(", ");
}