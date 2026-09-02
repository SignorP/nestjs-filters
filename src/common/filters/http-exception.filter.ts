import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const errorResponse = {
            success: false,
            statusCode: status,
            error: typeof exceptionResponse === 'object'
                ? exceptionResponse
                : { message: exceptionResponse },
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
        };

        this.logger.warn(
            `[${request.method}] ${request.url} - Status: ${status} - Message: ${typeof exceptionResponse === 'object'
                ? JSON.stringify((exceptionResponse as any).message || exceptionResponse)
                : exceptionResponse
            }`
        );

        response.status(status).json(errorResponse);
    }
}
