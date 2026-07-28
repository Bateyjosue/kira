# ADR-0006: Monorepo with Shared Types

- **Status**: Accepted
- **Context**: TypeScript frontend and backend share domain interfaces.
- **Decision**: Single repository using npm workspaces with `/packages/server`, `/packages/client`, and `/packages/shared`.
- **Consequences**: Unified type safety across stack, simplified local development and build pipelines.
