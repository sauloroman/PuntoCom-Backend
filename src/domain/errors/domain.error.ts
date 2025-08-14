export class DomainError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(`[DOMAIN - ${code}]: ${message}`);
    this.name = this.constructor.name;
  }
}
