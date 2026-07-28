# ADR-0003: Google Gemini as AI Engine

- **Status**: Accepted
- **Context**: Multilingual medical follow-up generation and summarization required.
- **Decision**: Gemini 2.0 Flash via `@google/generative-ai` SDK.
- **Consequences**: Fast inference, multilingual support (including Kinyarwanda). Medical safety prompts required to enforce zero diagnosis/prescribing by AI.
