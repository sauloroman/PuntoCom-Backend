import { DomainError } from '../errors/domain.error';

export class ProductCode {
  
  private readonly _value: string;
  
  private static MAX_QUANTITY_CHARACTERS: number = 15
  private readonly MESSAGE_ERROR: string = "PRODUCT_CODE_VALIDATION_ERROR"

  constructor( value: string ) {
    const code = value.trim()

    if (!/^\d+$/.test(code)) {
      throw new DomainError(this.MESSAGE_ERROR, 'El código del producto debe ser un número entero positivo');
    }
    if (code.length > ProductCode.MAX_QUANTITY_CHARACTERS ) {
      throw new DomainError(this.MESSAGE_ERROR, 'El código del producto no puede tener más de 15 dígitos');
    }

    this._value = code;
  }

  public get value(): string {
    return this._value
  }

  public equals( other: ProductCode ): boolean {
    return this._value === other.value
  }

}