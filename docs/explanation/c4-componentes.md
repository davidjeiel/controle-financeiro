# Diagramas C4 componentes

Esta pagina apresenta visoes C4 em Mermaid para explicar o contexto, containers e componentes principais da aplicacao.

## Nivel 1: contexto

```mermaid
flowchart LR
  User["Pessoa usuaria\ncontrola receitas e despesas"]
  System["Controle Financeiro\naplicacao web"]
  Pages["GitHub Pages\npublica demo e documentacao"]

  User -->|"usa no navegador"| System
  System -->|"e publicado em"| Pages
```

## Nivel 2: containers

```mermaid
flowchart TB
  subgraph Browser["Navegador"]
    ReactApp["React SPA\ninterface da ferramenta"]
    LocalState["Estado local\ntransacoes e totais"]
  end

  subgraph GitHub["GitHub"]
    Repo["Repositorio\ncodigo e docs"]
    Actions["GitHub Actions\nbuild e publicacao"]
    Pages["GitHub Pages\nsite estatico"]
  end

  ReactApp --> LocalState
  Repo --> Actions
  Actions --> Pages
  Pages --> ReactApp
```

## Nivel 3: componentes

```mermaid
flowchart TB
  App["App.jsx\norquestra estado e layout"]
  Header["Header\ncabecalho"]
  Resume["Resume\nindicadores financeiros"]
  Form["Form\ncadastro de transacao"]
  Grid["Grid\nlista transacoes"]
  GridItem["GridItem\nlinha de transacao"]
  Styles["global.jsx\nestilos globais"]

  App --> Header
  App --> Resume
  App --> Form
  App --> Grid
  Grid --> GridItem
  App --> Styles
  Form -->|"adiciona transacao"| App
  GridItem -->|"remove transacao"| App
  App -->|"calcula totais"| Resume
```

## Notas de leitura

- O nivel de contexto mostra o sistema como uma caixa unica.
- O nivel de containers separa navegador, repositorio, pipeline e Pages.
- O nivel de componentes detalha a composicao React atual.
