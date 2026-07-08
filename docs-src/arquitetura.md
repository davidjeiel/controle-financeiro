# Arquitetura

Esta documentacao segue o padrao doc-as-code: o conteudo fica versionado em Markdown, passa por revisao junto com o codigo e e publicado automaticamente pela pipeline.

## Estrutura da aplicacao

- `src/`: codigo React da ferramenta de controle financeiro.
- `public/`: arquivos publicos usados pelo build da aplicacao.
- `docs/`: saida estatica publicada pelo GitHub Pages.
- `docs/documentation/`: documentacao HTML gerada automaticamente.
- `docs-src/`: fonte Markdown da documentacao tecnica.
- `scripts/generate-docs.js`: gerador local usado pela pipeline.

## Fluxo de publicacao

1. Desenvolvedores atualizam arquivos Markdown em `README.md` ou `docs-src/`.
2. A pipeline instala dependencias, executa o build da aplicacao e gera a documentacao.
3. O conteudo final e publicado no GitHub Pages mantendo a demo em `/` e a documentacao em `/documentation/`.

## Convencoes

- Use Markdown simples para facilitar revisao em pull requests.
- Prefira secoes curtas com comandos reproduziveis.
- Atualize a documentacao no mesmo pull request da alteracao funcional.
