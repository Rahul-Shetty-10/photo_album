export class AppError extends Error {
  public readonly isOperational: boolean;
  public readonly statusCode: number;

  public constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
