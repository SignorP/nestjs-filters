# NestJS Exception Filters Pack

A production-ready, modular exception handling ecosystem for **NestJS**. Instead of hiding your error-handling logic behind a black-box NPM dependency, this recipe injects customizable exception filters directly into your project's `src/common/filters` directory.

Take full control over how your API responds to errors, formats JSON, and logs issues to your terminal.

---

## Installation via Nex CLI

Install the filters directly into your project. You will be prompted to select the variants you need:

```bash
xnex install nestjs-filters
```

### Available Variants

* **`http-only`**: Captures standard NestJS HTTP exceptions (`BadRequestException`, `NotFoundException`, etc.) and returns a cleanly formatted JSON response while logging the status to the terminal.
* **`global-catchall`**: Your safety net. Captures unexpected server crashes and `TypeError`s, returning a secure `500 Internal Server Error` without leaking sensitive stack traces to the client.
* **`typeorm`**: Automatically catches database-level TypeORM errors (like unique constraint `UNIQUE` failures) and maps them to appropriate HTTP status codes (e.g., `409 Conflict`).

---

## Quick Start

Once installed, register the filters globally in your `main.ts` file.

*Note: The order matters. Register generic filters first, and specific filters last so they can take precedence.*

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TypeOrmExceptionFilter } from './common/filters/typeorm-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Apply filters globally
    app.useGlobalFilters(
        new AllExceptionsFilter(),     // 1. Catch unhandled system errors
        new TypeOrmExceptionFilter(),  // 2. Catch database constraint errors
        new HttpExceptionFilter()      // 3. Catch standard HTTP errors
    );

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Customization

Because these files live in your `src/common/filters` directory, they are completely yours. Want to send critical 500 errors to a Slack channel or Discord webhook? Just open `all-exceptions.filter.ts` and drop your logic right in.

They're all yours. 👈(ﾟヮﾟ👈)
