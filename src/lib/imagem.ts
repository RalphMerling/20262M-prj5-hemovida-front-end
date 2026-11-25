// Coloca o prefixo do site (/hemovida) na frente do caminho de uma imagem da pasta public.
// Uso: imagem("/img/tubo-sangue.png")
export function imagem(caminho: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${caminho}`;
}