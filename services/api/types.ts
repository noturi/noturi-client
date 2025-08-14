export interface ErrorResponseBody {
  statusCode: number;
  code?: number;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  statusCode: number;
  code?: number;
  details?: unknown;

  constructor(body: ErrorResponseBody) {
    super(body.message);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.code = body.code;
    this.details = body.details;
  }
}