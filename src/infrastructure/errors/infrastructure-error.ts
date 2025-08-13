export class InfrastructureError extends Error {
  public readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'InfrastructureError';
    this.originalError = originalError;

    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}
