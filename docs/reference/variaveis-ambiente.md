# Variaveis ambiente

Referencia das variaveis usadas pela aplicacao e pelas integracoes.

| Nome | Obrigatoria | Descricao |
| --- | --- | --- |
| `REACT_APP_API_URL` | Sim | URL base da API consumida pelo frontend. |
| `REACT_APP_ENV` | Nao | Nome do ambiente em execucao. |
| `OAUTH_CLIENT_ID` | Quando OAuth2 ativo | Identificador publico do cliente OAuth2. |
| `OAUTH_CLIENT_SECRET` | Quando OAuth2 ativo | Segredo do cliente OAuth2. |

## Seguranca

Segredos nao devem ser versionados. Use secrets do GitHub Actions ou variaveis protegidas do ambiente.
