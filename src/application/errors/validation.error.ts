import { ApplicationError } from './application.error';

export class ValidationError extends ApplicationError {
  constructor(message: string, code?: string) {
    super(message, code ?? 'VALIDATION_ERROR');
  }
}
