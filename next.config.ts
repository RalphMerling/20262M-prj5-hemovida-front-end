import type { NextConfig } from "next";

// Publicado, o site fica em /hemovida. No seu computador (npm run dev) não muda nada.
const basePath = process.env.NODE_ENV === "production" ? "/hemovida" : "";

const nextConfig: NextConfig = {
  // Gera o site como arquivos prontos na pasta "out" (o nginx serve esses arquivos)
  output: "export",
  // O otimizador de imagens do Next precisa de servidor, então fica desligado
  images: { unoptimized: true },
  basePath,
  // Deixa o prefixo disponível para o código (usado em src/lib/imagem.ts)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;