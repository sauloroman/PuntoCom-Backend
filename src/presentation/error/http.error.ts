export class HttpError extends Error {
  public readonly statusCode: number;

  constructor( message: string, statusCode: number ) {
    super( message )
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}