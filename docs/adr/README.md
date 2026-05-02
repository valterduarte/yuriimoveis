# Architecture Decision Records

Registros das decisões arquiteturais tomadas no projeto. Use o formato
[Michael Nygard ADR](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
adaptado.

| #    | Título                                                            | Status   |
|-----:|-------------------------------------------------------------------|----------|
| 0001 | [Data layer organizado por domínio](./0001-data-layer-by-domain.md)        | Aceito   |
| 0002 | [Vitest como test runner](./0002-vitest-instead-of-jest.md)                | Aceito   |
| 0003 | [Três camadas de quality gate](./0003-quality-gates.md)                    | Aceito   |

## Quando criar um ADR

- Decisão que afeta **mais de uma feature**.
- Decisão **difícil de reverter** (escolha de framework, schema de banco).
- Decisão que **outras pessoas vão questionar** ("por que não X?").

Não vale a pena criar ADR para:
- Renomear variável.
- Bug fix.
- Adicionar uma rota nova seguindo o padrão existente.
