# CareBridge Domain Context

## System Overview
CareBridge is an AI-powered continuity-of-care platform targeting post-consultation patient follow-up via WhatsApp, providing real-time recovery monitoring and risk alerts to doctors.

## Ubiquitous Language & Core Concepts

- **Doctor**: Medical professional authorized to manage patients and register consultations.
- **Patient**: Individual receiving medical care and follow-ups via WhatsApp in their preferred language (EN, FR, Kinyarwanda, Swahili).
- **Consultation**: Record of a clinical visit including diagnosis, prescribed medications, notes, next visit date, and automated follow-up schedule.
- **FollowUp**: Scheduled touchpoint (e.g. Day 1, Day 3, Day 7 post-consultation) containing AI-generated check-in questions sent via WhatsApp.
- **FollowUpResponse**: Patient reply received via WhatsApp webhook, analyzed by AI for sentiment and red flag alerts.
- **Alert**: Real-time push notification and high-severity flag generated when a patient response indicates potential medical risk.
- **Recovery Summary**: Concise, AI-generated narrative summarizing patient progress and adherence prior to their next clinic visit.
