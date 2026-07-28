# ADR-0002: WhatsApp Cloud API (Meta) for Patient Communication

- **Status**: Accepted
- **Context**: WhatsApp has high penetration in Rwanda. Patients require no new app download.
- **Decision**: Use Meta WhatsApp Cloud API with webhook-based message handling.
- **Consequences**: Generous free tier. Webhook requires public HTTPS endpoint (ngrok in dev, Cloud Run in prod).
