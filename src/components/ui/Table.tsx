import type { ReactNode } from "react";

export interface Coluna<T> {
  titulo: string;
  // O que mostrar na célula. Exemplo: (linha) => linha.nome
  render: (linha: T) => ReactNode;
  // Largura da coluna em porcentagem, por exemplo "25%". Todas somando 100%.
  largura?: string;
}

interface TableProps<T> {
  colunas: Coluna<T>[];
  dados: T[];
  vazio?: string; // texto quando não há nenhuma linha
  // Para tabelas largas: classe com a largura mínima, por exemplo "min-w-[1000px]".
  // Abaixo disso a tabela rola para o lado em vez de espremer as colunas.
  larguraMinima?: string;
}

// Tabela genérica: você diz as colunas e os dados, ela desenha.
// As larguras são fixas (table-fixed), por isso o cabeçalho fica sempre alinhado com as linhas.
export function Table<T>({ colunas, dados, vazio = "Nenhum registro encontrado.", larguraMinima = "" }: TableProps<T>) {
  if (dados.length === 0) {
    return <p className="py-6 text-center text-preto/70">{vazio}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className={`w-full table-fixed text-left text-sm ${larguraMinima}`}>
        <colgroup>
          {colunas.map((coluna) => (
            <col key={coluna.titulo} style={coluna.largura ? { width: coluna.largura } : undefined} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-preto/15 text-azul-1">
            {colunas.map((coluna) => (
              <th key={coluna.titulo} scope="col" className="px-2 py-3 align-bottom font-bold">
                {coluna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((linha, i) => (
            <tr key={i} className="border-b border-preto/10 last:border-0">
              {colunas.map((coluna) => (
                <td key={coluna.titulo} className="px-2 py-3.5 align-middle">
                  {coluna.render(linha)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}