# Endpoints

Referencia dos endpoints expostos ou consumidos pela aplicacao.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/health` | Verifica disponibilidade do servico. |
| GET | `/transactions` | Lista transacoes financeiras. |
| POST | `/transactions` | Registra uma nova transacao. |
| DELETE | `/transactions/{id}` | Remove uma transacao existente. |

## Padroes

- Respostas devem usar JSON.
- Erros devem seguir o catalogo de codigos.
- Endpoints protegidos devem exigir autenticacao.
