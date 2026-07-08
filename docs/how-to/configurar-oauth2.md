# Configurar OAuth2

Use este guia quando a aplicacao precisar autenticar chamadas em APIs protegidas por OAuth2.

## Procedimento

1. Cadastre a aplicacao no provedor de identidade.
2. Configure `client_id`, `client_secret`, escopos e URL de callback.
3. Armazene segredos em variaveis protegidas do ambiente.
4. Valide a obtencao do token antes de chamar APIs internas.

## Checklist

- Credenciais fora do codigo-fonte.
- Escopos limitados ao necessario.
- Renovacao de token documentada.
- Erros de autenticacao registrados em log.
