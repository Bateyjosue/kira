# ADR-0001: MongoDB over PostgreSQL

- **Status**: Accepted
- **Context**: Need flexible schema for varied consultation data (different diagnoses have different fields), fast iteration for hackathon.
- **Decision**: MongoDB with Mongoose ODM.
- **Consequences**: Flexible schema speeds development; lose relational integrity but acceptable for MVP. Use MongoDB Atlas free tier or Docker container.
