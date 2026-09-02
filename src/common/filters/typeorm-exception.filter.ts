import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(TypeOrmExceptionFilter.name);

    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // Postgres / SQLite duplicate key kontrolleri
        const driverError = exception.driverError as any;
        let status = HttpStatus.BAD_REQUEST;
        let message = 'Database query error';

        if (driverError?.code === '23505' || driverError?.message?.includes('UNIQUE')) {
            status = HttpStatus.CONFLICT;
            message = 'Duplicate entry conflict';
        }

        const errorResponse = {
            success: false,
            statusCode: status,
            error: { message },
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        this.logger.error(
            `[DB Error] [${request.method}] ${request.url} - ${exception.message}`
        );

        response.status(status).json(errorResponse);
    }
}
