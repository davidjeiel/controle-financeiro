# Modelo dados

Referencia dos principais objetos de dados.

## Transaction

| Campo | Tipo | Descricao |
| --- | --- | --- |
| `id` | string | Identificador unico da transacao. |
| `description` | string | Descricao informada pelo usuario. |
| `amount` | number | Valor financeiro da transacao. |
| `expense` | boolean | Indica se e despesa. |
| `createdAt` | string | Data de criacao no formato ISO 8601. |

## Regras

- Valores positivos representam entradas ou saidas conforme o campo `expense`.
- Identificadores devem ser estaveis para edicao e exclusao.
