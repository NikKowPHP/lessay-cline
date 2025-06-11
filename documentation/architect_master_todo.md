Understood. The planning phase continues with absolute precision. The next set of directives for the Developer AI will move the application from a functional MVP to a production-hardened state.

As the Architect AI, I will now generate the **definitive master plan** for this next stage of development. This is not a suggestion; it is the required sequence of operations.

---

### **`documentation/architect_master_todo.md` (Updated)**

# Architect Master To-Do List: Production Hardening

**Objective:** To generate the final implementation plans required to move the Lessay application from a functional MVP to a production-ready state. This involves adding comprehensive error handling, security, performance optimizations, observability, and testing.

**Prioritization Note:** The following tasks must be generated and executed in the specified sequential order. Each phase builds a necessary foundation for the next.

---

- [ ] **Task 1: Generate `hardening_phase_1_observability.md`**
    - **Action:** Create tasks to implement structured logging and a health check endpoint, providing the foundation for monitoring application health and debugging issues in a production environment.
    - **LLM Prompt:** "Generate a to-do list file named `/documentation/hardening_phase_1_observability.md`. The tasks must instruct the Developer AI to:
        1.  Execute `npm install pino pino-pretty`.
        2.  Create a logger utility at `/lib/logger.ts` that initializes and exports a single `pino` instance.
        3.  Systematically replace all `console.log` statements throughout the entire codebase with the appropriate logger methods (e.g., `logger.info`, `logger.warn`, `logger.error`).
        4.  Create a new API route at `/app/api/health/route.ts` that performs a basic check (e.g., a simple Prisma query like `prisma.$queryRaw` to check DB connection) and returns a 200 OK status if successful, or a 503 Service Unavailable if not."

- [ ] **Task 2: Generate `hardening_phase_2_error_handling.md`**
    - **Action:** Create tasks to implement robust error handling across the entire application to ensure stability and provide meaningful error responses.
    - **LLM Prompt:** "Generate a to-do list file named `/documentation/hardening_phase_2_error_handling.md`. The tasks must instruct the Developer AI to:
        1.  Modify every API route in the `/app/api/` directory.
        2.  Wrap the entire body of each exported function (`GET`, `POST`, `PUT`, etc.) in a `try...catch` block.
        3.  In the `catch` block, log the error using the `logger.error` utility.
        4.  For specific, known error types (e.g., `PrismaClientKnownRequestError` for database issues), return a specific HTTP status code (e.g., 404 for 'not found' errors, 400 for bad requests).
        5.  For all other unexpected errors, return a generic 500 Internal Server Error response with a standardized JSON error shape like `{\"error\": \"An unexpected error occurred.\"}`."

- [ ] **Task 3: Generate `hardening_phase_3_security.md`**
    - **Action:** Create tasks to add critical security layers, including input validation and rate limiting, to protect the application from malicious use and abuse.
    - **LLM Prompt:** "Generate a to-do list file named `/documentation/hardening_phase_3_security.md`. The tasks must instruct the Developer AI to:
        1.  Execute `npm install zod`.
        2.  For each API route that accepts a request body (`POST`, `PUT`), create a Zod schema that validates the shape, type, and constraints of the incoming data.
        3.  Implement the validation logic at the beginning of each route handler. If validation fails, return a 400 Bad Request response with the validation errors.
        4.  Execute `npm install @upstash/ratelimit`.
        5.  Implement IP-based rate limiting on the most sensitive endpoints: user sign-up, user sign-in, and `/api/lessons/start`. Configure it to allow a reasonable number of requests per minute."

- [ ] **Task 4: Generate `hardening_phase_4_performance.md`**
    - **Action:** Create tasks to optimize database performance and implement caching for high-traffic endpoints.
    - **LLM Prompt:** "Generate a to-do list file named `/documentation/hardening_phase_4_performance.md`. The tasks must instruct the Developer AI to:
        1.  Analyze the Prisma schema at `/prisma/schema.prisma`. Add a compound `@@index([userId, metric])` attribute to the `UserProgress` model to optimize dashboard queries.
        2.  Execute `npx prisma migrate dev --name add_performance_indexes` to apply the new index to the database.
        3.  Implement a basic in-memory caching strategy for the dashboard API routes (`/api/stats/*`). The data should be cached for a short duration (e.g., 5 minutes) to reduce redundant database queries for frequent visitors."

- [ ] **Task 5: Generate `hardening_phase_5_testing.md`**
    - **Action:** Create tasks to build a comprehensive test suite based on the formal test plan, ensuring the application's logic is verifiable and correct.
    - **LLM Prompt:** "Generate a to-do list file named `/documentation/hardening_phase_5_testing.md`. The tasks must instruct the Developer AI to:
        1.  Reference the `documentation/templates/test_plan_template.md` as the source of truth for test cases.
        2.  Create a new test file for user authentication (`/tests/auth.test.ts`) and implement tests for sign-up success, sign-up failure (duplicate user), login success, and login failure.
        3.  Create a new test file for the learning loop (`/tests/lessons.test.ts`) and implement tests for starting a lesson and submitting both correct and incorrect answers.
        4.  Modify the CI workflow at `/.github/workflows/ci.yml` to execute the `npm test` command after the `npm run lint` step."