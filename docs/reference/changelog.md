# Changelog

Todas as mudancas relevantes do projeto devem ser registradas neste arquivo.

O formato segue a ideia do Keep a Changelog e usa versionamento cronologico enquanto o projeto nao possuir tags semanticas publicadas.

## 2026-07-08

### Adicionado

- Pipeline GitHub Actions para gerar demo e documentacao.
- Estrutura doc-as-code organizada por Diataxis.
- Gerador estatico de documentacao em Node.js.
- Documentacao Arc42.
- Diagramas C4 de contexto, containers e componentes.
- Primeiro ADR para a decisao de documentacao como codigo.

### Alterado

- Publicacao da documentacao passou a ficar em `docs/documentation/`.
- `docs/` passou a conter a demo publicada e as fontes Markdown da documentacao.

### Corrigido

- Restaurado `docs/index.html` para manter compatibilidade com GitHub Pages configurado para publicar a partir de `master/docs`.

## Convencao

- `Adicionado`: novas funcionalidades, documentos ou capacidades.
- `Alterado`: mudancas em comportamento, estrutura ou processo.
- `Corrigido`: correcoes de falhas.
- `Removido`: itens removidos intencionalmente.
