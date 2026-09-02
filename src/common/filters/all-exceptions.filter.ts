import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
            exception instanceof Error ? exception.message : 'Internal server error';

        const errorResponse = {
            success: false,
            statusCode: status,
            error: {
                message: 'Internal server error',
            },
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        this.logger.error(
            `[${request.method}] ${request.url} - Unhandled Exception: ${message}`,
            exception instanceof Error ? exception.stack : String(exception)
        );

        response.status(status).json(errorResponse);
    }
}
