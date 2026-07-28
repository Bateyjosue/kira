# ADR-0004: Redis + BullMQ for Follow-Up Scheduling

- **Status**: Accepted
- **Context**: Scheduled post-consultation follow-ups (Day 1, 3, 7) require reliable background job queue.
- **Decision**: BullMQ backed by Redis.
- **Consequences**: Reliable retry logic and job scheduling with active workers processing touchpoints.
