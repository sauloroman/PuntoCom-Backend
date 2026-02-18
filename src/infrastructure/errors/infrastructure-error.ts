export class InfrastructureError extends Error {
  public readonly cause?: unknown;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.cause = cause;

    if (cause instanceof Error && cause.stack) {
      this.stack += '\nCaused by: ' + cause.stack;
    }
  }

  public readonly code?: string;
}
