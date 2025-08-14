import { DomainError } from '../errors/domain.error';

export class Stock {
  private readonly _quantity: number;
  private readonly MESSAGE_ERROR: string = "STOCK_VALIDATION_ERROR"

  constructor( quantity: number ) {
    if( !Number.isInteger(quantity) || quantity < 0 ) {
      throw new DomainError(this.MESSAGE_ERROR, 'El stock debe ser un número entero no negativo')
    }
    this._quantity = quantity
  }

  public get value(): number {
    return this._quantity
  }

  public equals( other: Stock ): boolean {
    return this._quantity === other.value
  }

}


