# Pipeline de documentacao

A pipeline `.github/workflows/pages-docs.yml` automatiza a publicacao da demo e da documentacao.

## Gatilhos

- `push` na branch `main`.
- `workflow_dispatch` para execucao manual.

## Etapas

1. Baixa o repositorio.
2. Configura Node.js.
3. Instala dependencias com `npm ci`.
4. Gera o build da aplicacao React.
5. Copia o build para `docs/`.
6. Executa `npm run docs:build`.
7. Publica o diretorio `docs/` no GitHub Pages.

## Como gerar localmente

```shell
npm run docs:build
```

Depois da execucao, abra `docs/documentation/index.html` para validar a documentacao.

## URL esperada

- Demo da ferramenta: raiz do GitHub Pages.
- Documentacao: `/documentation/`.
