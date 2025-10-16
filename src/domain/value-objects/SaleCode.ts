import { DomainError } from "../errors/domain.error";

export class SaleCode {

    private readonly _value: string
    private static MAX_QUANTITY_CHARACTERS: number = 5
    private readonly MESSAGE_ERROR: string = 'SALE_CODE_VALIDATION_ERROR'

    constructor( value: string ) {
        const code = value.trim()

        if (code.length > SaleCode.MAX_QUANTITY_CHARACTERS ) {
            throw new DomainError(this.MESSAGE_ERROR, 'El código del producto no puede tener más de 15 dígitos');
        }

        const alphanumericRegex = /^[a-zA-Z0-9]+$/;
        if (!alphanumericRegex.test(code)) {
            throw new DomainError(
                this.MESSAGE_ERROR,
                'El código de venta debe ser alfanumérico (solo letras y números)'
            );
        }

        this._value = value
    }

    public get value(): string {
        return this._value
    }

    public equals( other: SaleCode ): boolean {
        return this._value === other.value
    }


}