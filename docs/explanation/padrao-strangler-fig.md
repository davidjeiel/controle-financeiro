# Padrao Strangler Fig

O padrao Strangler Fig e uma estrategia para modernizar sistemas gradualmente, substituindo partes antigas por novas implementacoes sem uma migracao completa de uma vez.

## Aplicacao no contexto do projeto

Quando novas APIs ou modulos forem introduzidos, eles podem ser publicados em paralelo aos fluxos existentes. O gateway ou a camada de roteamento direciona chamadas para a nova implementacao conforme cada parte fica pronta.

## Beneficios

- Reduz risco de migracoes grandes.
- Permite entregas incrementais.
- Facilita rollback por funcionalidade.
