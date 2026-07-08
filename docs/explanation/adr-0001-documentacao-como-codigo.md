# ADR 0001: Documentacao como codigo

## Status

Aceita.

## Contexto

O projeto precisa manter a demo da ferramenta publicada no GitHub Pages e, ao mesmo tempo, disponibilizar documentacao tecnica atualizada. A documentacao deve acompanhar a evolucao do codigo, ser revisada em pull requests e evitar dependencias operacionais desnecessarias.

## Decisao

Manter a documentacao como arquivos Markdown no repositorio, organizada pelo framework Diataxis e gerada automaticamente por um script Node.js executado na pipeline.

A publicacao fica organizada assim:

- Demo da aplicacao: raiz de `docs/`.
- Documentacao publicada: `docs/documentation/`.
- Fontes Markdown: `docs/tutorials`, `docs/how-to`, `docs/reference` e `docs/explanation`.

## Consequencias

### Positivas

- Codigo e documentacao evoluem no mesmo fluxo de revisao.
- Historico de mudancas fica rastreavel pelo Git.
- A documentacao publicada e reproduzivel localmente.
- A estrutura Diataxis reduz mistura entre tutoriais, guias, referencia e explicacoes.

### Negativas

- A pasta `docs/` passa a conter tanto fontes Markdown quanto artefatos publicados.
- A pipeline precisa manter a raiz de `docs/` com `index.html` para compatibilidade com GitHub Pages.
- Mudancas no gerador exigem validacao visual da documentacao publicada.

## Alternativas consideradas

### Usar somente GitHub Wiki

Rejeitada porque separaria documentacao do fluxo principal de pull requests e dificultaria revisao junto com mudancas de codigo.

### Usar ferramenta externa de documentacao

Rejeitada no momento para evitar novas dependencias e manter a publicacao simples no GitHub Pages.

### Publicar exclusivamente por artifact de GitHub Pages

Adiada porque o repositorio ja usa GitHub Pages a partir de `master/docs`; mudar a configuracao poderia interromper a demo publicada.
